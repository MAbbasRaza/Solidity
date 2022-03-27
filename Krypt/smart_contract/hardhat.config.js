require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "Your Rinkeby API Key Here",
      accounts: ["Your Account's Private Key Here"],
    },
  },
};
