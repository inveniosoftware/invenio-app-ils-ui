import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Divider, List } from 'semantic-ui-react';

export class DocumentTableOfContent extends Component {
  constructor(props) {
    super(props);
    this.toc = props.toc;
  }

  renderTOCList = () => {
    return this.toc.map(entry => (
      <List.Item key={entry}>
        <List.Content>{entry}</List.Content>
      </List.Item>
    ));
  };

  render() {
    const { abstract } = this.props;
    if (this.toc.length > 0) {
      return (
        <>
          <Divider horizontal>Table of Content</Divider>
          <List ordered>{this.renderTOCList()}</List>
          <Divider horizontal>Abstract</Divider>
          {abstract}
        </>
      );
    } else {
      return null;
    }
  }
}

DocumentTableOfContent.propTypes = {
  toc: PropTypes.array,
  abstract: PropTypes.string.isRequired,
};

DocumentTableOfContent.defaultProps = {
  toc: [],
};
