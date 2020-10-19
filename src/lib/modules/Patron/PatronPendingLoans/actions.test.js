import { loanApi } from '@api/loans';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './actions';
import { initialState } from './reducer';

jest.mock('@config');
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: { pid: '123' },
        },
      ],
    },
  },
};

const mockFetchUserLoan = jest.fn();
loanApi.list = mockFetchUserLoan;

let store;
beforeEach(() => {
  mockFetchUserLoan.mockClear();

  store = mockStore({ patronPendingLoans: initialState });
  store.clearActions();
});

describe('Patron loans tests', () => {
  describe('fetch Patron loans tests', () => {
    it('should dispatch a loading action when fetching patron loans', done => {
      mockFetchUserLoan.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: actions.IS_LOADING,
      };

      store.dispatch(actions.fetchPatronPendingLoans(2)).then(() => {
        expect(mockFetchUserLoan).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:(PENDING))&sort=-created&size=15&page=1'
        );
        const actions = store.getActions();
        expect(actions[0]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch a success action when patron loans fetch succeeds', done => {
      mockFetchUserLoan.mockResolvedValue(mockResponse);

      const expectedAction = {
        type: actions.SUCCESS,
        payload: mockResponse.data,
      };

      store.dispatch(actions.fetchPatronPendingLoans(2)).then(() => {
        expect(mockFetchUserLoan).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:(PENDING))&sort=-created&size=15&page=1'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });

    it('should dispatch an error action when patron loans fetch fails', done => {
      mockFetchUserLoan.mockRejectedValue([500, 'Error']);

      const expectedAction = {
        type: actions.HAS_ERROR,
        payload: [500, 'Error'],
      };

      store.dispatch(actions.fetchPatronPendingLoans(2)).then(() => {
        expect(mockFetchUserLoan).toHaveBeenCalledWith(
          '(patron_pid:2 AND state:(PENDING))&sort=-created&size=15&page=1'
        );
        const actions = store.getActions();
        expect(actions[1]).toEqual(expectedAction);
        done();
      });
    });
  });
});
