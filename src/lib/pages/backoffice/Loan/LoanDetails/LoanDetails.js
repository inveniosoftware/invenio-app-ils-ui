import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider, Sticky, Ref, Grid } from 'semantic-ui-react';
import { Loader } from '@components/Loader';
import { Error } from '@components/Error';
import { CurrentItem } from './CurrentItem';
import { LoanHeader } from './LoanHeader';
import { LoanOverbooked } from './LoanOverbooked';
import { Loan } from './Loan';
import { AvailableItems } from './AvailableItems';
import { LoanActionMenu } from './LoanActionMenu';

export default class LoanDetails extends Component {
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    const { fetchLoanDetails, match } = this.props;
    fetchLoanDetails(match.params.loanPid, true)
  }

  componentDidUpdate(prevProps) {
    const {
      fetchLoanDetails,
      match: {
        params: { loanPid },
      },
    } = this.props;

    const samePidFromRouter = prevProps.match.params.loanPid === loanPid;
    if (!samePidFromRouter) {
      fetchLoanDetails(loanPid, true);
    }
  }

  render() {
    const { isLoading, error, data, firstLoanRequested } = this.props;
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
                          {data.metadata?.document_pid && <LoanOverbooked documentPid={data.metadata?.document_pid} />}
                          <Loan />
                          <CurrentItem />
                          <AvailableItems
                            loan={data}
                            firstLoanRequested={firstLoanRequested}
                          />
                        </Container>
                      </Container>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Sticky context={this.menuRef} offset={200}>
                        <LoanActionMenu loan={data} offset={-200} />
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
  firstLoanRequested: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      loanPid: PropTypes.string,
    }),
  }).isRequired,
};

LoanDetails.defaultProps = {
  error: {},
};
