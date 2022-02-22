const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/Factory.json");
//Connecting To Wallet On Rinkeby Network

const provider = new HDWalletProvider(
  "Your 12 Word Seed Phrase Here",
  "Your Infura Rinkeby Api here"
);
const web3 = new Web3(provider);

//Deploying Contract From The Wallet Account

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();
