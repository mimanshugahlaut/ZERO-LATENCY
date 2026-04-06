// contracts/contract.js
// Contract instance (ethers)

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { wallet, CONTRACT_ADDRESS } = require("../config");

// Load ABI from local JSON file
const abiPath = path.resolve(__dirname, "./abi/ChainVote.json");
const abiFile = fs.readFileSync(abiPath, "utf8");
const abi = JSON.parse(abiFile); // if it's the raw json it might be different, let's assume it's the array. If it's an object, it might need abi.abi. But we used array before.

// Initialize ethers.Contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

module.exports = contract;

