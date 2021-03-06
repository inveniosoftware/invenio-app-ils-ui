import reducer, { initialState } from './reducer';
import { IS_LOADING, SUCCESS, HAS_ERROR } from './actions';
describe('Fetch patron details reducer', () => {
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
    const patron = { id: '1' };
    const action = {
      type: SUCCESS,
      payload: patron,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: patron,
      hasError: false,
    });
  });

  it('should change error state on error action', () => {
    const action = {
      type: HAS_ERROR,
      payload: { response: { status: 404 } },
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      hasError: true,
      error: { response: { status: 404 } },
    });
  });
});
