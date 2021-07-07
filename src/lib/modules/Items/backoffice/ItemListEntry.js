import { DocumentIcon, ItemIcon } from '@components/backoffice/icons';
import { getDisplayVal } from '@config';
import LiteratureTitle from '@modules/Literature/LiteratureTitle';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Header, Item, List } from 'semantic-ui-react';

class ItemCirculation extends Component {
  render() {
    const { circulation, showPreviousLoan } = this.props;
    if (_isEmpty(circulation)) {
      return null;
    } else {
      return (
        <>
          {showPreviousLoan ? 'Previously' : 'Currently'} on{' '}
          <Link
            target="_blank"
            to={BackOfficeRoutes.loanDetailsFor(circulation.loan_pid)}
          >
            loan (#{circulation.loan_pid})
          </Link>{' '}
          <br />
          by{' '}
          <Link
            target="_blank"
            to={BackOfficeRoutes.patronDetailsFor(circulation.patron_pid)}
          >
            {circulation.patron.name}
          </Link>
          <br />
          from <strong> {circulation.start_date} </strong>until{' '}
          <strong>{circulation.end_date}</strong>
        </>
      );
    }
  }
}

ItemCirculation.propTypes = {
  circulation: PropTypes.object.isRequired,
  showPreviousLoan: PropTypes.bool,
};

ItemCirculation.defaultProps = {
  showPreviousLoan: false,
};

export class ItemListEntry extends Component {
  onClickPendingRequests = (item) => {
    return {
      pathname: BackOfficeRoutes.documentDetailsFor(item.metadata.document_pid),
    };
  };

  render() {
    const {
      record: item,
      withPendingLoans,
      showPreviousLoan,
      target,
    } = this.props;
    const classes = withPendingLoans ? 'bkg-yellow' : '';
    return (
      <Item className={classes}>
        <Item.Content>
          <Item.Header
            as={Link}
            target={target}
            to={BackOfficeRoutes.itemDetailsFor(item.metadata.pid)}
          >
            <ItemIcon /> {item.metadata.barcode}
          </Item.Header>
          <Grid columns={2}>
            <Grid.Column computer={6} largeScreen={6}>
              <Item.Meta className="metadata-fields">
                <Header as="h5">
                  <LiteratureTitle
                    title={item.metadata.document.title}
                    truncateLines={1}
                  />
                </Header>
                <List className="metadata-sharp">
                  <List.Item>
                    <List.Content>
                      <strong>{item.metadata.internal_location.location.name} -{' '}
                      {item.metadata.internal_location.name}</strong>
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      {' '}
                      <strong>shelf {item.metadata.shelf}</strong>
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <Item.Meta className="metadata-fields">
                <List>
                  <List.Item>
                    <List.Content>
                      medium{' '}
                      <span className="ml-10">
                        <strong>
                          {getDisplayVal('ITEMS.mediums', item.metadata.medium)}
                        </strong>
                      </span>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      status
                      <span className="ml-10">
                        <strong>{item.metadata.status}</strong>
                      </span>
                    </List.Content>
                  </List.Item>

                  <List.Item>
                    <List.Content>
                      restrictions
                      <span className="ml-10">
                        <strong>{item.metadata.circulation_restriction}</strong>
                      </span>
                    </List.Content>
                  </List.Item>
                </List>
              </Item.Meta>
            </Grid.Column>
            <Grid.Column computer={4} largeScreen={4}>
              <ItemCirculation
                circulation={item.metadata.circulation}
                showPreviousLoan={showPreviousLoan}
              />
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Link
                target="_blank"
                to={BackOfficeRoutes.documentDetailsFor(
                  item.metadata.document_pid
                )}
              >
                <DocumentIcon /> Document
              </Link>
              {withPendingLoans && (
                <Item.Extra>
                  <Button
                    compact
                    floated="right"
                    color="blue"
                    as={Link}
                    target="_blank"
                    to={BackOfficeRoutes.documentDetailsFor(
                      item.metadata.document_pid
                    )}
                  >
                    Show pending requests
                  </Button>
                </Item.Extra>
              )}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className="pid-field">#{item.metadata.pid}</div>
      </Item>
    );
  }
}

ItemListEntry.propTypes = {
  record: PropTypes.object.isRequired,
  withPendingLoans: PropTypes.bool,
  showPreviousLoan: PropTypes.bool,
  target: PropTypes.string,
};

ItemListEntry.defaultProps = {
  withPendingLoans: false,
  showPreviousLoan: false,
  target: '',
};
