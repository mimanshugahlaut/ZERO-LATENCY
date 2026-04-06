// scripts/read.js
// ChainVote Backend — Read Runner
// Calls readService functions and prints results. No logic here.

const {
  getAllCandidates,
  getLedgerLength,
  verifyChain,
  getElectionStatus,
} = require("../services/readService");

async function run() {
  console.log("\n[ChainVote] Fetching on-chain data...\n");

  // Candidates
  const candidates = await getAllCandidates();
  console.log("=== Candidates ===");
  if (candidates.length === 0) {
    console.log("  No candidates registered yet.");
  } else {
    candidates.forEach((c) =>
      console.log(`  ID: ${c.id} | Name: ${c.name} | Votes: ${c.voteCount}`)
    );
  }

  // Ledger
  const total = await getLedgerLength();
  console.log(`\n=== Ledger ===`);
  console.log(`  Total votes recorded: ${total}`);

  // Chain integrity
  const { isValid, brokenIndex } = await verifyChain();
  console.log(`\n=== Chain Integrity ===`);
  if (isValid) {
    console.log("  Chain is VALID — no tampering detected.");
  } else {
    console.log(`  Chain is INVALID — broken at index: ${brokenIndex}`);
  }

  // Election status
  const active = await getElectionStatus();
  console.log(`\n=== Election Status ===`);
  console.log(`  Election Active: ${active}`);
}

run().catch((err) => {
  console.error("[scripts/read] Error:", err.reason || err.message);
  process.exit(1);
});
