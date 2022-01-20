const path = require("path");
const fs = require("fs");
const solc = require("solc");

//Getting Contract Path And Source For Compiling

const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":Lottery"];
