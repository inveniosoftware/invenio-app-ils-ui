import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Sticky, Ref, Grid } from 'semantic-ui-react';
import { Loader, Error } from '@components';
import { CurrentItem } from './CurrentItem';
import { LoanHeader } from './LoanHeader';
import { Loan } from './Loan';
import { AvailableItems } from './AvailableItems';
import { LoanActionMenu } from './LoanActionMenu/';

export default class LoanDetails extends Component {
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    const { fetchLoanDetails } = this.props;
    fetchLoanDetails(this.props.match.params.loanPid);
  }

  componentDidUpdate(prevProps) {
    const loanPid = this.props.match.params.loanPid;
    const { fetchLoanDetails } = this.props;

    const samePidFromRouter = prevProps.match.params.loanPid === loanPid;
    if (!samePidFromRouter) {
      fetchLoanDetails(loanPid);
    }
  }

  render() {
    const { isLoading, error, data } = this.props;
    return (
      <div ref={this.headerRef}>
        <Container fluid>
          <Loader isLoading={isLoading}>
            <Error error={error}>
              <Sticky context={this.headerRef} className="solid-background">
                <Container fluid className="spaced">
                  <LoanHeader data={data} />
                </Container>
                <Divider />
              </Sticky>
              <Container fluid>
                <Ref innerRef={this.menuRef}>
                  <Grid columns={2}>
                    <Grid.Column width={13}>
                      <Container className="spaced">
                        <Container className="spaced">
                          <Loan />
                          <CurrentItem />
                          <AvailableItems loan={data} />
                        </Container>
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={200}>
                        <LoanActionMenu offset={-200} />
                      </Sticky>
                    </Grid.Column>
                  </Grid>
                </Ref>
              </Container>
            </Error>
          </Loader>
        </Container>
      </div>
    );
  }
}

LoanDetails.propTypes = {
  /* REDUX */
  fetchLoanDetails: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

LoanDetails.defaultProps = {
  error: {},
};
