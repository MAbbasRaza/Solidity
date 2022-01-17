const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
let defaultMessage = "Hello!";
let changeMessage = "Bye";

beforeEach(async () => {
  //
  // Getting a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Using one of the accounts from the list to deploy

  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [defaultMessage],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
  //
  //Verifying Deployment
  
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  //Checking Initial Message
  
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, defaultMessage);
  });
  
  //Setting New Message

  it("can change the message", async () => {
    await inbox.methods.setMessage(changeMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, changeMessage);
  });
});
