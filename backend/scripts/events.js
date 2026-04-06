// scripts/events.js
// Developer 2 - ChainVote Backend
// Listens to VoteCasted events from the ChainVote contract in real-time

const { contract } = require("./connect");

async function listenToEvents() {
  console.log("\n[ChainVote] Listening for VoteCasted events...");
  console.log("[ChainVote] Press Ctrl+C to stop.\n");

  // ethers v6: contract.on(eventName, ...args, event)
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

  // Keep the process alive to continue listening
  process.on("SIGINT", () => {
    console.log("\n[ChainVote] Event listener stopped.");
    contract.removeAllListeners();
    process.exit(0);
  });
}

listenToEvents();
