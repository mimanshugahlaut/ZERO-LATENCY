import { STATE_LABELS, STATE_BADGE_CLASS, ELECTION_STATE } from '../../utils/constants';
import { Button } from '../ui/Button';

const BACKEND_COLOR = {
  online:   'var(--tertiary)',
  offline:  'var(--error)',
  checking: '#f59e0b',
};
const BACKEND_LABEL = {
  online:   'API Online',
  offline:  'API Offline',
  checking: 'Connecting…',
};

const ROLE_BADGE_STYLE = {
  admin: { bg: 'rgba(139,92,246,0.18)', color: '#c4b5fd', border: 'rgba(139,92,246,0.4)' },
  voter: { bg: 'rgba(6,182,212,0.12)',  color: '#67e8f9', border: 'rgba(6,182,212,0.35)' },
  guest: { bg: 'transparent',           color: 'var(--outline)', border: 'transparent'   },
};

function shortAddr(addr) {
  if (!addr) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TopBar({
  auth, role,
  electionState, electionName,
  backendStatus = 'checking', backendUrl, onRetryBackend,
}) {
  const { user, isAuthenticated, isLoading, setIsAuthModalOpen, logout } = auth || {};

  const stateClass = STATE_BADGE_CLASS[electionState] ?? 'badge-neutral';
  const stateLabel = STATE_LABELS[electionState] ?? '—';
  const dotColor   = BACKEND_COLOR[backendStatus] ?? BACKEND_COLOR.checking;
  const roleStyle  = ROLE_BADGE_STYLE[role?.role ?? 'guest'];

  return (
    <header className="topbar">
      {/* Logo */}
      <div className="topbar-logo">
        <div className="logo-icon">⛓</div>
        <span className="text-gradient">ChainVote</span>
      </div>

      {/* Centre: election state + backend status */}
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', flexWrap:'wrap' }}>
        {electionName && (
          <span style={{ fontSize:'0.82rem', color:'var(--on-surface-variant)' }}
            className="desktop-visible">{electionName}</span>
        )}
        {electionState !== null && (
          <span className={`badge ${stateClass}`}>
            {electionState === ELECTION_STATE.STARTED && (
              <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%',
                background:'var(--tertiary)', boxShadow:'0 0 6px var(--tertiary)',
                animation:'pulse-dot 1.5s infinite' }} />
            )}
            {stateLabel}
          </span>
        )}

        {/* Backend connectivity pill */}
        <button
          onClick={backendStatus === 'offline' ? onRetryBackend : undefined}
          title={`Backend: ${backendUrl || ''} — click to retry`}
          style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'3px 10px', borderRadius:999,
            border:`1px solid ${dotColor}44`, background:`${dotColor}10`,
            cursor: backendStatus === 'offline' ? 'pointer' : 'default',
            fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.05em',
            color:dotColor, transition:'all 0.2s',
          }}
        >
          <span style={{
            width:6, height:6, borderRadius:'50%', background:dotColor,
            boxShadow:`0 0 6px ${dotColor}`, display:'inline-block',
            animation: backendStatus === 'checking' ? 'pulse-dot 1s infinite' : 'none',
          }} />
          {BACKEND_LABEL[backendStatus]}
        </button>
      </div>

      {/* Right: role badge + wallet */}
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-2)' }}>
        {/* Role badge — only when connected */}
        {isAuthenticated && role && !role.isGuest && (
          <span style={{
            padding:'3px 10px', borderRadius:999,
            background: roleStyle.bg, border:`1px solid ${roleStyle.border}`,
            color: roleStyle.color, fontSize:'0.7rem', fontWeight:700,
            letterSpacing:'0.05em',
          }}>
            {role.isAdmin ? '⚙️ Admin' : '🗳️ Voter'}
          </span>
        )}

        {/* Wallet pill / login button */}
        {isAuthenticated ? (
          <div
            className="wallet-pill group relative cursor-pointer"
            onClick={logout}
            title={`${user?.identifier}\nClick to log out`}
          >
            <div style={{ width:8, height:8, borderRadius:'50%',
              background: role?.isAdmin ? '#a78bfa' : '#34d399', flexShrink:0 }} />
            <span style={{ fontSize:'0.82rem', fontFamily:'var(--font-mono)' }}>
              {shortAddr(user?.identifier)}
            </span>
            <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs text-white/50">
              Click to Log Out
            </div>
          </div>
        ) : (
          <Button variant="primary" size="sm" loading={isLoading} onClick={() => setIsAuthModalOpen(true)} icon="🛡️">
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
