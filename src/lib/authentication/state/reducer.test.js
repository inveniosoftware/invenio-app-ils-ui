import { IS_ANONYMOUS, IS_LOADING, SUCCESS } from './actions';
import reducer, { initialState } from './reducer';

describe('Authentication management reducer', () => {
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
    const userData = {
      id: '1',
      roles: ['admin'],
      username: 'johndoe',
      location_pid: '1',
    };
    const action = {
      type: SUCCESS,
      payload: userData,
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      data: userData,
      isAnonymous: false,
    });
  });

  it('should change anonymous state on anonymous action', () => {
    const action = {
      type: IS_ANONYMOUS,
      payload: 'Error',
    };
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      isLoading: false,
      isAnonymous: true,
    });
  });
});
