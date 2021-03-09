import { BackOfficeBase, BackOfficeRouteGenerators } from './backofficeUrls';
import { generatePath } from 'react-router-dom';

const ILLBase = `${BackOfficeBase}/ill`;

const ILLRoutesList = {
  borrowingRequestList: `${ILLBase}/borrowing-requests`,
  borrowingRequestDetails: `${ILLBase}/borrowing-requests/:borrowingRequestPid`,
  borrowingRequestEdit: `${ILLBase}/borrowing-requests/:borrowingRequestPid/edit`,
  borrowingRequestCreate: `${ILLBase}/borrowing-requests/create`,
};

export const ILLRoutesGenerators = {
  borrowingRequestListWithQuery: (qs) =>
    `${ILLRoutesList.borrowingRequestList}?q=${qs}`,
  borrowingRequestDetailsFor: (borrowingRequestPid) =>
    generatePath(ILLRoutesList.borrowingRequestDetails, {
      borrowingRequestPid: borrowingRequestPid,
    }),
  borrowingRequestEditFor: (borrowingRequestPid) =>
    generatePath(ILLRoutesList.borrowingRequestEdit, {
      borrowingRequestPid: borrowingRequestPid,
    }),
};

export const ILLRoutes = {
  ...ILLRoutesList,
  ...ILLRoutesGenerators,
};

export const DetailsRouteByPidTypeFor = (pidType) => {
  switch (pidType) {
    case 'pitmid':
      return BackOfficeRouteGenerators.itemDetailsFor;
    case 'illbid':
      return ILLRoutesGenerators.borrowingRequestDetailsFor;
    default:
      throw new Error(
        `Cannot generate url to the detail page for unknown pidType: ${pidType}`
      );
  }
};
