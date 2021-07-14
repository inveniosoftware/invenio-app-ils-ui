import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCancel } from '@api/utils';
import { Segment } from 'semantic-ui-react';
import { documentApi } from '@api/documents';

export default class LoanOverbooked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      overbooked: false,
    };
  }


  componentDidMount() {
    this.fetchCirculation()
  }

  componentWillUnmount() {
    this.cancellableCirculation && this.cancellableCirculation.cancel();
  }

  fetchCirculation = async () => {
    const { documentPid } = this.props;
    try {
      console.log(documentPid);
      this.cancellableCirculation = withCancel(
        documentApi.get(documentPid)
      );
      const response = await this.cancellableCirculation.promise;
      const circulation = response.data.metadata.circulation;
      this.setState({ overbooked: circulation.overbooked});
    } catch (error) {
      console.log(error)
    }
  };


  render() {
    const { overbooked } = this.state;
    return (
      <>
        {overbooked && <Segment attached className="bo-metadata-segment warning-box">
          There are people waiting to borrow the book.
        </Segment>}

      </>
    );
  }
}

LoanOverbooked.propTypes = {
  documentPid: PropTypes.string.isRequired,
};
