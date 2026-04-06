import { useState, useEffect } from 'react';
import { ELECTION_STATE } from '../utils/constants';
import { candidateGradient, getInitials, calcPercent, copyToClipboard } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Modal }  from '../components/ui/Modal';
import { Badge }  from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { EmptyState }   from '../components/ui/EmptyState';

function Countdown({ targetMs }) {
  const [diff, setDiff] = useState(targetMs - Date.now());
  useEffect(() => {
    const id = setInterval(() => setDiff(targetMs - Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const total = Math.max(0, diff);
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor((total % 3_600_000) / 60_000);
  const s = Math.floor((total % 60_000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="countdown">
      {[['HRS', pad(h)], ['MIN', pad(m)], ['SEC', pad(s)]].map(([label, val], i) => (
        <div key={label} style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
          {i > 0 && <span className="countdown-sep">:</span>}
          <div className="countdown-block">
            <span className="countdown-value">{val}</span>
            <span className="countdown-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VotePage({ auth, election, candidates, callWrite, toast }) {
  const { user, isAuthenticated, setIsAuthModalOpen } = auth || {};
  const { state, name, totalVotes, loading: elLoading } = election;
  const { candidates: list, loading: cLoading } = candidates;

  const [hasVoted, setHasVoted]           = useState(false);
  const [receiptKey, setReceiptKey]       = useState(null);
  const [confirming, setConfirming]       = useState(null);
  const [voting, setVoting]               = useState(false);
  const [targetTime]                      = useState(Date.now() + 3_600_000 * 4); // 4h from now (mock)

  const handleVote = async () => {
    if (!confirming) return;
    setVoting(true);
    try {
      // Simulate real contract / backend call
      await new Promise(r => setTimeout(r, 1200));
      
      // Generate a secret receipt key
      const generatedKey = `rcpt_${Math.random().toString(36).substr(2, 9)}_${confirming.id}`;

      setHasVoted(true);
      setReceiptKey(generatedKey);
      setConfirming(null);
      toast.success(`Vote cast securely! ✅`);
    } catch (err) {
      toast.error('Vote failed. Try again.');
    } finally {
      setVoting(false);
    }
  };

  const handleCopyReceipt = () => {
    copyToClipboard(receiptKey);
    toast.success('Receipt key copied!');
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">{name || 'Active Election'}</h1>
          <p className="page-subtitle">Log in to participate securely in this election.</p>
        </div>
        <div className="wallet-prompt">
          <div className="wallet-prompt-icon">🛡️</div>
          <p className="wallet-prompt-title">Login to Vote</p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem', maxWidth:380, textAlign:'center' }}>
            ChainVote uses a <strong>Secret Ballot</strong> system. You will receive a unique cryptographic receipt to verify your vote later, but no one else can see who you voted for.
          </p>
          <Button variant="primary" size="lg" onClick={() => setIsAuthModalOpen(true)} icon="🛡️">Login securely</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--space-4)' }}>
          <div>
            <h1 className="page-title">{name || 'Active Election'}</h1>
            <p className="page-subtitle">{totalVotes} votes cast • Ends in</p>
          </div>
          <Countdown targetMs={targetTime} />
        </div>
      </div>

      {/* Already voted banner with Receipt Key */}
      {hasVoted && receiptKey && (
        <div className="success-banner" style={{ marginBottom:'var(--space-6)', flexDirection:'column', alignItems:'flex-start', gap: '1rem' }}>
          <div className="flex items-center gap-4 w-full">
            <div className="success-banner-icon">🔐</div>
            <div>
              <p className="success-banner-title">Secret Vote Successfully Cast!</p>
              <p className="success-banner-desc">
                Your vote was recorded anonymously. Save your Secret Receipt below.
              </p>
            </div>
          </div>
          <div className="w-full bg-black/40 border border-green-500/20 rounded-xl p-4 mt-2">
            <p className="text-sm font-medium text-white/50 mb-2">YOUR SECRET RECEIPT (DO NOT SHARE)</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black/50 px-4 py-3 rounded-lg text-green-400 font-mono tracking-widest overflow-hidden text-ellipsis">
                {receiptKey}
              </code>
              <Button variant="secondary" onClick={handleCopyReceipt}>Copy</Button>
            </div>
            <p className="text-xs text-white/40 mt-3">
              Use this code on the Verify page to confirm your vote was counted correctly without revealing your identity.
            </p>
          </div>
        </div>
      )}

      {/* State guards */}
      {state === ELECTION_STATE.NOT_STARTED && (
        <div className="wallet-prompt">
          <div className="wallet-prompt-icon">⏳</div>
          <p className="wallet-prompt-title">Election Not Started Yet</p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem' }}>The admin hasn't started the election.</p>
        </div>
      )}

      {state === ELECTION_STATE.ENDED && (
        <div className="wallet-prompt" style={{ borderColor:'rgba(245,158,11,0.3)' }}>
          <div className="wallet-prompt-icon">🏁</div>
          <p className="wallet-prompt-title" style={{ background:'linear-gradient(135deg,#f59e0b,#ef4444)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Election Has Ended</p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem' }}>Check the Results page for the final tally.</p>
        </div>
      )}

      {/* Candidates grid */}
      {(state === ELECTION_STATE.STARTED || state === null) && (
        <div className="candidates-grid">
          {cLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : list.length === 0
              ? <EmptyState icon="👤" title="No candidates yet" description="The admin hasn't added any candidates." />
              : list.map((c, i) => (
                  <div
                    key={c.id}
                    className="candidate-card"
                  >
                    {/* Rank badge */}
                    {i === 0 && <Badge variant="amber" className="" style={{ position:'absolute', top:'var(--space-3)', right:'var(--space-3)' }}>👑 Leading</Badge>}

                    {/* Avatar */}
                    <div className="candidate-avatar" style={{ background: candidateGradient(i) }}>
                      {getInitials(c.name)}
                    </div>

                    {/* Info */}
                    <div>
                      <p className="candidate-name">{c.name}</p>
                      {c.party && <p className="candidate-party">{c.party}</p>}
                    </div>

                    {/* Votes shown secretly now or kept public depending on tally rules. We'll keep tallied public. */}
                    <div className="candidate-votes">
                      🗳 {c.voteCount} {c.voteCount === 1 ? 'vote' : 'votes'}
                    </div>

                    {/* Vote button / voted indicator */}
                    {hasVoted ? (
                       <Button variant="secondary" className="w-full" disabled>Election Cast</Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => setConfirming(c)}
                        style={i===0 ? { boxShadow:'0 0 24px rgba(61,130,246,0.5)' } : {}}
                      >
                        Vote for {c.name.split(' ')[0]}
                      </Button>
                    )}
                  </div>
                ))}
        </div>
      )}

      {/* Confirm modal */}
      {confirming && (
        <Modal
          title="Confirm Your Secret Vote"
          onClose={() => setConfirming(null)}
          footer={[
            <Button key="cancel" variant="secondary" onClick={() => setConfirming(null)}>Cancel</Button>,
            <Button key="confirm" variant="primary" loading={voting} onClick={handleVote}>Cast Private Vote</Button>
          ]}
        >
          <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            <div style={{ textAlign:'center', padding:'var(--space-4)' }}>
              <div className="candidate-avatar" style={{ background: candidateGradient(confirming.id), width:72, height:72, fontSize:'1.5rem', margin:'0 auto var(--space-3)' }}>
                {getInitials(confirming.name)}
              </div>
              <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700 }}>{confirming.name}</p>
              {confirming.party && <p style={{ color:'var(--on-surface-variant)', fontSize:'0.85rem' }}>{confirming.party}</p>}
            </div>
            <div className="glass" style={{ padding:'var(--space-4)' }}>
              <p style={{ fontSize:'0.83rem', color:'var(--on-surface-variant)', lineHeight:1.6 }}>
                ⚠️ Your vote will be recorded securely and <strong>anonymously</strong>. Other users will not be able to see who you voted for. You will receive a Secret Receipt to verify your vote later.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
