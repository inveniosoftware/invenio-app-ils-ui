import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { ShowMoreContent } from '@components/ShowMoreContent';
import { invenioConfig } from '@config';
import DocumentAuthors from '@modules/Document/DocumentAuthors';
import LiteratureCover from '@modules/Literature/LiteratureCover';
import LiteratureTags from '@modules/Literature/LiteratureTags';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overridable from 'react-overridable';
import { Grid, Header } from 'semantic-ui-react';
import { DocumentCirculation } from '../DocumentCirculation';
import { DocumentTitle } from './DocumentTitle';

class DocumentPanelMobile extends Component {
  render() {
    const { documentDetails: doc, isLoading, loansInfo } = this.props;
    return (
      <div
        className="document-panel"
        data-test={doc.metadata ? doc.metadata.pid : 0}
      >
        <Overridable
          id="DocumentPanel.layout"
          documentDetails={doc}
          isLoading={isLoading}
        >
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} textAlign="center">
                <LiteratureCover
                  size="medium"
                  url={_get(doc, 'metadata.cover_metadata.urls.medium')}
                />
                <ILSHeaderPlaceholder isLoading={isLoading} center="true">
                  <DocumentTitle metadata={doc.metadata} />
                </ILSHeaderPlaceholder>
                <ILSParagraphPlaceholder linesNumber={2} isLoading={isLoading}>
                  <DocumentAuthors
                    authors={doc.metadata.authors}
                    hasOtherAuthors={doc.metadata.other_authors}
                    prefix="by "
                    listItemAs="h4"
                    limit={invenioConfig.LITERATURE.authors.maxDisplay}
                  />
                  <Overridable
                    id="DocumentPanelMobile.AfterAuthors"
                    metadata={doc.metadata}
                  />
                  {doc.metadata.imprint?.publisher
                    &&
                  <><div
                    className={`default-margin-bottom`}>
                    Published by <b>{doc.metadata.imprint?.publisher}</b>
                    {doc.metadata.publication_year && (<b>{doc.metadata.publication_year}</b>)}
                  </div></>}
                </ILSParagraphPlaceholder>
                <ILSParagraphPlaceholder linesNumber={1} isLoading={isLoading}>
                  <LiteratureTags tags={doc.metadata.tags} />
                </ILSParagraphPlaceholder>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16}>
                <DocumentCirculation
                  documentDetails={doc}
                  loansInfo={loansInfo}
                  isLoading={isLoading}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16}>
                <ILSParagraphPlaceholder linesNumber={5} isLoading={isLoading}>
                  <Header as="h4" content="Abstract" />
                  <ShowMoreContent lines={5} content={doc.metadata.abstract} />
                </ILSParagraphPlaceholder>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Overridable>
      </div>
    );
  }
}

DocumentPanelMobile.propTypes = {
  documentDetails: PropTypes.object.isRequired,
  loansInfo: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

DocumentPanelMobile.defaultProps = {
  isLoading: false,
};

export default Overridable.component(
  'DocumentPanelMobile',
  DocumentPanelMobile
);
