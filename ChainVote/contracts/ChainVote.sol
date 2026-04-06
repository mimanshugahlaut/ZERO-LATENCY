// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ChainVote {
    struct VoteRecord {
        address voter;
        uint256 candidateId;
        uint256 timestamp;
        bytes32 voteHash;
        bytes32 prevHash;
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
        bool exists;
    }

    address public admin;
    bool public electionActive;

    mapping(uint256 => Candidate) public candidates;
    uint256[] public candidateIds;

    VoteRecord[] public ledger;
    mapping(address => bool) public hasVoted;

    bytes32 public lastHash;

    event CandidateAdded(uint256 indexed candidateId, string name);
    event ElectionStarted();
    event ElectionEnded();
    event VoteCasted(address indexed voter, uint256 indexed candidateId, bytes32 voteHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier onlyDuringElection() {
        require(electionActive, "Election is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
        lastHash = 0;
    }

    function addCandidate(uint256 _id, string memory _name) external onlyAdmin {
        require(!candidates[_id].exists, "Candidate ID already exists");

        candidates[_id] = Candidate({
            id: _id,
            name: _name,
            voteCount: 0,
            exists: true
        });
        candidateIds.push(_id);

        emit CandidateAdded(_id, _name);
    }

    function startElection() external onlyAdmin {
        require(!electionActive, "Election already active");
        electionActive = true;
        emit ElectionStarted();
    }

    function endElection() external onlyAdmin {
        require(electionActive, "Election is not active");
        electionActive = false;
        emit ElectionEnded();
    }

    function castVote(uint256 _candidateId) external onlyDuringElection {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidates[_candidateId].exists, "Invalid candidate");

        bytes32 prevHash = lastHash;
        uint256 currentTimestamp = block.timestamp;
        
        bytes32 voteHash = keccak256(
            abi.encode(msg.sender, _candidateId, currentTimestamp, prevHash)
        );

        VoteRecord memory newVote = VoteRecord({
            voter: msg.sender,
            candidateId: _candidateId,
            timestamp: currentTimestamp,
            voteHash: voteHash,
            prevHash: prevHash
        });

        ledger.push(newVote);
        
        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        lastHash = voteHash;

        emit VoteCasted(msg.sender, _candidateId, voteHash);
    }

    function verifyChain() external view returns (bool isValid, uint256 brokenIndex) {
        bytes32 currentPrevHash = 0;

        for (uint256 i = 0; i < ledger.length; i++) {
            VoteRecord memory record = ledger[i];
            
            if (record.prevHash != currentPrevHash) {
                return (false, i);
            }

            bytes32 recomputedHash = keccak256(
                abi.encode(record.voter, record.candidateId, record.timestamp, record.prevHash)
            );

            if (recomputedHash != record.voteHash) {
                return (false, i);
            }

            currentPrevHash = record.voteHash;
        }

        return (true, ledger.length);
    }

    function getAllCandidates() external view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateIds.length);
        for (uint256 i = 0; i < candidateIds.length; i++) {
            allCandidates[i] = candidates[candidateIds[i]];
        }
        return allCandidates;
    }

    function getLedgerLength() external view returns (uint256) {
        return ledger.length;
    }
}
