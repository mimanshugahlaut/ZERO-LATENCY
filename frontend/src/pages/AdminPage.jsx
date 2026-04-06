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

export default function AdminPage({ wallet, contract, election, callWrite, toast }) {
  const { account, isConnected } = wallet;
  const { state, name, refresh } = election;
  const contractAddress = contract?.contractAddress;

  const [candidateName, setCandidateName] = useState('');
  const [adding, setAdding]               = useState(false);
  const [starting, setStarting]           = useState(false);
  const [ending, setEnding]               = useState(false);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    
    // 7. Ensure UI flow: Button click -> connect wallet -> call contract
    if (!isConnected) {
      await wallet.connect(); 
    }
    
    setAdding(true);
    try {
      const newId = Date.now();
      // 4. Fix write calls: addCandidate(uint256 id, string name)
      await callWrite('addCandidate', newId, candidateName.trim());
      
      toast.success(`Candidate "${candidateName}" added!`);
      setCandidateName('');
      refresh();
    } catch (err) {
      console.error("handleAddCandidate Error:", err);
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : err?.message || 'Failed to add candidate.');
    } finally { setAdding(false); }
  };

  const handleStart = async () => {
    if (!isConnected) {
      await wallet.connect(); 
    }
    setStarting(true);
    try {
      // 4. Fix write calls: startElection() -> no args
      await callWrite('startElection');
      
      toast.success('Election started! 🚀');
      refresh();
    } catch (err) {
      console.error("handleStart Error:", err);
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : err?.message || 'Failed to start election.');
    } finally { setStarting(false); }
  };

  const handleEnd = async () => {
    if (!isConnected) {
      await wallet.connect(); 
    }
    setEnding(true);
    try {
      await callWrite('endElection');
      toast.success('Election ended. 🏁');
      refresh();
    } catch (err) {
      console.error("handleEnd Error:", err);
      toast.error(err?.message?.includes('user rejected') ? 'Rejected by user.' : 'Failed to end election.');
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
          <p style={{ color:'var(--on-surface-variant)', fontSize:'0.88rem', marginBottom: 'var(--space-4)' }}>
            Connect your wallet to access admin functions.
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

      <div style={{ background:'var(--surface-container)', border:'1px solid var(--glass-border)', borderRadius:'var(--radius-lg)', padding:'var(--space-5)', fontSize:'0.8rem', color:'var(--on-surface-variant)' }}>
        <p style={{ fontFamily:'var(--font-mono)', marginBottom:4 }}>
          ⚙️ Contract: <span style={{ color:'var(--primary)' }}>{contractAddress || 'Not synced'}</span>
        </p>
        <p style={{ fontFamily:'var(--font-mono)' }}>
          👤 Admin: <span style={{ color:'var(--tertiary)' }}>{account ? `${account.slice(0,10)}...${account.slice(-8)}` : '—'}</span>
        </p>
      </div>
    </>
  );
}
