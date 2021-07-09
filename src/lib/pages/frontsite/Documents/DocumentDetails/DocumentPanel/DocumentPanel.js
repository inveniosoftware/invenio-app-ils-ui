import {
  ILSHeaderPlaceholder,
  ILSParagraphPlaceholder,
} from '@components/ILSPlaceholder';
import { Media } from '@components/Media';
import { ShowMoreContent } from '@components/ShowMoreContent';
import { invenioConfig } from '@config';
import DocumentAuthors from '@modules/Document/DocumentAuthors';
import LiteratureCover from '@modules/Literature/LiteratureCover';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Overridable from 'react-overridable';
import { Grid } from 'semantic-ui-react';
import { DocumentCirculation } from '../DocumentCirculation';
import DocumentPanelMobile from './DocumentPanelMobile';
import { DocumentTitle } from './DocumentTitle';

class DocumentPanel extends Component {
  render() {
    const { documentDetails: doc, isLoading, loansInfo } = this.props;
    return (
      <Overridable
        id="DocumentPanel.layout"
        documentDetails={doc}
        isLoading={isLoading}
      >
        <>
          <Media greaterThanOrEqual="tablet">
            <div
              className="document-panel"
              data-test={doc.metadata ? doc.metadata.pid : 0}
            >
              <Grid columns={3}>
                <Grid.Row>
                  <Grid.Column>
                    <LiteratureCover
                      url={_get(doc, 'metadata.cover_metadata.urls.large')}
                      isLoading={isLoading}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Overridable
                      id="DocumentPanel.DocumentTitle"
                      documentDetails={doc}
                      isLoading={isLoading}
                    >
                      <ILSHeaderPlaceholder isLoading={isLoading}>
                        <DocumentTitle metadata={doc.metadata} />
                      </ILSHeaderPlaceholder>
                    </Overridable>

                    <ILSParagraphPlaceholder
                      linesNumber={2}
                      isLoading={isLoading}
                    >
                      <DocumentAuthors
                        authors={doc.metadata.authors}
                        hasOtherAuthors={doc.metadata.other_authors}
                        prefix="by "
                        listItemAs="h4"
                        limit={invenioConfig.LITERATURE.authors.maxDisplay}
                      />
                      <Overridable
                        id="DocumentPanel.AfterAuthors"
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
                    <ILSParagraphPlaceholder
                      linesNumber={15}
                      isLoading={isLoading}
                    >
                      <ShowMoreContent lines={15}>
                        {doc.metadata.abstract}
                      </ShowMoreContent>
                    </ILSParagraphPlaceholder>
                  </Grid.Column>
                  <Grid.Column>
                    <DocumentCirculation
                      documentDetails={doc}
                      loansInfo={loansInfo}
                      isLoading={isLoading}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Media>
          <Media at="mobile">
            <DocumentPanelMobile
              isLoading={isLoading}
              documentDetails={doc}
              loansInfo={loansInfo}
            />
          </Media>
        </>
      </Overridable>
    );
  }
}

DocumentPanel.propTypes = {
  /* Redux */
  documentDetails: PropTypes.object.isRequired,
  loansInfo: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
};

DocumentPanel.defaultProps = {
  isLoading: false,
};

export default Overridable.component('DocumentPanel', DocumentPanel);
