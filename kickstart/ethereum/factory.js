import web3 from "./web3";
import Factory from "./build/Factory.json";

const instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),
  "0xf01bf1731dBf85E75b43a519Ac72EE958747cb91"
);

export default instance;
