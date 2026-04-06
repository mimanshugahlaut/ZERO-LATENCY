import { useState, useEffect } from 'react';
import { ELECTION_STATE }  from '../utils/constants';
import { Button }          from '../components/ui/Button';
import { Badge }           from '../components/ui/Badge';
import { pushLog }         from '../hooks/useActivityLog';
import ActivityLog         from '../components/ui/ActivityLog';

function Section({ title, children }) {
  return (
    <div className="glass" style={{ padding:'var(--space-6)', marginBottom:'var(--space-5)' }}>
      <h3 className="font-display fw-700" style={{ fontSize:'1rem', marginBottom:'var(--space-5)' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function AdminPage({ wallet, role, contract, election, callWrite, toast }) {
  const { account, isConnected } = wallet;
  const { state, name, refresh } = election;
  const contractAddress = contract?.contractAddress;

  const [candidateName, setCandidateName] = useState('');
  const [adding, setAdding]               = useState(false);
  const [starting, setStarting]           = useState(false);
  const [ending, setEnding]               = useState(false);

  // Push a system-init log once on mount
  useEffect(() => {
    pushLog('system', 'Admin panel loaded. Contract interaction ready.', { actor: account }, 'admin');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    if (!isConnected) await wallet.connect();
    setAdding(true);
    try {
      const newId = Date.now();
      const tx = await callWrite('addCandidate', newId, candidateName.trim());
      pushLog('admin', `Candidate "${candidateName.trim()}" added to the election.`, {
        actor:  account, txHash: tx?.hash,
        raw:    `addCandidate(${newId}, "${candidateName.trim()}")`,
      }, 'admin');
      toast.success(`Candidate "${candidateName}" added!`);
      setCandidateName('');
      refresh();
    } catch (err) {
      pushLog('error', `Failed to add candidate: ${err?.message?.slice(0,80)}`, {}, 'admin');
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : err?.message || 'Failed to add candidate.');
    } finally { setAdding(false); }
  };

  const handleStart = async () => {
    if (!isConnected) await wallet.connect();
    setStarting(true);
    try {
      const tx = await callWrite('startElection');
      pushLog('system', 'Election officially started. Voting is now ACTIVE.', {
        actor: account, txHash: tx?.hash, raw: 'startElection()',
      }, 'both');
      toast.success('Election started! 🚀');
      refresh();
    } catch (err) {
      pushLog('error', `Failed to start election: ${err?.message?.slice(0,80)}`, {}, 'admin');
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : err?.message || 'Failed to start election.');
    } finally { setStarting(false); }
  };

  const handleEnd = async () => {
    if (!isConnected) await wallet.connect();
    setEnding(true);
    try {
      const tx = await callWrite('endElection');
      pushLog('system', 'Election has been closed. No further votes will be accepted.', {
        actor: account, txHash: tx?.hash, raw: 'endElection()',
      }, 'both');
      toast.success('Election ended. 🏁');
      refresh();
    } catch (err) {
      pushLog('error', `Failed to end election: ${err?.message?.slice(0,80)}`, {}, 'admin');
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : 'Failed to end election.');
    } finally { setEnding(false); }
  };

  // ── Gate 1: connected but not admin ──────────────────────────────────────
  if (isConnected && role && !role.isAdmin) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
        </div>
        <div className="access-denied">
          <div className="access-denied-icon">⛔</div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700 }}>
            Access Denied
          </p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem', maxWidth:380, textAlign:'center', marginBottom:'var(--space-4)' }}>
            Only the contract admin wallet can access this page.<br />
            Connected as: <code style={{ color:'var(--error)', fontSize:'0.8rem' }}>
              {account?.slice(0,10)}…{account?.slice(-6)}
            </code>
          </p>
          <div style={{ padding:'var(--space-3) var(--space-5)', borderRadius:'var(--radius-lg)',
            background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
            fontSize:'0.8rem', color:'var(--error)', fontFamily:'var(--font-mono)' }}>
            ⚠️ This action is restricted to the contract owner.
          </div>
        </div>
      </>
    );
  }

  // ── Gate 2: not connected ─────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
        </div>
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700 }}>Wallet Not Connected</p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem', marginBottom:'var(--space-4)' }}>
            Connect your admin wallet to access admin functions.
          </p>
          <Button variant="primary" onClick={wallet.connect}>Connect Wallet</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <h1 className="page-title">Admin Panel</h1>
          <Badge variant="secondary">⚙️ Admin</Badge>
        </div>
        <p className="page-subtitle">Manage candidates and control the election lifecycle.</p>
      </div>

      <div className="glass" style={{ padding:'var(--space-4) var(--space-6)', marginBottom:'var(--space-5)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'var(--space-3)' }}>
        <div>
          <p style={{ fontSize:'0.78rem', color:'var(--on-surface-variant)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Current State</p>
          <p style={{ fontFamily:'var(--font-display)', fontWeight:700, marginTop:2 }}>{name || 'No election'}</p>
        </div>
        <div style={{ display:'flex', gap:'var(--space-3)', alignItems:'center' }}>
          {state === ELECTION_STATE.NOT_STARTED && <Badge variant="neutral">Not Started</Badge>}
          {state === ELECTION_STATE.STARTED     && <Badge variant="live">🔴 Active</Badge>}
          {state === ELECTION_STATE.ENDED       && <Badge variant="amber">🏁 Ended</Badge>}
        </div>
      </div>

      <Section title="➕ Add Candidate">
        <form className="admin-form" onSubmit={handleAddCandidate}>
          <div className="form-group">
            <label className="form-label">Candidate Full Name</label>
            <input
              className="form-input"
              placeholder="e.g. Alice Johnson"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              disabled={state === ELECTION_STATE.ENDED}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={adding}
            disabled={state === ELECTION_STATE.ENDED || !candidateName.trim()}
            icon="➕"
          >
            Add Candidate
          </Button>
        </form>
      </Section>

      <Section title="▶️ Start Election">
        <div className="admin-form">
          <Button
            variant="success"
            loading={starting}
            onClick={handleStart}
            icon="🚀"
            disabled={state !== ELECTION_STATE.NOT_STARTED}
          >
            Start Election
          </Button>
        </div>
      </Section>

      <Section title="🏁 End Election">
        <p style={{ fontSize:'0.85rem', color:'var(--on-surface-variant)', marginBottom:'var(--space-4)' }}>
          Ending the election locks the chain permanently.
        </p>
        <Button
          variant="danger"
          loading={ending}
          onClick={handleEnd}
          icon="🏁"
          disabled={state !== ELECTION_STATE.STARTED}
        >
          End Election
        </Button>
      </Section>

      <div style={{ background:'var(--surface-container)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-lg)', padding:'var(--space-5)', fontSize:'0.8rem', color:'var(--on-surface-variant)', marginBottom:'var(--space-6)' }}>
        <p style={{ fontFamily:'var(--font-mono)', marginBottom:4 }}>
          ⚙️ Contract: <span style={{ color:'var(--primary)' }}>{contractAddress || 'Not synced'}</span>
        </p>
        <p style={{ fontFamily:'var(--font-mono)' }}>
          👤 Admin: <span style={{ color:'var(--tertiary)' }}>{account ? `${account.slice(0,10)}...${account.slice(-8)}` : '—'}</span>
        </p>
      </div>

      {/* Admin activity log — shows full detail including addresses and gas */}
      <ActivityLog isAdmin={true} maxHeight="420px" />
    </>
  );
}
