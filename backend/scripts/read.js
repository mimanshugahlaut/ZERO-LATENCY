// scripts/read.js
// Runs readService

const {
  getAllCandidates,
  getLedgerLength,
  verifyChain,
  getElectionStatus,
} = require("../services/readService");
const { log, error } = require("../utils/logger");

async function run() {
  log("\n[ChainVote] Fetching on-chain data...\n");

  const candidates = await getAllCandidates();
  log("=== Candidates ===");
  if (candidates.length === 0) {
    log("  No candidates registered yet.");
  } else {
    candidates.forEach((c) =>
      log(`  ID: ${c.id} | Name: ${c.name} | Votes: ${c.voteCount}`)
    );
  }

  const total = await getLedgerLength();
  log(`\n=== Ledger ===`);
  log(`  Total votes recorded: ${total}`);

  const { isValid, brokenIndex } = await verifyChain();
  log(`\n=== Chain Integrity ===`);
  if (isValid) {
    log("  Chain is VALID — no tampering detected.");
  } else {
    log(`  Chain is INVALID — broken at index: ${brokenIndex}`);
  }

  const active = await getElectionStatus();
  log(`\n=== Election Status ===`);
  log(`  Election Active: ${active}`);
}

run().catch((err) => {
  error("[scripts/read] Error running read script.");
  process.exit(1);
});
