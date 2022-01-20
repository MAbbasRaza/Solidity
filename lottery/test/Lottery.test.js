const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require("../compile");

let accounts;
let lottery;
let accountCount;

beforeEach(async () => {
  //
  // Getting A List Of All Accounts Through Ganache
  accounts = await web3.eth.getAccounts();

  // Using One Of The Accounts From The List To Deploy

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });
  accountCount = 0;
});

describe("Lottery Contract", () => {
  //
  //Verifying Deployment

  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    accountCount++;

    const players = await lottery.methods.listPlayers().call({
      from: accounts[0],
    });
    console.log(players);
    //
    //verification of account(s) that entered

    assert.equal(accounts[0], players[0]);
    assert.equal(accountCount, players.length);
  });

  it("allows multiple accounts to enter", async () => {
    for (let i = 0; i < 3; i++) {
      await lottery.methods.enter().send({
        from: accounts[i],
        value: web3.utils.toWei("0.02", "ether"),
      });
      accountCount++;
    }

    //only the manager can see the list of players
    //if any other account that is not account[0] calls listPlayers
    //it gives an error

    const players = await lottery.methods.listPlayers().call({
      from: accounts[0],
    });

    //displaying list of all players

    console.log(players);
    //
    //verification of account(s) that entered

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(accountCount, players.length);
  });

  it("requires minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0", "ether"),
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("sends money to the player and resets the players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[1]);
    const difference = finalBalance - initialBalance;
    console.log(finalBalance - initialBalance);
    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
