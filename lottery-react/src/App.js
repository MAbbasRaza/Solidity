import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3.js";
import lottery from "./lottery";
import { Component } from "react/cjs/react.production.min";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.listPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, balance, players });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success" });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "Entry successful" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success" });

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. <br />
          Number of players participating are {this.state.players.length}.<br />
          The prize pool is {web3.utils.fromWei(this.state.balance, "ether")}
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <div>
            <h4>Wanna try your luck?</h4>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            ></input>
            <br />
            <button>Enter</button>
          </div>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>

        <button onClick={this.onClick}>Pick a winner</button>
        <hr />
        <h3>{this.state.message}</h3>
      </div>
    );
  }
}

export default App;
