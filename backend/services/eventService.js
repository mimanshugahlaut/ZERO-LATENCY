// services/eventService.js
// ChainVote Backend — Event Service
// Subscribes to VoteCasted events and streams them to the console in real-time.

const contract = require("../contracts/contract");

/**
 * Starts listening to VoteCasted events from the ChainVote contract.
 * Logs voter address, candidateId, voteHash, block, and tx hash on each event.
 * Process stays alive until Ctrl+C (SIGINT).
 */
function listenToVoteCasted() {
  console.log("\n[EventService] Listening for VoteCasted events...");
  console.log("[EventService] Press Ctrl+C to stop.\n");

  // ethers v6: last argument in .on() callback is the event object
  // VoteCasted(address indexed voter, uint256 indexed candidateId, bytes32 voteHash)
  contract.on("VoteCasted", (voter, candidateId, voteHash, event) => {
    console.log("--- VoteCasted Event Detected ---");
    console.log(`  Voter Address : ${voter}`);
    console.log(`  Candidate ID  : ${candidateId.toString()}`);
    console.log(`  Vote Hash     : ${voteHash}`);
    console.log(`  Block Number  : ${event.log.blockNumber}`);
    console.log(`  Tx Hash       : ${event.log.transactionHash}`);
    console.log("---------------------------------\n");
  });

  // Graceful shutdown on Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n[EventService] Shutting down listener...");
    contract.removeAllListeners();
    process.exit(0);
  });
}

module.exports = { listenToVoteCasted };
