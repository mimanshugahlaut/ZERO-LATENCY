# ChainVote (ZERO-LATENCY)

ChainVote is a secure, web3-based voting platform built for high performance, verified audits, and seamless user experiences. This repository contains both the modern frontend interface and the scalable backend infrastructure that interacts with Ethereum-compatible smart contracts.

## Overview

The overall architecture is split into two primary components:
- **`/frontend`**: A modern React-based user interface (Vite + React) that handles the authentication system, cryptographic token generation, vote verification, and seamless interactions with the blockchain ledger.
- **`/backend`**: A scalable backend leveraging `ethers` v6 to manage provider and wallet configurations, execute core smart contract logic (voting, reading state, listening to events), and run execution scripts.

## Features

### Frontend Capabilities
- **Robust Authentication System**: Email/Phone OTP login functionality for a secure, Web2-friendly onboarding experience.
- **Comprehensive Application Pages**: Multiple specialized views:
  - **Vote Page**: Cast your secure, cryptographically-backed vote.
  - **Results Page**: View real-time election results processing smart contract events.
  - **Ledger & Audit Pages**: Complete transparency tools to explore transactions and audit the vote tally.
  - **Verify Page**: Allow individual voters to cryptographically verify their own submisson.
  - **Admin Panel**: Manage the election state and candidate roster.
- **Blockchain Integration Hooks**: Custom React hooks (`useContract`, `useElection`, `useCandidates`, `useEvents`) to gracefully handle on-chain interactions.

### Backend Infrastructure
- **Smart Contract Bridging**: Directly communicates with the deployed ChainVote smart contract via the `ethers` library.
- **Dedicated Execution Scripts**: Contains ready-to-use scripts for voting, reading contract state, and streaming live contract events.
- **Modular Services**: Separate layers for `config`, `contracts`, `services`, and `utils` for high maintainability.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mimanshugahlaut/ZERO-LATENCY.git
   cd ZERO-LATENCY
   ```

2. **Backend Setup:**
   Navigate to the backend directory, install dependencies, and configure your environment variables.
   ```bash
   cd backend
   npm install
   # Set up your .env file
   ```

3. **Frontend Setup:**
   Navigate to the frontend directory and install dependencies.
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

**Backend:**
Available scripts for interacting with the smart contract:
```bash
npm run vote    # Execute test voting transactions
npm run read    # Read the current election state
npm run events  # Listen to live on-chain polling events
```

**Frontend:**
Run the development server:
```bash
npm run dev
```

## License

ISC License
