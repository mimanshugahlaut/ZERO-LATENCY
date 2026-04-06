// scripts/connect.js
// Developer 2 - ChainVote Backend
// Initializes provider, wallet, and contract instance using ethers v6

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load ABI from local file
const abiPath = path.resolve(__dirname, "../abi/ChainVote.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Validate required env vars
const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "Missing env variables. Ensure RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS are set in backend/.env"
  );
}

// Initialize provider (Alchemy / any JSON-RPC)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create signer wallet connected to provider
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Connect to the deployed ChainVote contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

module.exports = { provider, wallet, contract };
