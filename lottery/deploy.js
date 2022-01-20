const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

//Connecting To Wallet On Rinkeby Network

const provider = new HDWalletProvider(
  "moral lock exit oppose peace quantum okay destroy spoon panda lottery lecture",
  "https://rinkeby.infura.io/v3/4fe2daad368a4a34bae2f7bdbfa3bace"
);
const web3 = new Web3(provider);

//Deploying Contract From The Wallet Account

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
};
deploy();
