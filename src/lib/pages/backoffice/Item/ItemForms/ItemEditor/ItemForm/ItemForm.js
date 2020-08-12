import { documentApi } from '@api/documents';
import { itemApi } from '@api/items';
import { internalLocationApi } from '@api/locations';
import { withCancel } from '@api/utils';
import { vocabularyApi } from '@api/vocabularies';
import { invenioConfig } from '@config';
import { AccordionField } from '@forms/core/AccordionField';
import { BaseForm } from '@forms/core/BaseForm';
import { GroupField } from '@forms/core/GroupField';
import { PriceField } from '@forms/core/PriceField';
import { SelectField } from '@forms/core/SelectField';
import { SelectorField } from '@forms/core/SelectorField';
import { StringField } from '@forms/core/StringField';
import { TextField } from '@forms/core/TextField';
import { goTo } from '@history';
import {
  serializeDocument,
  serializeInternalLocation,
} from '@modules/ESSelector/serializer';
import { BackOfficeRoutes } from '@routes/urls';
import { getIn } from 'formik';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import itemSubmitSerializer from './itemSubmitSerializer';

export class ItemForm extends Component {
  constructor(props) {
    super(props);
    this.config = invenioConfig.ITEMS;
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isLoading: true,
      currencies: [],
      // eslint-disable-next-line react/no-unused-state
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCurrencies();
  }

  componentWillUnmount() {
    this.cancellableFetchData && this.cancellableFetchData.cancel();
  }

  query = () => {
    const searchQuery = vocabularyApi
      .query()
      .withType(invenioConfig.VOCABULARIES.currencies)
      .qs();
    return vocabularyApi.list(searchQuery);
  };

  serializer = hit => ({
    key: hit.metadata.key,
    value: hit.metadata.key,
    text: hit.metadata.key,
  });

  fetchCurrencies = async () => {
    this.cancellableFetchData = withCancel(this.query());
    try {
      const response = await this.cancellableFetchData.promise;
      const currencies = response.data.hits.map(hit => this.serializer(hit));
      // eslint-disable-next-line react/no-unused-state
      this.setState({ isLoading: false, currencies: currencies, error: null });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          isloading: false,
          currencies: [
            { key: '', value: '', text: 'Failed to load currencies.' },
          ],
          // eslint-disable-next-line react/no-unused-state
          error: {
            content: 'Failed to load currencies.',
            pointing: 'above',
          },
        });
      }
    }
  };

  prepareData = data => {
    return pick(data, [
      'acquisition_pid',
      'barcode',
      'circulation_restriction',
      'description',
      'document_pid',
      'document',
      'internal_location_pid',
      'internal_location',
      'internal_notes',
      'isbn',
      'legacy_id',
      'legacy_library_id',
      'medium',
      'number_of_pages',
      'physical_description',
      'price',
      'shelf',
      'status',
    ]);
  };

  update = (pid, data) => {
    return itemApi.update(pid, data);
  };

  create = data => {
    return itemApi.create(data);
  };

  successCallback = response => {
    goTo(BackOfficeRoutes.itemDetailsFor(getIn(response, 'data.metadata.pid')));
  };

  render() {
    const {
      data: { metadata },
      data,
      successSubmitMessage,
      title,
      pid,
    } = this.props;
    const initialValues = data ? this.prepareData(metadata) : {};
    const { currencies } = this.state;
    return (
      <BaseForm
        initialValues={{
          circulation_restriction: 'NO_RESTRICTION',
          status: 'CAN_CIRCULATE',
          medium: 'NOT_SPECIFIED',
          ...initialValues,
        }}
        editApiMethod={this.update}
        createApiMethod={this.create}
        successCallback={this.successCallback}
        successSubmitMessage={successSubmitMessage}
        title={title}
        pid={pid}
        submitSerializer={itemSubmitSerializer}
      >
        <StringField required label="Barcode" fieldPath="barcode" />
        <SelectField
          required
          search
          label="Circulation restriction"
          fieldPath="circulation_restriction"
          options={this.config.circulationRestrictions}
        />
        <SelectField
          required
          search
          label="Status"
          fieldPath="status"
          options={this.config.statuses}
        />
        <TextField label="Description" fieldPath="description" rows={5} />
        <SelectorField
          required
          emptyHeader="No document selected"
          emptyDescription="Please select a document."
          fieldPath="document"
          errorPath="document_pid"
          label="Document"
          placeholder="Search for a document..."
          query={documentApi.list}
          serializer={serializeDocument}
        />
        <SelectorField
          required
          emptyHeader="No internal location selected"
          emptyDescription="Please select an internal location."
          fieldPath="internal_location"
          errorPath="internal_location_pid"
          label="Internal location"
          placeholder="Search for an internal location..."
          query={internalLocationApi.list}
          serializer={serializeInternalLocation}
        />
        <TextField label="Internal Notes" fieldPath="internal_notes" rows={5} />
        <StringField label="Acquisition Pid" fieldPath="acquisition_pid" />
        {currencies.length > 0 && (
          <PriceField
            label="Price"
            fieldPath="price"
            currencies={currencies}
            defaultCurrency={invenioConfig.APP.defaultCurrency}
          />
        )}
        <AccordionField
          label="ISBN"
          fieldPath="isbn"
          content={
            <GroupField border widths="equal" fieldPath="isbn">
              <StringField required label="Value" fieldPath="isbn.value" />
              <TextField
                label="Description"
                fieldPath="isbn.description"
                rows={2}
              />
            </GroupField>
          }
        />
        <GroupField widths="equal">
          <StringField label="Legacy ID" fieldPath="legacy_id" />
          <StringField
            label="Legacy library ID"
            fieldPath="legacy_library_id"
          />
        </GroupField>
        <GroupField widths="equal">
          <SelectField
            required
            search
            label="Medium"
            fieldPath="medium"
            options={this.config.mediums}
          />
          <StringField label="Number of pages" fieldPath="number_of_pages" />
        </GroupField>
        <TextField
          label="Physical description"
          fieldPath="physical_description"
          rows={3}
        />
        <StringField label="Shelf" fieldPath="shelf" />
      </BaseForm>
    );
  }
}

ItemForm.propTypes = {
  data: PropTypes.object,
  successSubmitMessage: PropTypes.string,
  title: PropTypes.string,
  pid: PropTypes.string.isRequired,
};

ItemForm.defaultProps = {
  data: null,
  successSubmitMessage: null,
  title: null,
};
