// config/index.js
// Provider + wallet setup

const { ethers } = require("ethers");
const env = require("./env");

// Create JSON-RPC provider
const provider = new ethers.JsonRpcProvider(env.RPC_URL);

// Create wallet using private key and connect to provider
const wallet = new ethers.Wallet(env.PRIVATE_KEY, provider);

module.exports = {
  provider,
  wallet,
  CONTRACT_ADDRESS: env.CONTRACT_ADDRESS
};
