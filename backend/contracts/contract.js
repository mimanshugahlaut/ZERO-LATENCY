// contracts/contract.js
// ChainVote Backend — Contract Instance
// Loads ABI, binds to deployed address, exports ready-to-use contract object.

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { wallet, CONTRACT_ADDRESS } = require("../config");

// Load ABI from local JSON file
const abiPath = path.resolve(__dirname, "../abi/ChainVote.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Instantiate contract (wallet == signer, enables read + write)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

module.exports = contract;
