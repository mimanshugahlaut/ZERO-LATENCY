// services/eventService.js
// Event Service

const contract = require("../contracts/contract");
const { log } = require("../utils/logger");

/**
 * Starts listening to VoteCasted events from the ChainVote contract.
 */
function listenToVoteCasted() {
  log("\n[EventService] Listening for VoteCasted events...");
  log("[EventService] Press Ctrl+C to stop.\n");

  contract.on("VoteCasted", (voter, candidateId, voteHash, event) => {
    log("--- VoteCasted Event Detected ---");
    log(`  Voter Address : ${voter}`);
    log(`  Candidate ID  : ${candidateId.toString()}`);
    log(`  Vote Hash     : ${voteHash}`);
    log(`  Block Number  : ${event.log.blockNumber}`);
    log(`  Tx Hash       : ${event.log.transactionHash}`);
    log("---------------------------------\n");
  });

  process.on("SIGINT", () => {
    log("\n[EventService] Shutting down listener...");
    contract.removeAllListeners();
    process.exit(0);
  });
}

module.exports = { listenToVoteCasted };

