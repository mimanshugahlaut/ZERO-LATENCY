// services/readService.js
// ChainVote Backend — Read Service
// Fetches on-chain data: candidates, ledger length, chain integrity, election status.

const contract = require("../contracts/contract");

/**
 * Fetches and returns all registered candidates.
 * @returns {Promise<Array>} Array of candidate objects {id, name, voteCount}
 */
async function getAllCandidates() {
  const raw = await contract.getAllCandidates();
  return raw.map((c) => ({
    id: c.id.toString(),
    name: c.name,
    voteCount: c.voteCount.toString(),
  }));
}

/**
 * Returns the total number of votes recorded in the ledger.
 * @returns {Promise<string>}
 */
async function getLedgerLength() {
  const length = await contract.getLedgerLength();
  return length.toString();
}

/**
 * Verifies the hash chain integrity on-chain.
 * @returns {Promise<{isValid: boolean, brokenIndex: string}>}
 */
async function verifyChain() {
  const [isValid, brokenIndex] = await contract.verifyChain();
  return { isValid, brokenIndex: brokenIndex.toString() };
}

/**
 * Returns whether the election is currently active.
 * @returns {Promise<boolean>}
 */
async function getElectionStatus() {
  return await contract.electionActive();
}

module.exports = { getAllCandidates, getLedgerLength, verifyChain, getElectionStatus };
