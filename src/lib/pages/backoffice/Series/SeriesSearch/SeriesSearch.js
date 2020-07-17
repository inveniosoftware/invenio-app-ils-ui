import SearchAggregationsCards from '@modules/SearchControls/SearchAggregationsCards';
import { SearchControls } from '@modules/SearchControls/SearchControls';
import SearchEmptyResults from '@modules/SearchControls/SearchEmptyResults';
import SearchFooter from '@modules/SearchControls/SearchFooter';
import SeriesList from './SeriesList';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Container } from 'semantic-ui-react';
import {
  ReactSearchKit,
  SearchBar,
  ResultsList,
  ResultsLoader,
  Error,
  InvenioSearchApi,
} from 'react-searchkit';
import { Error as IlsError } from '@components/Error';
import { SearchBar as SeriesSearchBar } from '@components/SearchBar';
import { seriesApi } from '@api/series/series';
import { responseRejectInterceptor } from '@api/base';
import { getSearchConfig } from '@config';
import { ExportReactSearchKitResults } from '@components/backoffice/ExportSearchResults';
import { NewButton } from '@components/backoffice/buttons/NewButton';
import { BackOfficeRoutes } from '@routes/urls';
import history from '@history';

export class SeriesSearch extends Component {
  searchApi = new InvenioSearchApi({
    axios: {
      url: seriesApi.searchBaseURL,
      withCredentials: true,
    },
    interceptors: {
      response: { reject: responseRejectInterceptor },
    },
  });
  searchConfig = getSearchConfig('SERIES');

  renderSearchBar = (_, queryString, onInputChange, executeSearch) => {
    const helperFields = [
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
      <SeriesSearchBar
        currentQueryString={queryString}
        onInputChange={onInputChange}
        executeSearch={executeSearch}
        placeholder="Search for series"
        queryHelperFields={helperFields}
      />
    );
  };

  viewDetails = ({ row }) => {
    return (
      <Button
        as={Link}
        to={BackOfficeRoutes.seriesDetailsFor(row.metadata.pid)}
        compact
        icon="info"
        data-test={row.metadata.pid}
      />
    );
  };

  renderSeriesList = results => {
    return <SeriesList hits={results} />;
  };

  renderError = error => {
    return <IlsError error={error} />;
  };

  render() {
    return (
      <>
        <Header as="h2">Series</Header>
        <ReactSearchKit searchApi={this.searchApi} history={history}>
          <Container fluid className="spaced">
            <SearchBar renderElement={this.renderSearchBar} />
          </Container>
          <Grid>
            <Grid.Row columns={2}>
              <ResultsLoader>
                <Grid.Column width={3} className="search-aggregations">
                  <Header content="Filter by" />
                  <SearchAggregationsCards modelName="SERIES" />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Grid columns={2}>
                    <Grid.Column width={8}>
                      <NewButton
                        text="New series"
                        to={BackOfficeRoutes.seriesCreate}
                      />
                    </Grid.Column>
                    <Grid.Column width={8} textAlign="right">
                      <ExportReactSearchKitResults
                        exportBaseUrl={seriesApi.searchBaseURL}
                      />
                    </Grid.Column>
                  </Grid>
                  <SearchEmptyResults extras={this.renderEmptyResultsExtra} />
                  <Error renderElement={this.renderError} />
                  <SearchControls
                    modelName="SERIES"
                    withLayoutSwitcher={false}
                  />
                  <ResultsList renderElement={this.renderSeriesList} />
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
