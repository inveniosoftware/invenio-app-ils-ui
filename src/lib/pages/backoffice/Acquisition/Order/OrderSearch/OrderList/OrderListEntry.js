import { formatPrice } from '@api/utils';
import { invenioConfig } from '@config';
import { getDisplayVal } from '@config';
import { AcquisitionOrderIcon } from '@components/backoffice/icons';
import { AcquisitionRoutes, BackOfficeRoutes } from '@routes/urls';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Item, List } from 'semantic-ui-react';

export default class OrderListEntry extends Component {
  renderLeftColumn = (order) => {
    const totalMainCurrency = formatPrice(
      order.metadata.grand_total_main_currency
    );
    const total = order.metadata.grand_total
      ? ` (${formatPrice(order.metadata.grand_total)})`
      : '';
    return (
      <>
        <Item.Description>
          <Item.Meta>Ordered: {order.metadata.order_date}</Item.Meta>
        </Item.Description>
        <Item.Description>
          <label>status </label>
          {getDisplayVal('ACQ_ORDERS.statuses', order.metadata.status)}
        </Item.Description>
        <Item.Description>
          <label>vendor </label>
          <Link
            to={AcquisitionRoutes.vendorDetailsFor(order.metadata.vendor_pid)}
          >
            {order.metadata.vendor.name}
          </Link>
        </Item.Description>
        <Item.Description>
          <label>total </label>
          {totalMainCurrency}
          {total}
        </Item.Description>
      </>
    );
  };

  renderOrderLine = (orderLine, index) => {
    const documentPid = orderLine.document_pid;
    const patronPid = orderLine.patron_pid;
    const medium = orderLine.medium;
    const documentLink = (
      <Link to={BackOfficeRoutes.documentDetailsFor(documentPid)}>
        <code>{documentPid}</code>
      </Link>
    );
    const totalPrice = formatPrice(orderLine.total_price);
    return (
      <List.Item
        as="li"
        key={documentPid}
        value={`${orderLine.copies_ordered}x`}
      >
        {documentLink} - {medium}
        {patronPid && (
          <>
            {' '}
            - Patron{' '}
            <Link to={BackOfficeRoutes.patronDetailsFor(patronPid)}>
              <code>{patronPid}</code>
            </Link>
          </>
        )}{' '}
        - <em>{totalPrice}</em>
      </List.Item>
    );
  };

  renderMiddleColumn = (order) => {
    const { renderMiddleColumn } = this.props;
    if (renderMiddleColumn) {
      return renderMiddleColumn(order);
    }
    const showMax = invenioConfig.ACQ_ORDERS.maxShowOrderLines;
    const orderLines = order.metadata.order_lines;
    return (
      <List as="ol">
        {orderLines
          .slice(0, showMax)
          .map((ol, index) => this.renderOrderLine(ol, index))}
        {orderLines.length > showMax && (
          <List.Item as="li" value="...">
            of {orderLines.length} order lines
          </List.Item>
        )}
      </List>
    );
  };

  renderRightColumn = (order) => {
    const { renderRightColumn } = this.props;
    if (renderRightColumn) {
      return renderRightColumn(order);
    }
    const {
      received_date: receivedDate,
      expected_delivery_date: expectedDeliveryDate,
      payment,
    } = order.metadata;
    return (
      <List verticalAlign="middle" className="document-circulation">
        {payment && (
          <List.Item>
            <List.Content floated="right">
              <strong>{payment.mode}</strong>
            </List.Content>
            <List.Content>payment mode</List.Content>
          </List.Item>
        )}
        {receivedDate && (
          <List.Item>
            <List.Content floated="right">
              <strong>{receivedDate}</strong>
            </List.Content>
            <List.Content>received</List.Content>
          </List.Item>
        )}
        {expectedDeliveryDate && (
          <List.Item>
            <List.Content floated="right">
              <strong>{expectedDeliveryDate}</strong>
            </List.Content>
            <List.Content>expected</List.Content>
          </List.Item>
        )}
      </List>
    );
  };

  render() {
    const { record } = this.props;
    return (
      <Item>
        <Item.Content>
          <Item.Header
            as={Link}
            to={AcquisitionRoutes.orderDetailsFor(record.metadata.pid)}
            data-test={`navigate-${record.metadata.pid}`}
          >
            <AcquisitionOrderIcon />
            Order: {record.metadata.pid}
          </Item.Header>
          <Grid highlight={3}>
            <Grid.Column computer={5} largeScreen={5}>
              {this.renderLeftColumn(record)}
            </Grid.Column>
            <Grid.Column computer={6} largeScreen={6}>
              {this.renderMiddleColumn(record)}
            </Grid.Column>
            <Grid.Column width={1} />
            <Grid.Column computer={3} largeScreen={3}>
              {this.renderRightColumn(record)}
            </Grid.Column>
          </Grid>
        </Item.Content>
        <div className="pid-field">#{record.metadata.pid}</div>
      </Item>
    );
  }
}

OrderListEntry.propTypes = {
  record: PropTypes.object.isRequired,
  renderMiddleColumn: PropTypes.func,
  renderRightColumn: PropTypes.func,
};

OrderListEntry.defaultProps = {
  renderMiddleColumn: null,
  renderRightColumn: null,
};
