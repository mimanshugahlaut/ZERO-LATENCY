// scripts/read.js
// Developer 2 - ChainVote Backend
// Reads all candidates and ledger length from the deployed contract

const { contract } = require("./connect");

async function readData() {
  console.log("\n[ChainVote] Fetching on-chain data...\n");

  try {
    // Fetch all candidates
    const candidates = await contract.getAllCandidates();
    console.log("=== Candidates ===");

    if (candidates.length === 0) {
      console.log("  No candidates registered yet.");
    } else {
      candidates.forEach((c) => {
        console.log(`  ID: ${c.id.toString()} | Name: ${c.name} | Votes: ${c.voteCount.toString()}`);
      });
    }

    // Fetch ledger length (total votes cast)
    const ledgerLength = await contract.getLedgerLength();
    console.log(`\n=== Ledger ===`);
    console.log(`  Total votes recorded: ${ledgerLength.toString()}`);

    // Fetch chain integrity
    const [isValid, brokenIndex] = await contract.verifyChain();
    console.log(`\n=== Chain Integrity ===`);
    if (isValid) {
      console.log("  Chain is VALID — no tampering detected.");
    } else {
      console.log(`  Chain is INVALID — broken at index: ${brokenIndex.toString()}`);
    }

    // Fetch election status
    const active = await contract.electionActive();
    console.log(`\n=== Election Status ===`);
    console.log(`  Election Active: ${active}`);
  } catch (err) {
    console.error("[ChainVote] Read failed:", err.reason || err.message);
    process.exit(1);
  }
}

readData();
