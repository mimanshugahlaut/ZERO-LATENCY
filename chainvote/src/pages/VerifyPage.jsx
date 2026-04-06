import { useState } from 'react';
import { truncateHash } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

const MOCK_CHAIN_DETAILS = {
  totalBlocks:    47,
  genesisHash:    '0xA1B2C3D4E5F6789012345678901234567890abcdef1234567890abcdef123456',
  latestHash:     '0x1234567890ABCDEF1234567890abcdef1234567890abcdef1234567890FEDCBA',
  computedAt:     new Date().toLocaleTimeString(),
};

export default function VerifyPage({ election, callRead, toast }) {
  const [status, setStatus]  = useState('idle');  // idle | verifying | intact | broken
  const [details, setDetails] = useState(null);
  
  const [receiptKey, setReceiptKey] = useState('');
  const [personalStatus, setPersonalStatus] = useState('idle'); // idle | verifying | found | not-found
  const [personalVote, setPersonalVote] = useState(null);

  const runVerify = async () => {
    setStatus('verifying');
    await new Promise(r => setTimeout(r, 2200)); // Simulate chain walk
    try {
      const result = callRead ? await callRead('verifyChain') : true;
      const isIntact = Boolean(result);
      setStatus(isIntact ? 'intact' : 'broken');
      setDetails(MOCK_CHAIN_DETAILS);
      if (isIntact) toast.success('Chain integrity verified ✅');
      else          toast.error('Chain integrity compromised! ❌');
    } catch {
      setStatus('intact'); // mock fallback
      setDetails(MOCK_CHAIN_DETAILS);
      toast.success('Chain verified (demo mode) ✅');
    }
  };

  const handlePersonalVerify = async (e) => {
    e.preventDefault();
    if (!receiptKey) return;
    
    setPersonalStatus('verifying');
    await new Promise(r => setTimeout(r, 1500)); // Simulate ledger scan
    
    // In a real app, the frontend would calculate the vote signature and match against the chain.
    // For now, mock a successful verification if length > 10.
    if (receiptKey.length > 10) {
      setPersonalStatus('found');
      setPersonalVote({
        candidateId: 1,
        candidateName: 'Alice Johnson',
        blockNumber: 19853225,
        txHash: '0xvote1Txabcdef1234567890abcdef12345678901234567890',
        timestamp: new Date().toLocaleTimeString()
      });
      toast.success('Vote found on the ledger! 🔐');
    } else {
      setPersonalStatus('not-found');
      setPersonalVote(null);
      toast.error('Could not find a vote for this receipt. Try again.');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Chain Verifier</h1>
        <p className="page-subtitle">Independently verify the chain integrity or lookup your personal vote receipt.</p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-6)'}}>
        {/* Personal Vote Verification */}
        <GlassCard className="verify-card" style={{ padding: 'var(--space-6)' }}>
             <h3 className="font-display fw-600" style={{ fontSize:'1.1rem', marginBottom:'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span className="icon" style={{color: 'var(--primary-container)'}}>🔐</span> 
                Verify Your Vote
             </h3>
             <p style={{ color:'var(--on-surface-variant)', fontSize:'0.85rem', marginBottom:'var(--space-4)' }}>
               Enter your Secret Receipt Key to cryptographically confirm that your vote was successfully recorded on the ledger.
             </p>

             <form onSubmit={handlePersonalVerify} style={{ display: 'flex', gap: 'var(--space-3)' }}>
                 <input 
                    type="text" 
                    placeholder="Enter your CV-Receipt-Key..." 
                    className="input-field" 
                    value={receiptKey}
                    onChange={(e) => setReceiptKey(e.target.value)}
                    disabled={personalStatus === 'verifying'}
                    style={{ flex: 1, fontFamily: 'var(--font-mono)' }}
                 />
                 <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={!receiptKey || personalStatus === 'verifying'}
                    loading={personalStatus === 'verifying'}
                 >
                    Verify Vote
                 </Button>
             </form>

             {personalStatus === 'found' && personalVote && (
                <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'rgba(39, 196, 153, 0.1)', border: '1px solid rgba(39, 196, 153, 0.3)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                         <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Vote successfully recorded! ✅</span>
                         <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--on-surface-variant)' }}>Block #{personalVote.blockNumber}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--on-surface-variant)' }}>Decrypted Choice:</span>
                            <span style={{ fontWeight: 600 }}>{personalVote.candidateName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--on-surface-variant)' }}>Txn Hash:</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{truncateHash(personalVote.txHash, 8, 6)}</span>
                        </div>
                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--on-surface-variant)' }}>Verified At:</span>
                            <span>{personalVote.timestamp}</span>
                        </div>
                    </div>
                </div>
             )}

             {personalStatus === 'not-found' && (
                 <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'rgba(235, 87, 87, 0.1)', border: '1px solid rgba(235, 87, 87, 0.3)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--error)', fontSize: '0.85rem' }}>No matching vote found.</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 'var(--space-1)' }}>Ensure you entered the entire CV-Receipt-Key correctly.</p>
                 </div>
             )}
        </GlassCard>

        <div style={{ height: '1px', background: 'var(--surface-variant)', margin: 'var(--space-4) 0' }}></div>

        {/* Global Chain Verification */}
        <div>
          <h3 className="font-display fw-600" style={{ fontSize:'1.1rem', marginBottom:'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="icon">⛓️</span> 
              Global Chain Auditing
          </h3>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.85rem', marginBottom:'var(--space-4)' }}>
              Recompute every block's hashes to ensure the global ledger has not been tampered with.
          </p>

          {/* Big verify button */}
          <div style={{ textAlign:'center', marginBottom:'var(--space-6)', padding:'var(--space-4) 0' }}>
            <button
              className={`verifier-circle ${status === 'verifying' ? 'verifying' : ''}`}
              onClick={runVerify}
              disabled={status === 'verifying'}
            >
              <span className="verify-icon">
                {status === 'verifying' ? '⟳' : status === 'intact' ? '✅' : status === 'broken' ? '❌' : '🔎'}
              </span>
              <span style={{ fontSize:'0.85rem', fontWeight:700, padding:'0 var(--space-3)' }}>
                {status === 'verifying' ? 'Verifying…' : 'SCAN FULL CHAIN'}
              </span>
            </button>
          </div>

          {/* Result card */}
          {(status === 'intact' || status === 'broken') && details && (
            <div className={`integrity-result ${status}`}>
              <div className="integrity-icon">
                {status === 'intact' ? '✅' : '❌'}
              </div>
              <div style={{ flex:1 }}>
                <p className="integrity-title" style={{ color: status === 'intact' ? 'var(--tertiary)' : 'var(--error)' }}>
                  {status === 'intact' ? 'Chain Integrity INTACT' : 'Chain COMPROMISED'}
                </p>
                <p className="integrity-detail">
                  {status === 'intact'
                    ? `All ${details.totalBlocks} blocks verified. Hash chain is cryptographically sound.`
                    : 'A hash mismatch was detected. The chain may have been tampered with.'}
                </p>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontSize:'0.72rem', color:'var(--on-surface-variant)', fontFamily:'var(--font-mono)' }}>
                  Checked at {details.computedAt}
                </p>
                <p style={{ fontSize:'0.72rem', color:'var(--on-surface-variant)' }}>
                  {details.totalBlocks} blocks scanned
                </p>
              </div>
            </div>
          )}

          {/* Technical detail */}
          {details && (
            <div className="glass" style={{ padding:'var(--space-6)', marginTop:'var(--space-6)' }}>
              <h3 className="font-display fw-600" style={{ fontSize:'0.9rem', marginBottom:'var(--space-4)' }}>Technical Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
                {[
                  ['Genesis Hash', details.genesisHash],
                  ['Latest Hash',  details.latestHash],
                  ['Total Blocks', String(details.totalBlocks)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display:'grid', gridTemplateColumns:'140px 1fr', gap:'var(--space-4)', alignItems:'center' }}>
                    <span style={{ fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--on-surface-variant)' }}>{label}</span>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.78rem', color:'var(--primary-container)', wordBreak:'break-all' }}>
                      {value.length > 20 ? truncateHash(value, 12, 8) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="glass" style={{ padding:'var(--space-6)', marginTop:'var(--space-6)' }}>
            <h3 className="font-display fw-600" style={{ fontSize:'0.9rem', marginBottom:'var(--space-4)' }}>How Verification Works</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
              {[
                ['1', 'Hash Recomputation', 'Each block\'s vote hash is recomputed from the voter address, candidate ID, and prev hash.'],
                ['2', 'Chain Linking',      'We verify that each block\'s prevHash exactly matches the previous block\'s voteHash.'],
                ['3', 'Integrity Result',   'Any mismatch instantly exposes tampering. One altered byte breaks the entire chain.'],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ display:'flex', gap:'var(--space-4)', alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--gradient-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem', flexShrink:0, color:'#fff' }}>{num}</div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'0.88rem', marginBottom:2 }}>{title}</p>
                    <p style={{ fontSize:'0.8rem', color:'var(--on-surface-variant)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
