import { EItemIcon, ItemIcon, LoanIcon } from '@components/backoffice/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Icon, Statistic } from 'semantic-ui-react';

export default class DocumentSummary extends Component {
  scrollTo(ref) {
    ref.current.scrollIntoView(false, { behaviour: 'smooth', block: 'end' });
  }

  render() {
    const { document, anchors } = this.props;
    return (
      <Statistic.Group
        widths="five"
        size="tiny"
        className="bo-document-summary"
      >
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.items.total || 0}
          </Statistic.Value>
          <Statistic.Label>
            <ItemIcon />
            Physical copies
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedEItemsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.eitems.total || 0}
          </Statistic.Value>
          <Statistic.Label>
            <EItemIcon /> E-items
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.circulation.active_loans_count}
          </Statistic.Value>
          <Statistic.Label>
            <LoanIcon />
            Active loans
          </Statistic.Label>
        </Statistic>
        <Statistic
          onClick={() => this.scrollTo(anchors.loanRequestsRef)}
          className="anchored"
        >
          <Statistic.Value>
            {document.metadata.circulation.pending_loans_count}
          </Statistic.Value>
          <Statistic.Label>
            <Icon name="wait" />
            Loan requests
          </Statistic.Label>
        </Statistic>
        <Statistic
          className="anchored"
          onClick={() => this.scrollTo(anchors.attachedItemsRef)}
        >
          <Statistic.Value>
            {document.metadata.circulation.available_items_for_loan_count}
          </Statistic.Value>
          <Statistic.Label>Items available for loan</Statistic.Label>
        </Statistic>
      </Statistic.Group>
    );
  }
}

DocumentSummary.propTypes = {
  document: PropTypes.object.isRequired,
  anchors: PropTypes.object.isRequired,
};
