import { withCancel } from '@api/utils';
import { vocabularyApi } from '@api/vocabularies';
import { invenioConfig } from '@config';
import PropTypes from 'prop-types';
import React from 'react';
import { AccordionField } from './AccordionField';
import { SelectField } from './SelectField';

export class VocabularyField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      error: null,
      options: [],
    };
  }

  componentDidMount() {
    const { serializer: propsSerializer } = this.props;
    const serializer = propsSerializer || this.serializer;
    this.fetchVocabularies(serializer);
  }

  componentWillUnmount() {
    this.cancellableFetchVocabularies &&
      this.cancellableFetchVocabularies.cancel();
  }

  query = () => {
    const { type } = this.props;
    const searchQuery = vocabularyApi
      .query()
      .withType(type)
      .withSize(invenioConfig.APP.MAX_RESULTS_WINDOW)
      .qs();
    return vocabularyApi.list(searchQuery);
  };

  serializer = (hit) => ({
    key: hit.metadata.id,
    value: hit.metadata.key,
    text: hit.metadata.text,
  });

  fetchVocabularies = async (serializer) => {
    const { label } = this.props;
    this.cancellableFetchVocabularies = withCancel(this.query());
    try {
      const response = await this.cancellableFetchVocabularies.promise;
      const options = response.data.hits.map((hit) => serializer(hit));

      this.setState({ isLoading: false, options: options, error: null });
    } catch (error) {
      if (error !== 'UNMOUNTED') {
        this.setState({
          isLoading: false,
          error: {
            content: `Error loading values for ${label}.`,
            pointing: 'above',
          },
        });
      }
    }
  };

  render() {
    const {
      accordion,
      fieldPath,
      label,
      multiple,
      serializer,
      type,
      width,
      ...uiProps
    } = this.props;
    const { isLoading, options, error } = this.state;
    const noResultsMessage = isLoading
      ? 'Loading options...'
      : `No ${type} vocabularies found.`;
    const selectField = (
      <SelectField
        search
        fieldPath={fieldPath}
        label={accordion ? null : label}
        multiple={multiple}
        error={error}
        options={options}
        width={width}
        loading={isLoading}
        upward={false}
        noResultsMessage={noResultsMessage}
        {...uiProps}
      />
    );

    if (accordion) {
      return (
        <AccordionField
          fieldPath={fieldPath}
          label={label}
          content={selectField}
        />
      );
    }

    return selectField;
  }
}

VocabularyField.propTypes = {
  accordion: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  serializer: PropTypes.func,
  type: PropTypes.string.isRequired,
  width: PropTypes.number,
};

VocabularyField.defaultProps = {
  accordion: false,
  multiple: false,
  label: '',
  serializer: null,
  width: 16,
};
