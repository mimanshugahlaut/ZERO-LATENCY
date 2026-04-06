// scripts/events.js
// ChainVote Backend — Event Runner
// Delegates entirely to eventService. No logic here.

const { listenToVoteCasted } = require("../services/eventService");

listenToVoteCasted();
