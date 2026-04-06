// services/voteService.js
// ChainVote Backend — Vote Service
// Handles the castVote transaction: sends, confirms, and reports result.

const contract = require("../contracts/contract");

/**
 * Casts a vote for the given candidateId on-chain.
 * @param {number} candidateId - The ID of the candidate to vote for.
 */
async function castVote(candidateId) {
  console.log(`\n[VoteService] Casting vote for Candidate ID: ${candidateId}...`);

  const tx = await contract.castVote(candidateId);
  console.log(`[VoteService] Transaction sent. Hash: ${tx.hash}`);

  const receipt = await tx.wait(1);
  console.log(`[VoteService] Confirmed in block : ${receipt.blockNumber}`);
  console.log(`[VoteService] Gas used           : ${receipt.gasUsed.toString()}`);
  console.log(`[VoteService] Vote cast successfully for Candidate ID: ${candidateId}`);
}

module.exports = { castVote };
