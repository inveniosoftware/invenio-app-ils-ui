import { invenioConfig } from '@config';
import { DocumentConference } from '@modules/Document/DocumentConference';
import { DocumentInfo } from '@modules/Document/DocumentInfo';
import { DocumentLinks } from '@modules/Document/DocumentLinks';
import { DocumentPublicationInfo } from '@modules/Document/DocumentPublicationInfo';
import { DocumentTableOfContent } from '@modules/Document/DocumentTableOfContent';
import { Identifiers } from '@modules/Identifiers';
import { LiteratureNotes } from '@modules/Literature/LiteratureNotes';
import LiteratureRelations from '@modules/Literature/LiteratureRelations';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overridable from 'react-overridable';
import { Tab } from 'semantic-ui-react';
import { DocumentMetadataExtensions } from '@modules/Document/DocumentMetadataExtensions';

class DocumentMetadataTabs extends Component {
  renderTabPanes = () => {
    const { metadata } = this.props;
    const identifiers = _get(metadata, 'identifiers', []);
    const altIdentifiers = _get(metadata, 'alternative_identifiers', []);
    const panes = [
      {
        menuItem: 'Details',
        render: () => (
          <Tab.Pane>
            <LiteratureRelations relations={metadata.relations} />
            <DocumentInfo metadata={metadata} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Identifiers',
        render: () => (
          <Tab.Pane>
            <Identifiers identifiers={identifiers.concat(altIdentifiers)} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Content',
        render: () => (
          <Tab.Pane>
            <DocumentTableOfContent
              toc={metadata.table_of_content}
              abstract={metadata.abstract}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Publications',
        render: () => (
          <DocumentPublicationInfo
            publications={metadata.publication_info}
            documentType={metadata.document_type}
          />
        ),
      },
      {
        menuItem: 'Conference',
        render: () => (
          <Tab.Pane>
            <DocumentConference
              conference={metadata.conference_info}
              documentType={metadata.document_type}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Notes',
        render: () => (
          <Tab.Pane>
            <LiteratureNotes content={metadata.note} />
          </Tab.Pane>
        ),
      },
    ];

    const { eitems = {} } = metadata;
    if (_get(eitems, 'total', 0) > 0) {
      panes.push({
        menuItem: 'Files',
        render: () => (
          <Tab.Pane>
            <DocumentLinks dividers eitems={eitems} />
          </Tab.Pane>
        ),
      });
    }

    const { extensions = {} } = metadata;
    if (
      !_isEmpty(extensions) &&
      !_isEmpty(invenioConfig.DOCUMENTS.extensions.fields)
    ) {
      panes.push({
        menuItem: invenioConfig.DOCUMENTS.extensions.label,
        render: () => (
          <Tab.Pane>
            <Overridable
              id="DocumentMetadataTabs.Extensions"
              extensions={extensions}
            />
            <DocumentMetadataExtensions extensions={extensions} />
          </Tab.Pane>
        ),
      });
    }
    return panes;
  };

  onTabChange = (event, { activeIndex }) => {
    const { showTab } = this.props;
    showTab(activeIndex);
  };

  render() {
    const { activeTab } = this.props;
    return (
      <Tab
        activeIndex={activeTab}
        menu={{ secondary: true, pointing: true }}
        panes={this.renderTabPanes()}
        onTabChange={this.onTabChange}
        id="document-metadata-section"
        className="document-metadata-tabs"
      />
    );
  }
}

DocumentMetadataTabs.propTypes = {
  activeTab: PropTypes.number,
  metadata: PropTypes.object.isRequired,
  showTab: PropTypes.func.isRequired,
};

DocumentMetadataTabs.defaultProps = {
  activeTab: 0,
};

export default Overridable.component(
  'DocumentMetadataTabs',
  DocumentMetadataTabs
);
