import reducer, { initialState } from './reducer';
import { IS_LOADING, SUCCESS, HAS_ERROR } from './actions';

describe('Fetch borrowingRequest details reducer', () => {
  it('should have initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should change loading state on loading action', () => {
    const action = {
      type: IS_LOADING,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should change data state on success action', () => {
    const borrowingRequest = { field: '123' };
    const action = {
      type: SUCCESS,
      payload: borrowingRequest,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: borrowingRequest,
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: HAS_ERROR,
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
