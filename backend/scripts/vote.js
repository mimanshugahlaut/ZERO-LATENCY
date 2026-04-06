// scripts/vote.js
// ChainVote Backend — Vote Runner
// Calls voteService.castVote(). Change CANDIDATE_ID to target a different candidate.

const { castVote } = require("../services/voteService");

const CANDIDATE_ID = 1;

castVote(CANDIDATE_ID).catch((err) => {
  console.error("[scripts/vote] Error:", err.reason || err.message);
  process.exit(1);
});
