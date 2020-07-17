import { borrowingRequestApi } from '@api/ill';
import { NewButton } from '@components/backoffice/buttons/NewButton';
import { ExportReactSearchKitResults } from '@components/backoffice/ExportSearchResults';
import { Error as IlsError } from '@components/Error';
import { SearchBar as BorrowingRequestSearchBar } from '@components/SearchBar';
import history from '@history';
import SearchAggregationsCards from '@modules/SearchControls/SearchAggregationsCards';
import { SearchControls } from '@modules/SearchControls/SearchControls';
import SearchEmptyResults from '@modules/SearchControls/SearchEmptyResults';
import SearchFooter from '@modules/SearchControls/SearchFooter';
import { ILLRoutes } from '@routes/urls';
import React, { Component } from 'react';
import {
  Error,
  InvenioSearchApi,
  ReactSearchKit,
  ResultsList,
  ResultsLoader,
  SearchBar,
} from 'react-searchkit';
import { Container, Grid, Header } from 'semantic-ui-react';
import BorrowingRequestList from './BorrowingRequestList/BorrowingRequestList';

export class BorrowingRequestSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: borrowingRequestApi.searchBaseURL,
      withCredentials: true,
    },
  });

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'library',
        field: 'library.name',
        defaultValue: '"Dolor"',
      },
      {
        name: 'document title',
        field: 'document.title',
        defaultValue: 'Porro',
      },
      {
        name: 'patron name',
        field: 'patron.name',
        defaultValue: 'Yannic',
      },
    ];
    return (
      <BorrowingRequestSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder="Search for borrowing requests"
        queryHelperFields={helperFields}
      />
    );
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton
        text="Create borrowing request"
        to={ILLRoutes.borrowingRequestCreate}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderBorrowingRequestsList = results => {
    return <BorrowingRequestList hits={results} />;
  };

  render() {
    return (
      <ReactSearchKit searchApi={this.searchApi} history={history}>
        <Container fluid className="spaced">
          <SearchBar renderElement={this.renderSearchBar} />
        </Container>
        <Container fluid className="bo-search-body">
          <Grid>
            <Grid.Row columns={2}>
              <ResultsLoader>
                <Grid.Column width={3} className="search-aggregations">
                  <Header content="Filter by" />
                  <SearchAggregationsCards modelName="ILL_BORROWING_REQUESTS" />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={2}>
                    <Grid.Column width={8}>
                      <NewButton
                        text="Create new borrowing request"
                        to={ILLRoutes.borrowingRequestCreate}
                      />
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="right">
                      <ExportReactSearchKitResults
                        exportBaseUrl={borrowingRequestApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                  <Error renderElement={this.renderError} />
                  <SearchControls
                    modelName="ILL_BORROWING_REQUESTS"
                    withLayoutSwitcher={false}
                  />
                  <ResultsList
                    renderElement={this.renderBorrowingRequestsList}
                  />
                  <SearchFooter />
                </Grid.Column>
              </ResultsLoader>
            </Grid.Row>
          </Grid>
        </Container>
      </ReactSearchKit>
    );
  }
}
