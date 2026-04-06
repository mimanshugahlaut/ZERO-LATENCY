import { useState, useEffect } from 'react';
import { truncateHash, timeAgo, copyToClipboard } from '../utils/formatters';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

const MOCK_CHAIN = [
  {
    index: 0,
    voter: '0x0000000000000000000000000000000000000000',
    candidateName: 'GENESIS',
    candidateId: -1,
    timestamp: Date.now() - 3_600_000,
    prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    voteHash: '0xA1B2C3D4E5F6789012345678901234567890abcdef1234567890abcdef123456',
    isGenesis: true,
  },
  {
    index: 1,
    voter: 'Protected Voter',
    candidateName: 'Encrypted Vote',
    candidateId: -1,
    dotColor: '#4b5563', // gray
    timestamp: Date.now() - 2_400_000,
    prevHash: '0xA1B2C3D4E5F6789012345678901234567890abcdef1234567890abcdef123456',
    voteHash: '0xE5F6789012345678901234567890abcdef1234567890abcdef1234567890ABCD',
  },
  {
    index: 2,
    voter: 'Protected Voter',
    candidateName: 'Encrypted Vote',
    candidateId: -1,
    dotColor: '#4b5563',
    timestamp: Date.now() - 1_200_000,
    prevHash: '0xE5F6789012345678901234567890abcdef1234567890abcdef1234567890ABCD',
    voteHash: '0xF0A1B2C3D4E5F6789012345678901234567890abcdef1234567890abcdef12EF',
  },
  {
    index: 3,
    voter: 'Protected Voter',
    candidateName: 'Encrypted Vote',
    candidateId: -1,
    dotColor: '#4b5563',
    timestamp: Date.now() - 120_000,
    prevHash: '0xF0A1B2C3D4E5F6789012345678901234567890abcdef1234567890abcdef12EF',
    voteHash: '0x1234567890ABCDEF1234567890abcdef1234567890abcdef1234567890FEDCBA',
    isLatest: true,
  },
];

function CopyButton({ text, toast }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      toast?.success('Copied!');
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <button className="copy-btn" onClick={handleCopy} title="Copy">
      {copied ? '✅' : '📋'}
    </button>
  );
}

function BlockCard({ block, toast }) {
  // In Secret Ballot, we disregard the candidate object for public blocks
  const candidateName = block.isGenesis ? block.candidateName : 'Encrypted Vote Payload';
  const dotColor = block.isGenesis ? '#3b82f6' : '#4b5563';

  return (
    <div className={`ledger-block ${block.isGenesis ? 'genesis' : ''} ${block.isLatest ? 'latest' : ''}`}>
      <div className="block-header">
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <span className="badge badge-secondary" style={{ fontFamily:'var(--font-mono)' }}>
            #{String(block.index).padStart(2,'0')}
          </span>
          <span className="block-number font-display">
            {block.isGenesis ? '⛓ Genesis Block' : `Block #${block.index}`}
          </span>
        </div>
        <div style={{ display:'flex', gap:'var(--space-2)', alignItems:'center' }}>
          {block.isLatest && <span className="badge badge-live">LATEST</span>}
          {block.isGenesis && <span className="badge badge-secondary">ORIGIN</span>}
          <span style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)', fontFamily:'var(--font-mono)' }}>
            {timeAgo(block.timestamp)}
          </span>
        </div>
      </div>

      {/* Block data rows */}
      {!block.isGenesis && (
        <>
          <div className="block-row">
            <span className="block-label">Voter Identity</span>
            <span className="block-value">
              <span className="bg-white/10 px-2 py-0.5 rounded text-white/50 text-xs">HIDDEN (Secret Ballot)</span>
            </span>
          </div>
          <div className="block-row">
            <span className="block-label">Payload</span>
            <span className="block-value">
              <span style={{ width:8, height:8, borderRadius:'50%', background:dotColor, display:'inline-block', marginRight:4, flexShrink:0 }} />
              <span className="text-white/60 italic">{candidateName}</span>
            </span>
          </div>
        </>
      )}
      <div className="block-row">
        <span className="block-label">Prev Hash</span>
        <span className="block-value hash-purple">
          {truncateHash(block.prevHash)}
          <CopyButton text={block.prevHash} toast={toast} />
        </span>
      </div>
      <div className="block-row">
        <span className="block-label">Vote Hash</span>
        <span className="block-value hash-blue">
          {truncateHash(block.voteHash)}
          <CopyButton text={block.voteHash} toast={toast} />
        </span>
      </div>
    </div>
  );
}

export default function LedgerPage({ election, callRead, toast }) {
  const [chain, setChain]     = useState(MOCK_CHAIN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!callRead || !election.chainLength) return;
    const fetchChain = async () => {
      setLoading(true);
      try {
        const blocks = await Promise.all(
          Array.from({ length: election.chainLength }, (_, i) => callRead('ledger', i))
        );
        const enriched = blocks.map((b, i) => ({
          index:         i,
          voter:         'Protected Voter',
          candidateName: 'Encrypted Vote',
          candidateId:   -1,
          timestamp:     Number(b.timestamp),
          prevHash:      b.prevHash,
          voteHash:      b.voteHash,
          isGenesis:     i === 0,
          isLatest:      i === blocks.length - 1,
        }));
        setChain(enriched);
      } catch {
        setChain(MOCK_CHAIN);
      } finally {
        setLoading(false);
      }
    };
    fetchChain();
  }, [callRead, election.chainLength]);

  return (
    <>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
          <h1 className="page-title">Vote Ledger</h1>
          <span className="badge badge-primary" style={{ fontSize:'0.75rem' }}>
            {chain.length} {chain.length === 1 ? 'Block' : 'Blocks'}
          </span>
        </div>
        <p className="page-subtitle">
          Every vote is cryptographically chained. Each block's prev hash must match the previous block's vote hash. Learns zero-knowledge about the voter.
        </p>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          {Array.from({length:4}).map((_,i)=><Skeleton key={i} height="120px" />)}
        </div>
      ) : chain.length === 0 ? (
        <EmptyState icon="📒" title="No blocks yet" description="Cast the first vote to start the chain." />
      ) : (
        <div className="ledger-chain">
          {chain.map((block, i) => (
            <div key={block.index}>
              <BlockCard block={block} toast={toast} />
              {i < chain.length - 1 && (
                <div className="ledger-connector">
                  <div className="chain-link-icon">🔗</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
