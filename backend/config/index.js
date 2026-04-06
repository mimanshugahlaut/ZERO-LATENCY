// config/index.js
// ChainVote Backend — Provider & Wallet Setup
// All ethers.js connection setup lives here. Imported by contracts/contract.js only.

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { ethers } = require("ethers");

const { RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS } = process.env;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error(
    "[Config] Missing env variables. " +
    "Ensure RPC_URL, PRIVATE_KEY, and CONTRACT_ADDRESS are set in backend/.env"
  );
}

// JSON-RPC provider (Alchemy or any compatible endpoint)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Signer wallet connected to provider
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

module.exports = { provider, wallet, CONTRACT_ADDRESS };
