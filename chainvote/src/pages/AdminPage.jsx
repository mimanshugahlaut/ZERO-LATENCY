import { useState } from 'react';
import { ELECTION_STATE } from '../utils/constants';
import { Button } from '../components/ui/Button';
import { Badge }  from '../components/ui/Badge';

function Section({ title, children }) {
  return (
    <div className="glass" style={{ padding:'var(--space-6)', marginBottom:'var(--space-5)' }}>
      <h3 className="font-display fw-700" style={{ fontSize:'1rem', marginBottom:'var(--space-5)' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function AdminPage({ wallet, election, callWrite, toast }) {
  const { account, isConnected } = wallet;
  const { state, name, refresh } = election;

  const [candidateName, setCandidateName] = useState('');
  const [electionName, setElectionName]   = useState('');
  const [adding, setAdding]               = useState(false);
  const [starting, setStarting]           = useState(false);
  const [ending, setEnding]               = useState(false);

  // Simple admin check — in production, compare with contract.owner()
  const isAdmin = isConnected; // let any connected wallet use it for demo

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    setAdding(true);
    try {
      await callWrite('addCandidate', candidateName.trim());
      toast.success(`Candidate "${candidateName}" added!`);
      setCandidateName('');
      refresh();
    } catch (err) {
      toast.error(err?.message?.includes('user rejected') ? 'Rejected.' : 'Failed to add candidate.');
    } finally { setAdding(false); }
  };

  const handleStart = async () => {
    if (!electionName.trim()) { toast.error('Enter an election name.'); return; }
    setStarting(true);
    try {
      await callWrite('startElection', electionName.trim());
      toast.success('Election started! 🚀');
      refresh();
    } catch (err) {
      toast.error(err?.message?.includes('user rejected') ? 'Rejected.' : 'Failed to start election.');
    } finally { setStarting(false); }
  };

  const handleEnd = async () => {
    setEnding(true);
    try {
      await callWrite('endElection');
      toast.success('Election ended. 🏁');
      refresh();
    } catch (err) {
      toast.error(err?.message?.includes('user rejected') ? 'Rejected.' : 'Failed to end election.');
    } finally { setEnding(false); }
  };

  if (!isConnected) {
    return (
      <>
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
        </div>
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>
          <p style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', fontWeight:700 }}>Wallet Not Connected</p>
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem' }}>
            Connect your wallet to access admin functions.
          </p>
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

      {/* Election status strip */}
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

      {/* Add Candidate */}
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
          {state === ELECTION_STATE.ENDED && (
            <p style={{ fontSize:'0.8rem', color:'var(--error)' }}>Election has ended. Cannot add candidates.</p>
          )}
        </form>
      </Section>

      {/* Start Election */}
      <Section title="▶️ Start Election">
        <div className="admin-form">
          <div className="form-group">
            <label className="form-label">Election Name</label>
            <input
              className="form-input"
              placeholder="e.g. Board Election 2025"
              value={electionName}
              onChange={e => setElectionName(e.target.value)}
              disabled={state !== ELECTION_STATE.NOT_STARTED}
            />
          </div>
          <Button
            variant="success"
            loading={starting}
            onClick={handleStart}
            icon="🚀"
            disabled={state !== ELECTION_STATE.NOT_STARTED || !electionName.trim()}
          >
            Start Election
          </Button>
          {state === ELECTION_STATE.STARTED && (
            <p style={{ fontSize:'0.8rem', color:'var(--tertiary)' }}>✅ Election is currently active.</p>
          )}
          {state === ELECTION_STATE.ENDED && (
            <p style={{ fontSize:'0.8rem', color:'var(--amber)' }}>🏁 Election already ended. Deploy a new contract for another round.</p>
          )}
        </div>
      </Section>

      {/* End Election */}
      <Section title="🏁 End Election">
        <p style={{ fontSize:'0.85rem', color:'var(--on-surface-variant)', marginBottom:'var(--space-4)' }}>
          Ending the election locks the chain permanently. No more votes can be cast.
          This action is <strong style={{color:'var(--error)'}}>irreversible</strong>.
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
        {state !== ELECTION_STATE.STARTED && (
          <p style={{ fontSize:'0.8rem', color:'var(--on-surface-variant)', marginTop:'var(--space-2)' }}>
            {state === ELECTION_STATE.NOT_STARTED ? 'Start the election first.' : 'Election already ended.'}
          </p>
        )}
      </Section>

      {/* Contract info */}
      <div style={{ background:'var(--surface-container)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-lg)', padding:'var(--space-5)', fontSize:'0.8rem', color:'var(--on-surface-variant)' }}>
        <p style={{ fontFamily:'var(--font-mono)', marginBottom:4 }}>
          ⚙️ Contract: <span style={{ color:'var(--primary)' }}>{import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000...0000'}</span>
        </p>
        <p style={{ fontFamily:'var(--font-mono)' }}>
          👤 Admin: <span style={{ color:'var(--tertiary)' }}>{account ? `${account.slice(0,10)}...${account.slice(-8)}` : '—'}</span>
        </p>
      </div>
    </>
  );
}
