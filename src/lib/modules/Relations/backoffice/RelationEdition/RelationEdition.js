import { DocumentDetailsLink } from '@components/backoffice/buttons/ViewDetailsButtons/DocumentDetailsLink';
import { SeriesDetailsLink } from '@components/backoffice/buttons/ViewDetailsButtons/SeriesDetailsLink';
import { InfoMessage } from '@components/backoffice/InfoMessage';
import { Error } from '@components/Error';
import { Loader } from '@components/Loader';
import LiteratureTitle from '@modules/Literature/LiteratureTitle';
import { ExistingRelations } from '@modules/Relations/backoffice/components/ExistingRelations';
import { RelationRemover } from '@modules/Relations/backoffice/components/RelationRemover';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { RelationEditionModal } from './RelationEditionModal';

export default class RelationEdition extends Component {
  constructor(props) {
    super(props);
    this.relationType = 'edition';
  }

  viewDetails = ({ row }) => {
    const titleCmp = (
      <LiteratureTitle
        title={row.record_metadata.title}
        edition={row.record_metadata.edition}
        publicationYear={row.record_metadata.publication_year}
        truncateWidth={300}
      />
    );
    if (row.pid_type === 'docid')
      return (
        <DocumentDetailsLink pidValue={row.pid_value}>
          {titleCmp}
        </DocumentDetailsLink>
      );
    else if (row.pid_type === 'serid') {
      return (
        <SeriesDetailsLink pidValue={row.pid_value}>
          {titleCmp}
        </SeriesDetailsLink>
      );
    }
  };

  removeHandler = ({ row }) => {
    const { recordDetails } = this.props;

    if (!_isEmpty(recordDetails)) {
      return (
        <RelationRemover
          referrer={recordDetails}
          related={row}
          relationType={row.relation_type}
          buttonContent="Remove relation"
        />
      );
    }
  };

  recTypeFormatter = ({ row }) => {
    if (row.pid_type === 'docid') {
      return row.record_metadata.document_type;
    } else if (row.pid_type === 'serid') {
      return row.record_metadata.mode_of_issuance;
    }
  };

  render() {
    const {
      relations,
      showMaxRows,
      isLoading,
      error,
      recordDetails,
    } = this.props;
    const editions = relations[this.relationType] || [];

    const columns = [
      { title: 'PID', field: 'pid_value' },
      { title: 'Title', field: '', formatter: this.viewDetails },
      { title: 'Type', field: 'pid_type', formatter: this.recTypeFormatter },
      {
        title: 'Edition',
        field: 'record_metadata.edition',
      },
      { title: 'Actions', field: '', formatter: this.removeHandler },
    ];

    return (
      <Loader isLoading={isLoading}>
        <Error error={error}>
          <RelationEditionModal
            relationType={this.relationType}
            recordDetails={recordDetails}
          />

          <ExistingRelations
            rows={editions}
            showMaxRows={showMaxRows}
            columns={columns}
            emptyMessage={
              <InfoMessage
                header="No related editions"
                content="Use the button above to add related edition."
              />
            }
          />
        </Error>
      </Loader>
    );
  }
}

RelationEdition.propTypes = {
  relations: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  recordDetails: PropTypes.object.isRequired,
  showMaxRows: PropTypes.number,
  error: PropTypes.object,
};

RelationEdition.defaultProps = {
  showMaxRows: 3,
  error: null,
};
