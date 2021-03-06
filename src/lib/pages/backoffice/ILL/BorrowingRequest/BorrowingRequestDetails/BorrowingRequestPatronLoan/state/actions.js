import { borrowingRequestApi } from '@api/ill';
import { searchReady } from '@api/utils';
import { sendSuccessNotification } from '@components/Notifications';
import { SUCCESS as FETCH_SUCCESS } from '../../state/actions';

export const SUCCESS = 'borrowingRequestPatronLoanCreate/SUCCESS';
export const IS_LOADING = 'borrowingRequestPatronLoanCreate/IS_LOADING';
export const HAS_ERROR = 'borrowingRequestPatronLoanCreate/HAS_ERROR';
export const borrowingRequestPatronLoanCreate = (
  borrowingRequestPid,
  loanStartDate,
  loanEndDate
) => {
  return async (dispatch) => {
    dispatch({
      type: IS_LOADING,
    });

    try {
      const response = await borrowingRequestApi.createLoan(
        borrowingRequestPid,
        loanStartDate,
        loanEndDate
      );
      await searchReady();
      dispatch({
        type: SUCCESS,
      });
      // the response contains the updated borrowing request,
      // push it to the fetch redux action to re-render the component
      dispatch({
        type: FETCH_SUCCESS,
        payload: response.data,
      });
      dispatch(
        sendSuccessNotification('Success!', 'The new loan has been created.')
      );
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
    }
  };
};
