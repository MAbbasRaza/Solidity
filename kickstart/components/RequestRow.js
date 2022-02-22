import React, { Component } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class RequestRow extends Component {
  state = {
    loading: false,
    finalLoading: false,
  };

  onApprove = async () => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {}
    this.setState({ loading: false });
  };

  onFinalize = async () => {
    event.preventDefault();
    this.setState({
      finalLoading: true,
    });
    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    try {
      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] });
      Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {}
    this.setState({ finalLoading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount >= approversCount;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              className="ui inverted green button"
              content="Approve"
              loading={this.state.loading}
              onClick={this.onApprove}
            ></Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              className="ui inverted primary button"
              content="Finalize!"
              loading={this.state.finalLoading}
              onClick={this.onFinalize}
            ></Button>
          )}
        </Cell>
        <Cell>
          {readyToFinalize && !request.complete
            ? "Ready to Finalize"
            : request.complete
            ? "Completed"
            : "Pending"}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
