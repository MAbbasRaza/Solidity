import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/4fe2daad368a4a34bae2f7bdbfa3bace"
  );
  web3 = new Web3(provider);
}

export default web3;
