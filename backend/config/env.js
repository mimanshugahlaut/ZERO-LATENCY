// config/env.js
// Load environment variables and export them

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS
} = process.env;

if (!RPC_URL || !PRIVATE_KEY || !CONTRACT_ADDRESS) {
  throw new Error("Missing required environment variables in backend/.env!");
}

module.exports = {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS
};
