// scripts/vote.js
// Developer 2 - ChainVote Backend
// Casts a vote for a candidate by calling castVote(candidateId) on-chain

const { contract } = require("./connect");

// Set the candidateId you want to vote for
const CANDIDATE_ID = 1;

async function castVote() {
  console.log(`\n[ChainVote] Casting vote for Candidate ID: ${CANDIDATE_ID}...`);

  try {
    // Send the transaction
    const tx = await contract.castVote(CANDIDATE_ID);
    console.log(`[ChainVote] Transaction sent. Hash: ${tx.hash}`);

    // Wait for 1 confirmation
    const receipt = await tx.wait(1);
    console.log(`[ChainVote] Transaction confirmed in block: ${receipt.blockNumber}`);
    console.log(`[ChainVote] Gas used: ${receipt.gasUsed.toString()}`);
    console.log(`[ChainVote] Vote successfully cast for Candidate ID: ${CANDIDATE_ID}`);
  } catch (err) {
    console.error("[ChainVote] Vote failed:", err.reason || err.message);
    process.exit(1);
  }
}

castVote();
