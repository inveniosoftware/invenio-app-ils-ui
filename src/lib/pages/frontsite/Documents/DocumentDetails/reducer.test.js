import {
  documentDetailsFrontReducer as reducer,
  initialState,
} from './reducer';
import * as actions from './actions';

describe('Fetch document details reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on loading action', () => {
    const action = {
      type: actions.IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should change data state on success action', () => {
    const document = { document_id: '1232423' };
    const action = {
      type: actions.SUCCESS,
      payload: document,
      loansPayload: {},
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: document,
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: actions.HAS_ERROR,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Error',
      hasError: true,
    });
  });
});
