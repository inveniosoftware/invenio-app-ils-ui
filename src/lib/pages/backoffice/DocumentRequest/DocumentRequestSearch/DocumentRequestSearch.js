import { responseRejectInterceptor } from '@api/base';
import { documentRequestApi } from '@api/documentRequests';
import { NewButton } from '@components/backoffice/buttons/NewButton';
import { ExportReactSearchKitResults } from '@components/backoffice/ExportSearchResults';
import { QueryBuildHelper } from '@components/SearchBar/QueryBuildHelper';
import {
  invenioConfig,
  setReactSearchKitDefaultSortingOnEmptyQueryString,
  setReactSearchKitInitialQueryState,
  setReactSearchKitUrlHandler,
} from '@config';
import history from '@history';
import SearchAggregationsCards from '@modules/SearchControls/SearchAggregationsCards';
import { SearchControls } from '@modules/SearchControls/SearchControls';
import { SearchControlsOverridesMap } from '@modules/SearchControls/SearchControlsOverrides';
import SearchFooter from '@modules/SearchControls/SearchFooter';
import { BackOfficeRoutes } from '@routes/urls';
import React, { Component } from 'react';
import { OverridableContext } from 'react-overridable';
import {
  EmptyResults,
  Error,
  InvenioSearchApi,
  ReactSearchKit,
  ResultsList,
  ResultsLoader,
  SearchBar,
} from 'react-searchkit';
import { Container, Grid, Header } from 'semantic-ui-react';
import { DocumentRequestListEntry } from './DocumentRequestListEntry';

export class DocumentRequestSearch extends Component {
  modelName = 'DOCUMENT_REQUESTS';

  searchApi = new InvenioSearchApi({
    axios: {
      url: documentRequestApi.searchBaseURL,
      withCredentials: true,
    },
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });

  render() {
    const helperFields = [
      {
        name: 'document PID',
        field: 'document_pid',
        defaultValue: '1',
      },
      {
        name: 'title',
        field: 'title',
        defaultValue: 'Harry Potter',
      },
    ];

    const initialState = setReactSearchKitInitialQueryState(this.modelName);
    const defaultSortingOnEmptyQueryString = setReactSearchKitDefaultSortingOnEmptyQueryString(
      this.modelName
    );
    const urlHandler = setReactSearchKitUrlHandler(this.modelName);
    return (
      <>
        <Header as="h2">Requests for new literature</Header>
        <OverridableContext.Provider
          value={{
            ...SearchControlsOverridesMap,
          }}
        >
          <ReactSearchKit
            searchApi={this.searchApi}
            history={history}
            urlHandlerApi={urlHandler}
            initialQueryState={initialState}
            defaultSortingOnEmptyQueryString={defaultSortingOnEmptyQueryString}
          >
            <>
              <Container fluid className="spaced">
                <SearchBar
                  placeholder="Search for document requests"
                  {...invenioConfig.APP.SEARCH_BAR_PROPS}
                />
                <QueryBuildHelper fields={helperFields} />
              </Container>
              <Grid>
                <Grid.Row columns={2}>
                  <ResultsLoader>
                    <Grid.Column width={3} className="search-aggregations">
                      <Header content="Filter by" />
                      <SearchAggregationsCards modelName={this.modelName} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Grid columns={2}>
                        <Grid.Column width={8}>
                          <NewButton
                            text="Add request"
                            to={BackOfficeRoutes.documentRequestCreate}
                          />
                        </Grid.Column>
                        <Grid.Column width={8} textAlign="right">
                          <ExportReactSearchKitResults
                            exportBaseUrl={documentRequestApi.searchBaseURL}
                          />
                        </Grid.Column>
                      </Grid>
                      <EmptyResults
                        extraContent={
                          <NewButton
                            text="Add request"
                            to={BackOfficeRoutes.documentRequestCreate}
                          />
                        }
                      />
                      <Error />
                      <SearchControls
                        modelName={this.modelName}
                        withLayoutSwitcher={false}
                      />
                      <ResultsList
                        ListEntryElement={DocumentRequestListEntry}
                      />
                      <SearchFooter />
                    </Grid.Column>
                  </ResultsLoader>
                </Grid.Row>
              </Grid>
            </>
          </ReactSearchKit>
        </OverridableContext.Provider>
      </>
    );
  }
}
