import { documentApi } from '@api/documents';
import { libraryApi } from '@api/ill';
import { patronApi } from '@api/patrons';
import { invenioConfig } from '@config';
import { DateInputField } from '@forms/core/DateTimeFields/DateInputField';
import { GroupField } from '@forms/core/GroupField';
import { PriceField } from '@forms/core/PriceField';
import { SelectField } from '@forms/core/SelectField';
import { SelectorField } from '@forms/core/SelectorField';
import { StringField } from '@forms/core/StringField';
import { TextField } from '@forms/core/TextField';
import { VocabularyField } from '@forms/core/VocabularyField';
import {
  serializeDocument,
  serializeLibrary,
  serializePatron,
} from '@modules/ESSelector/serializer';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class OrderInfo extends Component {
  render() {
    const { currencies } = this.props;
    return (
      <>
        <SelectorField
          required
          emptyHeader="No library selected"
          emptyDescription="Please select a library."
          fieldPath="library"
          errorPath="library_pid"
          label="Library"
          placeholder="Search for a library..."
          query={libraryApi.list}
          serializer={serializeLibrary}
        />
        <VocabularyField
          type={invenioConfig.VOCABULARIES.illBorrowingRequests.ill_item_type}
          fieldPath="type"
          label="Item type"
          placeholder="Select item type..."
          required
        />

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
          emptyHeader="No patron selected"
          emptyDescription="Please select a patron."
          fieldPath="patron"
          errorPath="patron_pid"
          label="Patron"
          placeholder="Search for a patron..."
          query={patronApi.list}
          serializer={serializePatron}
        />

        <GroupField widths="equal">
          <SelectField
            required
            search
            label="Status"
            fieldPath="status"
            options={invenioConfig.ILL_BORROWING_REQUESTS.statuses}
          />
          <StringField label="Cancel Reason" fieldPath="cancel_reason" />
        </GroupField>

        <GroupField widths="equal">
          <DateInputField
            label="Request date"
            fieldPath="request_date"
            optimized
          />
          <DateInputField
            label="Expected Delivery Date"
            fieldPath="expected_delivery_date"
            optimized
          />
          <DateInputField
            label="Received Date"
            fieldPath="received_date"
            optimized
          />
          <DateInputField label="Due Date" fieldPath="due_date" optimized />
        </GroupField>

        <GroupField widths="equal">
          <PriceField
            label="Total"
            fieldPath="total"
            currencies={currencies}
            defaultCurrency={invenioConfig.APP.defaultCurrency}
          />
          <PriceField
            label="Total Main Currency"
            fieldPath="total_main_currency"
            currencies={currencies}
            canSelectCurrency={false}
            defaultCurrency={invenioConfig.APP.defaultCurrency}
          />
        </GroupField>

        <TextField label="Notes" fieldPath="notes" rows={3} />
      </>
    );
  }
}

OrderInfo.propTypes = {
  currencies: PropTypes.array.isRequired,
};
