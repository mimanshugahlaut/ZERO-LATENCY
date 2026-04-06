import { STATE_LABELS, STATE_BADGE_CLASS, ELECTION_STATE } from '../../utils/constants';
import { Button } from '../ui/Button';

export function TopBar({ auth, electionState, electionName }) {
  const { user, isAuthenticated, isLoading, setIsAuthModalOpen, logout } = auth || {};

  const stateClass = STATE_BADGE_CLASS[electionState] ?? 'badge-neutral';
  const stateLabel = STATE_LABELS[electionState] ?? '—';

  return (
    <header className="topbar">
      {/* Logo */}
      <div className="topbar-logo">
        <div className="logo-icon">⛓</div>
        <span className="text-gradient">ChainVote</span>
      </div>

      {/* Center — election name + state */}
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {electionName && (
          <span style={{ fontSize: '0.82rem', color: 'var(--on-surface-variant)', display: 'none' }}
            className="desktop-visible">{electionName}</span>
        )}
        {electionState !== null && (
          <span className={`badge ${stateClass}`}>
            {electionState === ELECTION_STATE.STARTED && (
              <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--tertiary)', boxShadow:'0 0 6px var(--tertiary)', animation:'pulse-dot 1.5s infinite' }} />
            )}
            {stateLabel}
          </span>
        )}
      </div>

      {/* Auth UI */}
      {isAuthenticated ? (
        <div className="wallet-pill group relative cursor-pointer" onClick={logout} title="Click to logout">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span style={{ fontSize: '0.82rem' }} className="ml-2 font-medium truncate max-w-[120px] md:max-w-[200px]">
            {user?.identifier}
          </span>
          <div className="absolute top-full right-0 mt-2 bg-black/80 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs text-white/50">
            Click to Log Out
          </div>
        </div>
      ) : (
        <Button variant="primary" size="sm" loading={isLoading} onClick={() => setIsAuthModalOpen(true)} icon="🛡️">
          Login securely
        </Button>
      )}
    </header>
  );
}
