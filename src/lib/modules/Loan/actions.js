import { loanApi } from '@api/loans';
import { searchReady } from '@api/utils';
import {
  sendErrorNotification,
  sendSuccessNotification,
} from '@components/Notifications';
import { fetchItemDetails } from './../../pages/backoffice/Item/ItemDetails/state/actions';
import { invenioConfig } from '@config';

export const ACTION_IS_LOADING = 'loanAction/IS_LOADING';
export const ACTION_SUCCESS = 'loanAction/SUCCESS';
export const ACTION_HAS_ERROR = 'loanAction/HAS_ERROR';

export const DETAILS_IS_LOADING = 'fetchLoanDetails/IS_LOADING';
export const DETAILS_SUCCESS = 'fetchLoanDetails/SUCCESS';
export const DETAILS_HAS_ERROR = 'fetchLoanDetails/HAS_ERROR';

export const CIRCULATION_IS_LOADING = 'fetchCirculation/IS_LOADING';
export const CIRCULATION_SUCCESS = 'fetchCirculation/SUCCESS';
export const CIRCULATION_HAS_ERROR = 'fetchCirculation/HAS_ERROR';

export const fetchLoanDetails = (
  loanPid,
  withFetchOtherPendingLoans = null
) => {
  return async (dispatch) => {
    dispatch({
      type: DETAILS_IS_LOADING,
    });
    try {
      const response = await loanApi.get(loanPid);
      let firstLoanRequested = null;
      if (
        invenioConfig.CIRCULATION.loanRequestStates.includes(
          response.data.metadata.state
        ) &&
        withFetchOtherPendingLoans
      ) {
        const pendingLoansResponse = await loanApi.list(
          loanApi
            .query()
            .withDocPid(response.data.metadata.document_pid)
            .withState(invenioConfig.CIRCULATION.loanRequestStates)
            .sortByRequestStartDate()
            .qs()
        );
        if (pendingLoansResponse.data.total > 0) {
          firstLoanRequested = pendingLoansResponse.data.hits[0];
          firstLoanRequested.pid === response.data.pid
            ? (response.data['is_first_requested'] = true)
            : (response.data['is_first_requested'] = false);
        }
      }
      dispatch({
        type: DETAILS_SUCCESS,
        payload: response.data,
        firstLoanRequested: firstLoanRequested,
      });
    } catch (error) {
      dispatch({
        type: DETAILS_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};

export const performLoanAction = (
  actionURL,
  documentPid,
  patronPid,
  { itemPid = null, cancelReason = null, shouldFetchItemDetails = null } = {}
) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_IS_LOADING,
    });
    try {
      const response = await loanApi.doAction(
        actionURL,
        documentPid,
        patronPid,
        {
          itemPid: itemPid,
          cancelReason: cancelReason,
        }
      );
      await searchReady();

      dispatch({
        type: ACTION_SUCCESS,
        payload: response.data,
      });
      shouldFetchItemDetails
        ? dispatch(fetchItemDetails(itemPid.value))
        : dispatch(fetchLoanDetails(response.data.metadata.pid));
      const loanPid = response.data.pid;
      dispatch(
        sendSuccessNotification(
          'Successful loan action!',
          `The loan action was successful for loan PID ${loanPid}.`
        )
      );
    } catch (error) {
      dispatch({
        type: ACTION_HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
