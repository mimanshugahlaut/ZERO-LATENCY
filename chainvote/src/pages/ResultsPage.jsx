import { candidateGradient, calcPercent, formatNumber, timeAgo } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { truncateAddress } from '../utils/formatters';

function StatCard({ label, value, meta, accent }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value" style={accent ? { background:accent, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } : {}}>
        {value}
      </p>
      {meta && <p className="stat-meta">{meta}</p>}
    </div>
  );
}

function BarChart({ candidates, totalVotes }) {
  if (!candidates?.length) return null;
  const sorted = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  return (
    <div className="chart-grid">
      {sorted.map((c, i) => {
        const pct = calcPercent(c.voteCount, totalVotes);
        return (
          <div className="chart-row" key={c.id}>
            <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
              <span style={{width:8,height:8,borderRadius:'50%',background:c.dotColor||'#3b82f6',flexShrink:0}} />
              <span className="chart-name truncate">{c.name.split(' ')[0]}</span>
            </div>
            <div className="chart-bar-track">
              <div
                className="chart-bar-fill"
                style={{ width:`${pct}%`, background: i===0 ? 'var(--gradient-primary)' : i===1 ? 'linear-gradient(90deg,#8b5cf6,#d0bcff)' : 'linear-gradient(90deg,#10b981,#4edea3)' }}
              />
            </div>
            <span className="chart-pct">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function LiveFeed({ events }) {
  if (!events?.length) return <p style={{color:'var(--on-surface-variant)',fontSize:'0.85rem',padding:'var(--space-4)'}}>No events yet…</p>;
  return (
    <div className="live-feed">
      {events.slice(0, 8).map(ev => (
        <div key={ev.id} className={`feed-item ${ev.isNew ? 'new' : ''}`}>
          <span style={{width:8,height:8,borderRadius:'50%',background:ev.dotColor||'#3b82f6',flexShrink:0}} />
          <span style={{fontFamily:'var(--font-mono)',fontSize:'0.75rem',color:'var(--on-surface-variant)'}}>
            {truncateAddress(ev.voter)}
          </span>
          <span style={{fontSize:'0.82rem'}}>voted for <strong>{ev.candidateName}</strong></span>
          <span className="feed-meta" style={{fontFamily:'var(--font-mono)',fontSize:'0.72rem'}}>
            {timeAgo(ev.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage({ election, candidates, events }) {
  const { totalVotes, turnout, name, loading: elLoading } = election;
  const { candidates: list, loading: cLoading } = candidates;

  const leader = list.length > 0
    ? [...list].sort((a,b) => b.voteCount - a.voteCount)[0]
    : null;

  return (
    <>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)' }}>
          <h1 className="page-title">Live Results</h1>
          <span className="badge badge-live">LIVE</span>
        </div>
        <p className="page-subtitle">{name} — Real-time vote tally, updated from the blockchain.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          label="Total Votes"
          value={elLoading ? '…' : formatNumber(totalVotes)}
          meta="cumulative cast"
          accent="var(--gradient-primary)"
        />
        <StatCard
          label="Voter Turnout"
          value={elLoading ? '…' : `${turnout}%`}
          meta="of eligible voters"
          accent="linear-gradient(135deg,#10b981,#3b82f6)"
        />
        <StatCard
          label="Current Leader"
          value={cLoading || !leader ? '…' : leader.name.split(' ')[0]}
          meta={leader ? `${leader.voteCount} votes` : ''}
          accent="linear-gradient(135deg,#f59e0b,#ef4444)"
        />
      </div>

      {/* 2-col layout */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-6)' }}>
        {/* Bar chart */}
        <div className="glass" style={{ padding:'var(--space-6)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-5)' }}>
            <h2 className="font-display fw-700" style={{ fontSize:'1rem' }}>Vote Distribution</h2>
            <span className="badge badge-primary">{totalVotes} total</span>
          </div>
          {cLoading
            ? Array.from({length:4}).map((_,i)=><Skeleton key={i} height="14px" style={{marginBottom:'var(--space-4)'}} />)
            : <BarChart candidates={list} totalVotes={totalVotes} />
          }
        </div>

        {/* Live feed */}
        <div className="glass" style={{ padding:'var(--space-6)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'var(--space-5)' }}>
            <h2 className="font-display fw-700" style={{ fontSize:'1rem' }}>Live Activity</h2>
            <span className="badge badge-live">LIVE</span>
          </div>
          <LiveFeed events={events?.events} />
        </div>
      </div>

      {/* Candidate detail cards */}
      <div style={{ marginTop:'var(--space-6)' }}>
        <h2 className="font-display fw-700" style={{ fontSize:'1rem', marginBottom:'var(--space-4)' }}>Candidate Breakdown</h2>
        <div className="candidates-grid">
          {cLoading ? Array.from({length:4}).map((_,i)=><Skeleton key={i} height="100px" />) : list.map((c,i) => {
            const pct = calcPercent(c.voteCount, totalVotes);
            const isLeader = i === 0 || (leader && c.id === leader.id && c.voteCount === leader.voteCount);
            return (
              <div key={c.id} className="glass" style={{ padding:'var(--space-5)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', marginBottom:'var(--space-3)' }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:candidateGradient(i), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', fontSize:'0.9rem', fontFamily:'var(--font-display)' }}>
                    {c.name.split(' ').map(w=>w[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'0.9rem' }}>{c.name}</p>
                    {c.party && <p style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)' }}>{c.party}</p>}
                  </div>
                  {isLeader && <span className="badge badge-amber" style={{ marginLeft:'auto' }}>👑</span>}
                </div>
                <div className="chart-bar-track" style={{ marginBottom:'var(--space-2)' }}>
                  <div className="chart-bar-fill" style={{ width:`${pct}%`, background:candidateGradient(i) }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem' }}>
                  <span style={{ fontFamily:'var(--font-mono)', color:'var(--primary)' }}>{c.voteCount} votes</span>
                  <span style={{ fontFamily:'var(--font-mono)', color:'var(--on-surface-variant)' }}>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
