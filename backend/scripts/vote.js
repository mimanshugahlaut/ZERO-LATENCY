// scripts/vote.js
// Runs voteService

const { castVote } = require("../services/voteService");
const { error } = require("../utils/logger");

const CANDIDATE_ID = 1;

castVote(CANDIDATE_ID).catch((err) => {
  error("[scripts/vote] Error running vote script.");
  process.exit(1);
});
