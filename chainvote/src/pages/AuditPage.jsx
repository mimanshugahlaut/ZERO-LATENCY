import { useState } from 'react';
import { AUDIT_EVENTS } from '../utils/constants';
import { truncateAddress, timeAgo, formatDateTime } from '../utils/formatters';
import { EmptyState } from '../components/ui/EmptyState';

const MOCK_AUDIT = [
  {
    id: 'a1',
    type: 'DEPLOY',
    actor: '0xAdMiN1234567890abcdef1234567890abcdef12',
    description: 'ChainVote contract deployed to Ethereum network',
    txHash: '0xdeployTx123456789abcdef1234567890abcdef1234567890',
    blockNumber: 19_853_210,
    timestamp: Date.now() - 7_200_000,
  },
  {
    id: 'a2',
    type: 'CANDIDATE',
    actor: '0xAdMiN1234567890abcdef1234567890abcdef12',
    description: 'Candidate "Alice Johnson" added',
    txHash: '0xcand1Tx456789abcdef1234567890abcdef12345678',
    blockNumber: 19_853_215,
    timestamp: Date.now() - 6_800_000,
  },
  {
    id: 'a3',
    type: 'CANDIDATE',
    actor: '0xAdMiN1234567890abcdef1234567890abcdef12',
    description: 'Candidate "Bob Martinez" added',
    txHash: '0xcand2Tx789abcdef1234567890abcdef1234567890',
    blockNumber: 19_853_218,
    timestamp: Date.now() - 6_500_000,
  },
  {
    id: 'a4',
    type: 'START',
    actor: '0xAdMiN1234567890abcdef1234567890abcdef12',
    description: 'Election "Board Election 2025" officially started',
    txHash: '0xstartTx123abcdef1234567890abcdef12345678901234',
    blockNumber: 19_853_220,
    timestamp: Date.now() - 3_600_000,
  },
  {
    id: 'a5',
    type: 'VOTE',
    actor: '0xProtectedVoter01...',
    description: 'Encrypted Vote Payload — Block #1',
    txHash: '0xvote1Txabcdef1234567890abcdef12345678901234567890',
    blockNumber: 19_853_225,
    timestamp: Date.now() - 2_400_000,
  },
  {
    id: 'a6',
    type: 'VOTE',
    actor: '0xProtectedVoter02...',
    description: 'Encrypted Vote Payload — Block #2',
    txHash: '0xvote2Tx1234567890abcdef1234567890abcdef12345678',
    blockNumber: 19_853_230,
    timestamp: Date.now() - 1_200_000,
  },
  {
    id: 'a7',
    type: 'VOTE',
    actor: '0xProtectedVoter03...',
    description: 'Encrypted Vote Payload — Block #3',
    txHash: '0xvote3Txabcdef1234567890abcdef12345678901234',
    blockNumber: 19_853_235,
    timestamp: Date.now() - 120_000,
  },
];

const FILTERS = ['All', 'VOTE', 'CANDIDATE', 'START', 'DEPLOY', 'END'];

function AuditEntry({ entry }) {
  const evType = AUDIT_EVENTS[entry.type] || { label: entry.type, color: '#8c909f', icon: '📋' };
  return (
    <div className="audit-entry">
      <div
        className="audit-dot"
        style={{ background: `${evType.color}22`, border: `2px solid ${evType.color}66` }}
      >
        {evType.icon}
      </div>
      <div className="audit-body">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'var(--space-2)', marginBottom:'var(--space-2)' }}>
          <span className="audit-action">{evType.label}</span>
          <span style={{ fontSize:'0.72rem', color:'var(--on-surface-variant)', fontFamily:'var(--font-mono)' }}>
            {timeAgo(entry.timestamp)}
          </span>
        </div>
        <p style={{ fontSize:'0.85rem', color:'var(--on-surface-variant)', marginBottom:'var(--space-3)' }}>
          {entry.description}
        </p>
        <div className="audit-meta">
          <span>Actor: <span className="mono">{truncateAddress(entry.actor, 8, 6)}</span></span>
          {entry.blockNumber && <span>Block: <span className="mono">#{entry.blockNumber.toLocaleString()}</span></span>}
          {entry.txHash && <span>Tx: <span className="mono">{truncateAddress(entry.txHash, 10, 6)}</span></span>}
          <span style={{ marginLeft:'auto' }}>{formatDateTime(entry.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All'
    ? MOCK_AUDIT
    : MOCK_AUDIT.filter(e => e.type === filter);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Audit Trail</h1>
        <p className="page-subtitle">Complete, tamper-proof log of every action taken in this election.</p>
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:'var(--space-2)', flexWrap:'wrap', marginBottom:'var(--space-6)' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-${filter === f ? 'primary' : 'secondary'} btn-sm`}
            style={{ borderRadius:'var(--radius-full)' }}
          >
            {f === 'All' ? '🔍 All Events' : AUDIT_EVENTS[f]?.icon + ' ' + (AUDIT_EVENTS[f]?.label || f)}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:'0.8rem', color:'var(--on-surface-variant)', alignSelf:'center' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <EmptyState icon="🔍" title="No events match this filter" />
      ) : (
        <div className="audit-timeline">
          {filtered.map(entry => (
            <AuditEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}
