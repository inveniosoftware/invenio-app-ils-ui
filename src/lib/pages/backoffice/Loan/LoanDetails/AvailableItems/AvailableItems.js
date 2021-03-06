import { itemApi } from '@api/items';
import { recordToPidType } from '@api/utils';
import { SeeAllButton } from '@components/backoffice/buttons/SeeAllButton';
import { InfoMessage } from '@components/backoffice/InfoMessage';
import { Error } from '@components/Error';
import { Loader } from '@components/Loader';
import { ResultsTable } from '@components/ResultsTable/ResultsTable';
import { SearchBarILS } from '@components/SearchBar';
import { invenioConfig } from '@config';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Message, Segment, Modal } from 'semantic-ui-react';

export default class AvailableItems extends Component {
  constructor(props) {
    super(props);
    this.seeAllUrl = BackOfficeRoutes.itemsListWithQuery;
    this.state = {
      query: '',
      filteredData: null,
      modalOpen: false,
      checkoutItem: null,
    };
  }

  componentDidMount() {
    const { fetchAvailableItems, loan } = this.props;
    fetchAvailableItems(loan.metadata.document_pid);
  }

  seeAllButton = () => {
    const {
      loan: {
        metadata: { document_pid },
      },
    } = this.props;
    const path = this.seeAllUrl(itemApi.query().withDocPid(document_pid).qs());
    return <SeeAllButton to={path} />;
  };

  assignItemButton(item) {
    const {
      loan: { pid },
      assignItemToLoan,
    } = this.props;
    return (
      <Button
        size="mini"
        color="blue"
        onClick={() => {
          const itemPid = {
            type: recordToPidType(item),
            value: item.metadata.pid,
          };
          assignItemToLoan(itemPid, pid);
        }}
      >
        replace
      </Button>
    );
  }

  performCheckout(loan, item = null) {
    const { performCheckoutAction } = this.props;
    const { checkoutItem, modalOpen } = this.state;
    item = item ? item : checkoutItem;
    if (modalOpen) {
      this.setState({ modalOpen: !modalOpen });
    }
    const checkoutUrl = loan.availableActions.checkout;
    const patronPid = loan.metadata.patron_pid;
    const documentPid = item.metadata.document.pid;
    const itemPid = {
      type: recordToPidType(item),
      value: item.metadata.pid,
    };
    performCheckoutAction(checkoutUrl, documentPid, patronPid, itemPid);
  }

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  checkoutItemButton(item, loan) {
    const { isActionLoading } = this.props;
    return (
      <Button
        size="mini"
        color="blue"
        loading={isActionLoading}
        disabled={isActionLoading}
        onClick={() => {
          if (!loan['is_first_requested']) {
            this.setState({
              modalOpen: true,
              checkoutItem: item,
            });
          } else {
            this.performCheckout(loan, item);
          }
        }}
      >
        checkout
      </Button>
    );
  }

  renderTable() {
    const { data } = this.props;
    const { filteredData } = this.state;
    const columns = [
      { title: 'PID', field: 'metadata.pid' },
      {
        title: 'Barcode',
        field: 'metadata.barcode',
        formatter: ({ row }) => (
          <Link to={BackOfficeRoutes.itemDetailsFor(row.metadata.pid)}>
            {row.metadata.barcode}
          </Link>
        ),
      },
      { title: 'Status', field: 'metadata.status' },
      { title: 'Medium', field: 'metadata.medium' },
      { title: 'Location', field: 'metadata.internal_location.name' },
      { title: 'Shelf', field: 'metadata.shelf' },
      {
        title: 'Actions',
        field: '',
        formatter: this.rowActionButton,
      },
    ];

    return (
      <ResultsTable
        data={filteredData === null ? data.hits : filteredData}
        columns={columns}
        totalHitsCount={data.total}
        name="available physical copies"
        seeAllComponent={this.seeAllButton()}
        renderEmptyResultsElement={this.renderEmptyResults}
      />
    );
  }

  renderEmptyResults = () => {
    const { query } = this.state;
    return (
      <div className="pt-default pb-default">
        {_isEmpty(query) ? (
          <InfoMessage
            header="No physical copies available."
            content="Currently document has no eligible physical copies to fulfil this loan."
          />
        ) : (
          <InfoMessage
            header="No physical copies found."
            content="Currently document has no eligible physical copies matching the barcode."
          />
        )}
      </div>
    );
  };

