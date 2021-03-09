import { formatPrice } from '@api/utils';
import { CreatedBy, UpdatedBy } from '@components/backoffice/ChangedBy';
import { ProviderIcon, PatronIcon } from '@components/backoffice/icons';
import { MetadataTable } from '@components/backoffice/MetadataTable';
import { invenioConfig } from '@config';
import LiteratureTitle from '@modules/Literature/LiteratureTitle';
import { BackOfficeRoutes, ProviderRoutes } from '@routes/urls';
import { PropTypes } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Grid, Header, Segment } from 'semantic-ui-react';
import { BorrowingRequestPatronLoan } from './BorrowingRequestPatronLoan';

class Loan extends React.Component {
  dateOrDefault = (value) => {
    return value ? value : '-';
  };

  render() {
    const { brwReq } = this.props;
    const table = [
      {
        name: 'Provider',
        value: (
          <Link to={ProviderRoutes.providerDetailsFor(brwReq.provider_pid)}>
            <ProviderIcon /> {brwReq.provider.name}
          </Link>
        ),
      },
      {
        name: 'Item type',
        value: brwReq.type,
      },
      { name: 'Requested on', value: this.dateOrDefault(brwReq.request_date) },
      {
        name: 'Expected delivery',
        value: this.dateOrDefault(brwReq.expected_delivery_date),
      },
      {
        name: 'Received on',
        value: this.dateOrDefault(brwReq.received_date),
      },
      {
        name: 'Due date',
        value: this.dateOrDefault(brwReq.due_date),
      },
      {
        name: `Total (${invenioConfig.APP.DEFAULT_CURRENCY})`,
        value: formatPrice(brwReq.total_main_currency) || '-',
      },
      {
        name:
          brwReq.total && brwReq.total.currency
            ? `Total (${brwReq.total.currency})`
            : 'Total',
        value: formatPrice(brwReq.total) || '-',
      },
    ];
    return (
      <Grid columns={2} relaxed>
        <Grid.Row>
          <Grid.Column>
            <Divider horizontal>InterLibrary Loan</Divider>
            <MetadataTable labelWidth={5} rows={table} />
          </Grid.Column>
          <Grid.Column>
            <Divider horizontal>Patron Loan</Divider>
            <BorrowingRequestPatronLoan brwReq={brwReq} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Loan.propTypes = {
  brwReq: PropTypes.object.isRequired,
};

class Metadata extends React.Component {
  render() {
    const { brwReq } = this.props;
    const leftTable = [
      {
        name: 'Document',
        value: (
          <Link to={BackOfficeRoutes.documentDetailsFor(brwReq.document_pid)}>
            <LiteratureTitle
              title={brwReq.document.title}
              edition={brwReq.document.edition}
              publicationYear={brwReq.document.publication_year}
            />
          </Link>
        ),
      },
      {
        name: 'Patron',
        value: (
          <Link to={BackOfficeRoutes.patronDetailsFor(brwReq.patron_pid)}>
            <PatronIcon /> {brwReq.patron.name}
          </Link>
        ),
      },
    ];
    if (brwReq.patron_pid > 0) {
      leftTable[1].value = <>{brwReq.patron.name}</>;
    }
    const rightTable = [
      { name: 'Created by', value: <CreatedBy metadata={brwReq} /> },
      { name: 'Updated by', value: <UpdatedBy metadata={brwReq} /> },
      { name: 'Notes', value: brwReq.notes },
    ];
    return (
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

Metadata.propTypes = {
  brwReq: PropTypes.object.isRequired,
};

export class BorrowingRequestMetadata extends React.Component {
  render() {
    const { brwReq } = this.props;

    return (
      <>
        <Header as="h3" attached="top">
          Request information
        </Header>
        <Segment attached className="bo-metadata-segment" id="request-info">
          <Metadata brwReq={brwReq} />
          <Loan brwReq={brwReq} />
        </Segment>
      </>
    );
  }
}

BorrowingRequestMetadata.propTypes = {
  brwReq: PropTypes.object.isRequired,
};
