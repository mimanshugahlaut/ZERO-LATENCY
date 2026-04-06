// Responsive breakpoints (px)
export const BREAKPOINTS = {
  mobile:  640,
  tablet:  768,
  desktop: 1024,
  wide:    1440,
};

// Election states (matches frontend enum mapping)
export const ELECTION_STATE = {
  NOT_STARTED: 0,
  STARTED:     1,
  ENDED:       2,
};

export const STATE_LABELS = {
  [ELECTION_STATE.NOT_STARTED]: 'Not Started',
  [ELECTION_STATE.STARTED]:     'Active',
  [ELECTION_STATE.ENDED]:       'Ended',
};

export const STATE_BADGE_CLASS = {
  [ELECTION_STATE.NOT_STARTED]: 'badge-neutral',
  [ELECTION_STATE.STARTED]:     'badge-live',
  [ELECTION_STATE.ENDED]:       'badge-amber',
};

// Nav items
export const NAV_ITEMS = [
  { id: 'vote',    label: 'Vote',      icon: '🗳️',  emoji: '🗳️'  },
  { id: 'ledger',  label: 'Ledger',    icon: '📒',  emoji: '📒'  },
  { id: 'results', label: 'Results',   icon: '📊',  emoji: '📊'  },
  { id: 'audit',   label: 'Audit',     icon: '🔍',  emoji: '🔍'  },
  { id: 'verify',  label: 'Verify',    icon: '✅',  emoji: '✅'  },
  { id: 'admin',   label: 'Admin',     icon: '⚙️',  emoji: '⚙️'  },
];

// Audit event types
export const AUDIT_EVENTS = {
  DEPLOY:     { label: 'Contract Deployed', color: '#8b5cf6', icon: '🚀' },
  CANDIDATE:  { label: 'Candidate Added',   color: '#3b82f6', icon: '➕' },
  START:      { label: 'Election Started',  color: '#10b981', icon: '▶️'  },
  VOTE:       { label: 'Vote Cast',         color: '#06b6d4', icon: '🗳️' },
  END:        { label: 'Election Ended',    color: '#f59e0b', icon: '🏁' },
};

import deployedContract from './contract-address.json';

// Web3 configs
export const CONTRACT_ADDRESS = (deployedContract?.address || '').trim();
export const CHAIN_ID = Number(deployedContract?.chainId) || 31337;
export const CHAIN_HEX_ID = `0x${CHAIN_ID.toString(16)}`;

// Network configs
export const CHAIN_CONFIG = {
  chainId:   CHAIN_HEX_ID,
  chainName: 'Hardhat Local',
  rpcUrl:    'http://127.0.0.1:8545',
  rpcUrls:   ['http://127.0.0.1:8545'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

// Max feed items to show
export const MAX_FEED_ITEMS = 20;
