import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Overridable from 'react-overridable';

class HttpError extends Component {
  render() {
    const { title, message, icon, isBackOffice, errorId } = this.props;
    return (
      <Overridable id="HttpError.layout" {...this.props}>
        <div className="frontsite">
          <Grid
            container
            verticalAlign="middle"
            textAlign="center"
            className="error-page"
          >
            <Grid.Column>
              <Icon name={icon} size="massive" />
              <h1>{title}</h1>
              <h3>{message}</h3>
              {errorId ? <h4> Error Id: {errorId}</h4> : null}
              {!isBackOffice && (
                <Link to="/">
                  <Button icon labelPosition="left" primary>
                    <Icon name="home" />
                    Back to home
                  </Button>
                </Link>
              )}
            </Grid.Column>
          </Grid>
        </div>
      </Overridable>
    );
  }
}

HttpError.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isBackOffice: PropTypes.bool,
  errorId: PropTypes.string,
};

HttpError.defaultProps = {
  isBackOffice: false,
  errorId: undefined,
};

export default Overridable.component('HttpError', HttpError);
