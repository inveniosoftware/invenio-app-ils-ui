import { DocumentIcon, ItemIcon } from '@components/backoffice/icons';
import { getDisplayVal } from '@config/invenioConfig';
import DocumentAuthors from '@modules/Document/DocumentAuthors';
import { BackOfficeRoutes } from '@routes/urls';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Item, List } from 'semantic-ui-react';

class ItemCirculation extends Component {
  render() {
    const { circulation } = this.props;
    if (_isEmpty(circulation)) {
      return null;
    } else {
      return (
        <>
          Currently on{' '}
          <Link to={BackOfficeRoutes.loanDetailsFor(circulation.loan_pid)}>
            loan (#{circulation.loan_pid})
          </Link>{' '}
          <br />
          by{' '}
          <Link to={BackOfficeRoutes.patronDetailsFor(circulation.patron_pid)}>
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
};

export class ItemListEntry extends Component {
  render() {
    const { item } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={BackOfficeRoutes.itemDetailsFor(item.metadata.pid)}
          >
            <ItemIcon /> {item.metadata.barcode}
          </Item.Header>{' '}
          <Header as="h5"> - {item.metadata.document.title}</Header>
          <Grid columns={2}>
            <Grid.Column computer={6} largeScreen={6}>
              <Item.Meta className="metadata-fields">
                <DocumentAuthors
                  authors={item.metadata.document.authors}
                  hasOtherAuthors={item.metadata.document.other_authors}
                  prefix="by "
                  limit={10}
                />
                <List>
                  <List.Item>
                    <List.Content>
                      {item.metadata.internal_location.location.name} -{' '}
                      {item.metadata.internal_location.name}
                    </List.Content>
                  </List.Item>
                  <List.Item>
                    <List.Content>
                      {' '}
                      shelf <strong>{item.metadata.shelf}</strong>
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
                          {getDisplayVal('items.mediums', item.metadata.medium)}
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
              <ItemCirculation circulation={item.metadata.circulation} />
            </Grid.Column>
            <Grid.Column computer={2} largeScreen={2} textAlign="right">
              <Link
                to={BackOfficeRoutes.documentDetailsFor(
                  item.metadata.document_pid
                )}
              >
                <DocumentIcon /> Document
              </Link>
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className="pid-field">#{item.metadata.pid}</div>
      </Item>
    );
  }
}

ItemListEntry.propTypes = {
  item: PropTypes.object.isRequired,
};
