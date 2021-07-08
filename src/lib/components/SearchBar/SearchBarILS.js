import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

export class SearchBarILS extends Component {
  state = { currentValue: '' };

  clearQueryString = () => {
    this.setState({ currentValue: '' });
  };

  onKeyPressHandler = (event, input) => {
    if (event.key === 'Enter') {
      const { onSearchHandler } = this.props;
      const { currentValue } = this.state;
      onSearchHandler(currentValue);
    }
  };

  onPasteHandler = (event) => {
    const { onSearchHandler } = this.props;
    event.preventDefault();
    const queryString = (event.clipboardData || window.clipboardData).getData(
      'text'
    );
    this.setState({ currentValue: queryString });
    onSearchHandler(queryString);
  };

  render() {
    const {
      className: parentClass,
      onKeyPressHandler: parentKeyPressHandler,
      onSearchHandler,
      onPasteHandler,
      onChangeHandler,
      placeholder,
      ...rest
    } = this.props;
    const { currentValue } = this.state;
    return (
      <Input
        action={{
          icon: 'search',
          onClick: () => onSearchHandler(currentValue),
        }}
        onChange={(event, { value }) => {
          this.setState({ currentValue: value });
          onChangeHandler && onChangeHandler(value);
        }}
        value={currentValue}
        onKeyPress={parentKeyPressHandler || this.onKeyPressHandler}
        onPaste={onPasteHandler || this.onPasteHandler}
        fluid
        size="big"
        placeholder={placeholder}
        className={`${parentClass} ils-searchbar`}
        {...rest}
      />
    );
  }
}

SearchBarILS.propTypes = {
  onKeyPressHandler: PropTypes.func,
  onPasteHandler: PropTypes.func,
  onSearchHandler: PropTypes.func.isRequired,
  onChangeHandler: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

SearchBarILS.defaultProps = {
  onKeyPressHandler: null,
  onPasteHandler: null,
  onChangeHandler: null,
  placeholder: '',
  className: '',
};
