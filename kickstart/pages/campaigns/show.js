import React, { Component } from "react";
import { Button, Grid, Card } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }
  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount,
    } = this.props;
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minumum Contribution (Wei)",
        description:
          "You must contribute at least this much wei to become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of requests",
        description: "A request tries to withdraw money from the contract",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of approvers for this request",
        description: "Number of people who have approved this request",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (Ether)",
        description: "The balance is how much money this camapign has left",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <Link route={`/`}>
          <a>
            <Button
              className="ui inverted primary button"
              content="Back"
              icon="angle left"
            ></Button>
          </a>
        </Link>
        <h3> Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button className="ui inverted primary button">
                    View Requests
                  </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
