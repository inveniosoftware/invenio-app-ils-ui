import { ItemListEntry } from '@modules/Items/backoffice/ItemListEntry';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Item, Segment } from 'semantic-ui-react';

export default class CheckedInItems extends Component {
  componentDidMount() {
    const { clearResults } = this.props;
    clearResults();
  }

  renderItems = () => {
    const { items } = this.props;

    const entries = items.reverse().map((item) => {
      return (
        <ItemListEntry
          record={item}
          key={item.id}
          withPendingLoans={item.has_pending_loans}
          showPreviousLoan
          target="_blank"
        />
      );
    });
    return (
      <Segment>
        <Item.Group divided className="bo-item-search">
          {entries}
        </Item.Group>
      </Segment>
    );
  };

  render() {
    const { items } = this.props;
    return (
      <>
        <Header as="h3">Recently checked-in</Header>
        {_isEmpty(items) ? (
          <Segment placeholder>
            <Header textAlign="center">
              No recently checked-in physical copies.
            </Header>
          </Segment>
        ) : (
          this.renderItems()
        )}
      </>
    );
  }
}

CheckedInItems.propTypes = {
  items: PropTypes.array,
  clearResults: PropTypes.func.isRequired,
};

CheckedInItems.defaultProps = {
  items: [],
};
