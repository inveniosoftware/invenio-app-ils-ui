import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from './actions';
import { initialState } from './reducer';
import { loanApi } from '@api/loans';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockDoCheckout = jest.fn();
loanApi.doCheckout = mockDoCheckout;
loanApi.list = jest.fn();

const response = { data: {} };
const expectedPayload = {};

const patronPid = '2';
const documentPid = '123';
const itemPid = { type: 'itemid', value: '22' };
const noForceCheckout = false;
const doForceCheckout = true;

let store;
beforeEach(() => {
  mockDoCheckout.mockClear();

  store = mockStore(initialState);
  store.clearActions();
});

describe('ItemsCheckout actions tests', () => {
  describe('Direct checkout of an item', () => {
    it('should dispatch an action when checkout', (done) => {
      mockDoCheckout.mockResolvedValue(response);

      const expectedActions = [
        {
          type: actions.IS_LOADING,
        },
      ];

      store
        .dispatch(actions.checkoutItem(documentPid, itemPid, patronPid))
        .then(() => {
          expect(mockDoCheckout).toHaveBeenCalledWith(
            documentPid,
            itemPid,
            patronPid,
            {
              force: noForceCheckout,
            }
          );

          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action forcing checkout', (done) => {
      mockDoCheckout.mockResolvedValue(response);

      const expectedActions = [
        {
          type: actions.IS_LOADING,
        },
      ];

      store
        .dispatch(
          actions.checkoutItem(documentPid, itemPid, patronPid, doForceCheckout)
        )
        .then(() => {
          expect(mockDoCheckout).toHaveBeenCalledWith(
            documentPid,
            itemPid,
            patronPid,
            {
              force: doForceCheckout,
            }
          );

          const actions = store.getActions();
          expect(actions[0]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action without forcing checkout', (done) => {
      mockDoCheckout.mockResolvedValue(response);

      const expectedActions = [
        {
          type: actions.SUCCESS,
          payload: expectedPayload,
        },
      ];

      store
        .dispatch(actions.checkoutItem(documentPid, itemPid, patronPid))
        .then(() => {
          expect(mockDoCheckout).toHaveBeenCalledWith(
            documentPid,
            itemPid,
            patronPid,
            {
              force: noForceCheckout,
            }
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });

    it('should dispatch an action when user fetch fails', (done) => {
      mockDoCheckout.mockRejectedValue([500, 'Error']);

      const expectedActions = [
        {
          type: actions.HAS_ERROR,
          payload: [500, 'Error'],
        },
      ];

      store
        .dispatch(actions.checkoutItem(documentPid, itemPid, patronPid))
        .then(() => {
          expect(mockDoCheckout).toHaveBeenCalledWith(
            documentPid,
            itemPid,
            patronPid,
            {
              force: noForceCheckout,
            }
          );
          const actions = store.getActions();
          expect(actions[1]).toEqual(expectedActions[0]);
          done();
        });
    });
  });
});
