import { InfoMessage } from '@components/backoffice/InfoMessage';
import { MetadataTable } from '@components/backoffice/MetadataTable';
import { ShowMoreContent } from '@components/ShowMoreContent';
import { prettyPrintBooleanValue } from '@components/utils';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, Header } from 'semantic-ui-react';

export class DocumentCuration extends Component {
  renderInternalNotes = () => {
    const { document } = this.props;

    if (!_isEmpty(document.metadata.internal_notes)) {
      return document.metadata.internal_notes.map((entry, index) => (
        <>
          User {entry.user} noted for field {entry.field}:<br />
          <p>{entry.value}</p>
          <br />
        </>
      ));
    }
  };

  render() {
    const { document } = this.props;

    let rows = [
      {
        name: 'Curated',
        value: prettyPrintBooleanValue(document.metadata.curated),
      },
    ];

    if (
      !_isEmpty(document.metadata.note) ||
      !_isEmpty(document.metadata.internal_notes)
    ) {
      return (
        <>
          {document.metadata.note && (
            <>
              <Header as="h3">Public note</Header>
              <ShowMoreContent content={document.metadata.note} lines={10} />
            </>
          )}

          {document.metadata.note && document.metadata.internal_notes && (
            <Divider />
          )}

          {document.metadata.internal_notes && (
            <>
              <Header as="h3">Internal notes</Header>
              {document.metadata.internal_notes.map((element) => (
                <>
                  User {element.user} noted for field {element.field}:<br />
                  <p>{element.value}</p>
                  <br />
                </>
              ))}
            </>
          )}
          {(document.metadata.note || document.metadata.internal_notes) && (
            <Divider />
          )}
          <>
            <Header as="h3">Curation</Header>
            <MetadataTable rows={rows} />
          </>
        </>
      );
    }
    return (
      <InfoMessage
        header="No information."
        content="Edit document to add information"
      />
    );
  }
}

DocumentCuration.propTypes = {
  document: PropTypes.object.isRequired,
};
