import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class SimpleCopyButton extends React.Component {
  render() {
    const { text, onCopy } = this.props;
    return (
      <CopyToClipboard
        text={text}
        onCopy={() => {
          onCopy(text);
        }}
      >
        <Button className="copy" basic icon="copy" />
      </CopyToClipboard>
    );
  }
}

SimpleCopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export class CopyButton extends Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      confirmationPopupIsOpen: false,
      confirmationPopupMsg: '',
    };
    this.state = this.INITIAL_STATE;
    this.contextRef = React.createRef();
  }

  onCopy = () => {
    this.setState(() => ({
      confirmationPopupIsOpen: true,
      confirmationPopupMsg: 'Copied!',
    }));
    this.delayClosePopup();
  };

  delayClosePopup = () => {
    setTimeout(() => {
      this.setState(this.INITIAL_STATE);
    }, 1500);
  };

  render() {
    const { text, popUpPosition } = this.props;
    const { confirmationPopupMsg, confirmationPopupIsOpen } = this.state;
    return text ? (
      <>
        <Popup
          content={confirmationPopupMsg}
          context={this.contextRef}
          inverted
          open={confirmationPopupIsOpen}
          position={popUpPosition}
          size="mini"
        />
        <Popup
          content="Copy to clipboard"
          position={popUpPosition}
          size="mini"
          trigger={
            <span ref={this.contextRef}>
              <SimpleCopyButton text={text} onCopy={this.onCopy} />
            </span>
          }
        />
      </>
    ) : null;
  }
}

CopyButton.propTypes = {
  popUpPosition: PropTypes.string,
  text: PropTypes.string,
};

CopyButton.defaultProps = {
  popUpPosition: 'right center',
  text: '',
};
