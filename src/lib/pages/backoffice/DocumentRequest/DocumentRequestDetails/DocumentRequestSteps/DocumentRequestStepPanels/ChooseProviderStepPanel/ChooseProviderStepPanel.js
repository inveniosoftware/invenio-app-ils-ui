import { orderApi } from '@api/acquisition';
import { borrowingRequestApi } from '@api/ill';
import {
  AcquisitionOrderIcon,
  ILLBorrowingRequestIcon,
} from '@components/backoffice/icons';
import { invenioConfig } from '@config';
import { goTo } from '@history';
import { ESSelector } from '@modules/ESSelector';
import {
  serializeAcqOrder,
  serializeBorrowingRequest,
} from '@modules/ESSelector/serializer';
import { AcquisitionRoutes, ILLRoutes } from '@routes/urls';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Divider, Grid, Label, Segment } from 'semantic-ui-react';

class AcqProvider extends Component {
  onSelectResult = (provData) => {
    const { docReq, addProvider } = this.props;
    const { acq } = invenioConfig.DOCUMENT_REQUESTS.physicalItemProviders;
    addProvider(provData.pid, docReq.pid, acq.pid_type);
  };

  goToCreateOrderAndPrefill = (docReq) => {
    const createOrderFormData = {
      formData: {
        order_lines: [
          {
            document_pid: _get(docReq, 'document_pid', ''),
            patron_pid: docReq.patron_pid,
          },
        ],
      },
      extraData: {
        attachCreatedOrderToDocumentRequest: true,
        documentRequestPid: docReq.pid,
      },
    };

    goTo(AcquisitionRoutes.orderCreate, createOrderFormData);
  };

  render() {
    const { docReq } = this.props;
    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Acquisition Order
        </Label>
        <span>Search and select an existing Acquisition Order</span>
        <Grid columns={2} padded>
          <Grid.Column>
            <ESSelector
              icon={<AcquisitionOrderIcon />}
              onSelectResult={this.onSelectResult}
              query={orderApi.listWithPendingStatus}
              serializer={serializeAcqOrder}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Button
              positive
              labelPosition="left"
              name="create-acq"
              onClick={() => this.goToCreateOrderAndPrefill(docReq)}
              icon="plus"
              content="Create new Acquisition Order"
            />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}

AcqProvider.propTypes = {
  docReq: PropTypes.object.isRequired,
  addProvider: PropTypes.func.isRequired,
};

class IllProvider extends Component {
  onSelectResult = (provData) => {
    const { docReq, addProvider } = this.props;
    const { ill } = invenioConfig.DOCUMENT_REQUESTS.physicalItemProviders;
    addProvider(provData.pid, docReq.pid, ill.pid_type);
  };

  goToCreateBrwReqAndPrefill = (docReq) => {
    const createBrwReqFormData = {
      formData: {
        document_pid: _get(docReq, 'document_pid', ''),
        patron_pid: docReq.patron_pid,
      },
      extraData: {
        attachCreatedBrwReqToDocumentRequest: true,
        documentRequestPid: docReq.pid,
      },
    };

    goTo(ILLRoutes.borrowingRequestCreate, createBrwReqFormData);
  };

  render() {
    const { docReq } = this.props;
    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Interlibrary Loan
        </Label>
        <span>Search and select an existing ILL Borrowing Request</span>
        <Grid columns={2} padded>
          <Grid.Column>
            <ESSelector
              icon={<ILLBorrowingRequestIcon />}
              onSelectResult={this.onSelectResult}
              query={borrowingRequestApi.listWithPendingStatus}
              serializer={serializeBorrowingRequest}
            />
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            <Button
              positive
              labelPosition="left"
              name="create-ill"
              onClick={() => this.goToCreateBrwReqAndPrefill(docReq)}
              icon="plus"
              content="Create new ILL Borrowing Request"
            />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}

IllProvider.propTypes = {
  docReq: PropTypes.object.isRequired,
  addProvider: PropTypes.func.isRequired,
};

export default class ChooseProviderStepPanel extends Component {
  render() {
    const { docReq, addProvider } = this.props;
    return (
      <>
        <AcqProvider docReq={docReq} addProvider={addProvider} />
        <IllProvider docReq={docReq} addProvider={addProvider} />
      </>
    );
  }
}

ChooseProviderStepPanel.propTypes = {
  docReq: PropTypes.object.isRequired,
  addProvider: PropTypes.func.isRequired,
};
