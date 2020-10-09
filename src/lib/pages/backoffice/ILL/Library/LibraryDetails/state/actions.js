import { libraryApi } from '@api/ill';
import { searchReady } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { goTo } from '@history';
import { ILLRoutes } from '@routes/urls';
export const IS_LOADING = 'fetchLibraryDetails/IS_LOADING';
export const SUCCESS = 'fetchLibraryDetails/SUCCESS';
export const HAS_ERROR = 'fetchLibraryDetails/HAS_ERROR';

export const DELETE_IS_LOADING = 'deleteLibrary/DELETE_IS_LOADING';
export const DELETE_SUCCESS = 'deleteLibrary/DELETE_SUCCESS';
export const DELETE_HAS_ERROR = 'deleteLibrary/DELETE_HAS_ERROR';

export const fetchLibraryDetails = pid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await libraryApi.get(pid);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const deleteLibrary = pid => {
  return async dispatch => {
    dispatch({
      type: DELETE_IS_LOADING,
    });

    try {
      await libraryApi.delete(pid);
      await searchReady();
      dispatch({
        type: DELETE_SUCCESS,
        payload: { pid: pid },
      });
      dispatch(
        sendSuccessNotification(
          'Success!',
          `The library ${pid} has been deleted.`
        )
      );
      goTo(ILLRoutes.libraryList);
    } catch (error) {
      dispatch({
        type: DELETE_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