  rowActionButton = ({ row }) => {
    const { loan } = this.props;
    const isRequested = invenioConfig.CIRCULATION.loanRequestStates.includes(
      loan.metadata.state
    );
    const isCompleted = invenioConfig.CIRCULATION.loanCompletedStates.includes(
      loan.metadata.state
    );

    if (isRequested) {
      return this.checkoutItemButton(row, loan);
    } else if (isCompleted) {
      return (
        <Message compact info size="tiny">
          You can't change the physical copy <br /> once the loan is completed
        </Message>
      );
    } else {
      return this.assignItemButton(row);
    }
  };

  onChangeHandler = (query) => {
    const { data } = this.props;
    if (query) {
      const barcode = query.trim();
      const filteredData = data.hits.filter((hit) =>
        hit.metadata.barcode.startsWith(barcode)
      );
      this.setState({
        query: query,
        filteredData: filteredData,
      });
    } else {
      this.setState({
        query: '',
        filteredData: null,
      });
    }
  };

  searchByBarcode = async (barcode, documentPid) => {
    const { sendErrorNotification } = this.props;
    try {
      const response = await itemApi.list(
        itemApi
          .query()
          .withDocPid(documentPid)
          .withStatus(invenioConfig.ITEMS.canCirculateStatuses)
          .availableForCheckout()
          .withBarcode(barcode)
          .qs()
      );
      return response.data;
    } catch (error) {
      sendErrorNotification(
        'Search for barcode',
        'Something went wrong. Please try the search again or contact our support if the problem persists.'
      );
    }
  };

  onSearchExecute = async (query) => {
    const { loan } = this.props;
    if (query) {
      const barcode = query.trim();
      const results = await this.searchByBarcode(
        barcode,
        loan.metadata.document_pid
      );
      const isRequested = invenioConfig.CIRCULATION.loanRequestStates.includes(
        loan.metadata.state
      );
      if (results.total === 1 && isRequested) {
        // If the loan is pending and exactly one item matches the search, check it out
        const item = results.hits[0];
        this.performCheckout(loan, item);
      }
    }
  };

  renderCheckoutMessage() {
    return (
      <InfoMessage header="Copy checkout">
        Scan or paste a barcode to automatically checkout that copy
      </InfoMessage>
    );
  }

  renderSearchBar() {
    return (
      <SearchBarILS
        onChangeHandler={this.onChangeHandler}
        onSearchHandler={this.onSearchExecute}
        placeholder="Insert barcode..."
      />
    );
  }

  render() {
    const { isLoading, error, loan, data, firstLoanRequested } = this.props;
    const { modalOpen } = this.state;
    const statesThatRenderSearchBar =
      invenioConfig.CIRCULATION.loanActiveStates.concat(
        invenioConfig.CIRCULATION.loanRequestStates
      );
    const statesThatRenderCheckoutMessage =
      invenioConfig.CIRCULATION.loanRequestStates.includes(loan.metadata.state);
    return (
      <>
        <Header as="h3" attached="top">
          Available physical copies
        </Header>
        {statesThatRenderSearchBar.includes(loan.metadata.state) &&
        !_isEmpty(data.hits) ? (
          <Segment attached>
            {statesThatRenderCheckoutMessage && this.renderCheckoutMessage()}
            {this.renderSearchBar()}
          </Segment>
        ) : null}
        <Segment
          attached
          className="bo-metadata-segment no-padding"
          id="available-items"
        >
          <Loader isLoading={isLoading}>
            <Error error={error}>{this.renderTable()}</Error>
            {firstLoanRequested ? (
              <Modal open={modalOpen}>
                <Modal.Header>Preceding loan request found!</Modal.Header>
                <Modal.Content>
                  There is a preceding{' '}
                  <Link
                    target="_blank"
                    to={BackOfficeRoutes.loanDetailsFor(firstLoanRequested.pid)}
                  >
                    pending loan request{' '}
                  </Link>
                  for this literature. Are you sure that you want to checkout
                  the copy for this request?
                </Modal.Content>
                <Modal.Actions key="modalActions">
                  <Button onClick={this.handleCloseModal}>Cancel</Button>
                  <Button
                    primary
                    icon="checkmark"
                    labelPosition="left"
                    content="Checkout"
                    onClick={() => this.performCheckout(loan)}
                  />
                </Modal.Actions>
              </Modal>
            ) : null}
          </Loader>
        </Segment>
      </>
    );
  }
}

AvailableItems.propTypes = {
  assignItemToLoan: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  loan: PropTypes.object.isRequired,
  firstLoanRequested: PropTypes.object.isRequired,
  fetchAvailableItems: PropTypes.func.isRequired,
  performCheckoutAction: PropTypes.func.isRequired,
  sendErrorNotification: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isActionLoading: PropTypes.bool,
  error: PropTypes.object,
};

AvailableItems.defaultProps = {
  isLoading: false,
  isActionLoading: false,
  error: {},
};
