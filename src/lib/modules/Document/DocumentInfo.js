import { MetadataTable } from '@components/backoffice/MetadataTable';
import DocumentAuthors from '@modules/Document/DocumentAuthors';
import LiteratureUrls from '@modules/Literature/LiteratureUrls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, Table } from 'semantic-ui-react';
import LiteratureKeywords from '@modules/Literature/LiteratureKeywords';
import { invenioConfig } from '@config';
import isEmpty from 'lodash/isEmpty';

export class DocumentInfo extends Component {
  renderLanguages() {
    const { metadata } = this.props;
    if (metadata.languages) {
      return (
        <Table.Row>
          <Table.Cell>Languages</Table.Cell>
          <Table.Cell>{metadata.languages.join(', ')}</Table.Cell>
        </Table.Row>
      );
    }
    return null;
  }

  renderKeywords() {
    const { metadata } = this.props;
    return (
      <Table.Row>
        <Table.Cell>Keywords</Table.Cell>
        <Table.Cell>
          <LiteratureKeywords keywords={metadata.keywords} separator=", " />
        </Table.Cell>
      </Table.Row>
    );
  }

  prepareImprintInfo = () => {
    const { metadata } = this.props;

    return [
      { name: 'Publisher', value: metadata.imprint.publisher },
      { name: 'Date', value: metadata.imprint.date },
      { name: 'Place', value: metadata.imprint.place },
      { name: 'Reprint', value: metadata.imprint.reprint },
      { name: 'Number of pages', value: metadata.number_of_pages },
    ];
  };

  render() {
    const { metadata } = this.props;

    return (
      <>
        <Divider horizontal>Details</Divider>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell>{metadata.title}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Authors</Table.Cell>
              <Table.Cell>
                <DocumentAuthors
                  authors={metadata.authors}
                  hasOtherAuthors={metadata.other_authors}
                  withPopUpShowMoreFields
                  limit={invenioConfig.LITERATURE.authors.maxDisplay}
                  scrollLimit={300}
                  expandable
                  withVerticalScroll
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Publication year</Table.Cell>
              <Table.Cell>{metadata.publication_year}</Table.Cell>
            </Table.Row>
            {metadata.edition && (
              <Table.Row>
                <Table.Cell>Edition</Table.Cell>
                <Table.Cell>{metadata.edition}</Table.Cell>
              </Table.Row>
            )}

            {this.renderLanguages()}
            {this.renderKeywords()}
          </Table.Body>
        </Table>
        {!isEmpty(metadata.imprint) ? (
          <>
            <Divider horizontal>Publishing details</Divider>
            <MetadataTable rows={this.prepareImprintInfo()} />
          </>
        ) : null}
        {metadata.urls && (
          <>
            <Divider horizontal>More information</Divider>
            <LiteratureUrls urlArray={metadata.urls} />
          </>
        )}
      </>
    );
  }
}

DocumentInfo.propTypes = {
  metadata: PropTypes.object.isRequired,
};
