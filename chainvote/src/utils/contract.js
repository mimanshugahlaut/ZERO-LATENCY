// Mock ABI — wire this to your compiled ChainVote.json
export const CONTRACT_ABI = [
  // ─── Read functions ───────────────────────────────────────────
  {
    "name": "owner",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }]
  },
  {
    "name": "electionState",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }]
  },
  {
    "name": "electionName",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }]
  },
  {
    "name": "candidateCount",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "name": "totalVotes",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "name": "hasVoted",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "voter", "type": "address" }],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  {
    "name": "getCandidate",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "id", "type": "uint256" }],
    "outputs": [
      { "name": "id", "type": "uint256" },
      { "name": "name", "type": "string" },
      { "name": "voteCount", "type": "uint256" }
    ]
  },
  {
    "name": "getBlock",
    "type": "function",
    "stateMutability": "view",
    "inputs": [{ "name": "index", "type": "uint256" }],
    "outputs": [
      { "name": "voter", "type": "address" },
      { "name": "candidateId", "type": "uint256" },
      { "name": "timestamp", "type": "uint256" },
      { "name": "prevHash", "type": "bytes32" },
      { "name": "voteHash", "type": "bytes32" }
    ]
  },
  {
    "name": "chainLength",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "name": "verifyChain",
    "type": "function",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bool" }]
  },
  // ─── Write functions ──────────────────────────────────────────
  {
    "name": "addCandidate",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "name", "type": "string" }],
    "outputs": []
  },
  {
    "name": "startElection",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "name", "type": "string" }],
    "outputs": []
  },
  {
    "name": "endElection",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": []
  },
  {
    "name": "castVote",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [{ "name": "candidateId", "type": "uint256" }],
    "outputs": []
  },
  // ─── Events ───────────────────────────────────────────────────
  {
    "name": "VoteCast",
    "type": "event",
    "inputs": [
      { "name": "voter", "type": "address", "indexed": true },
      { "name": "candidateId", "type": "uint256", "indexed": true },
      { "name": "blockIndex", "type": "uint256", "indexed": false },
      { "name": "voteHash", "type": "bytes32", "indexed": false }
    ]
  },
  {
    "name": "ElectionStarted",
    "type": "event",
    "inputs": [
      { "name": "name", "type": "string", "indexed": false },
      { "name": "timestamp", "type": "uint256", "indexed": false }
    ]
  },
  {
    "name": "ElectionEnded",
    "type": "event",
    "inputs": [
      { "name": "totalVotes", "type": "uint256", "indexed": false }
    ]
  },
  {
    "name": "CandidateAdded",
    "type": "event",
    "inputs": [
      { "name": "id", "type": "uint256", "indexed": true },
      { "name": "name", "type": "string", "indexed": false }
    ]
  }
];

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
