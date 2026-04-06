// services/voteService.js
// Handles the castVote transaction

const contract = require("../contracts/contract");
const { log, error } = require("../utils/logger");

/**
 * Casts a vote for the given candidateId on-chain.
 * @param {number} candidateId - The ID of the candidate to vote for.
 */
async function castVote(candidateId) {
  log(`\n[VoteService] Casting vote for Candidate ID: ${candidateId}...`);

  try {
    const tx = await contract.castVote(candidateId);
    log(`[VoteService] Transaction sent. Hash: ${tx.hash}`);

    const receipt = await tx.wait(1);
    log(`[VoteService] Confirmed in block : ${receipt.blockNumber}`);
    log(`[VoteService] Gas used           : ${receipt.gasUsed.toString()}`);
    log(`[VoteService] Vote cast successfully for Candidate ID: ${candidateId}`);
    return receipt;
  } catch (err) {
    error("[VoteService] Error casting vote:", err.reason || err.message);
    throw err;
  }
}

module.exports = { castVote };

