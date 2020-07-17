import SearchAggregationsCards from '@modules/SearchControls/SearchAggregationsCards';
import { SearchControls } from '@modules/SearchControls/SearchControls';
import SearchEmptyResults from '@modules/SearchControls/SearchEmptyResults';
import SearchFooter from '@modules/SearchControls/SearchFooter';
import EItemList from './EitemList';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Container } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  EmptyResults,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import { getSearchConfig } from '@config';
import { Error as IlsError } from '@components/Error';
import { SearchBar as EItemsSearchBar } from '@components/SearchBar';
import { eItemApi } from '@api/eitems';
import { responseRejectInterceptor } from '@api/base';
import { ExportReactSearchKitResults } from '@components/backoffice/ExportSearchResults';
import { NewButton } from '@components/backoffice/buttons/NewButton';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';

export class EItemSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: eItemApi.searchBaseURL,
      withCredentials: true,
    },
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  searchConfig = getSearchConfig('EITEMS');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
      {
        name: 'title',
        field: 'document.title',
      },
      {
        name: 'author',
        field: 'authors.full_name',
        defaultValue: '"Doe, John"',
      },
      {
        name: 'created',
        field: '_created',
      },
    ];
    return (
      <EItemsSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder="Search for eitems"
        queryHelperFields={helperFields}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.eitemDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  renderEmptyResultsExtra = () => {
    return (
      <NewButton text="Add electronic item" to={BackOfficeRoutes.eitemCreate} />
    );
  };

  renderEitemList = results => {
    return <EItemList hits={results} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Electronic items</Header>

        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Grid>
            <Grid.Row columns={2}>
              <ResultsLoader>
                <Grid.Column width={3} className="search-aggregations">
                  <Header content="Filter by" />
                  <SearchAggregationsCards modelName="EITEMS" />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={2}>
                    <Grid.Column width={8}>
                      <NewButton
                        text="Add electronic item"
                        to={BackOfficeRoutes.eitemCreate}
                      />
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="right">
                      <ExportReactSearchKitResults
                        exportBaseUrl={eItemApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <EmptyResults renderElement={this.renderEmptyResults} />
                  <Error renderElement={this.renderError} />
                  <SearchControls
                    modelName="EITEMS"
                    withLayoutSwitcher={false}
                  />
                  <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                  <ResultsList renderElement={this.renderEitemList} />
                  <SearchFooter />
                </Grid.Column>
              </ResultsLoader>
            </Grid.Row>
          </Grid>
        </ReactSearchKit>
      </>
    );
  }
}
