import { NAV_ITEMS, ADMIN_NAV_ITEMS, VOTER_NAV_ITEMS } from '../../utils/constants';

const ROLE_BADGE = {
  admin: { label: '⚙️ Admin',  bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
  voter: { label: '🗳️ Voter',  bg: 'rgba(6,182,212,0.12)',  color: '#67e8f9', border: 'rgba(6,182,212,0.3)'   },
  guest: { label: '👤 Guest',  bg: 'rgba(255,255,255,0.05)', color: 'var(--outline)', border: 'var(--glass-border)' },
};

export function Sidebar({ activePage, onNavigate, role }) {
  const allowedIds = role?.isAdmin ? ADMIN_NAV_ITEMS : VOTER_NAV_ITEMS;
  const visibleNav = NAV_ITEMS.filter(item => allowedIds.includes(item.id));
  const badge      = ROLE_BADGE[role?.role ?? 'guest'];

  return (
    <aside className="sidebar">
      {/* Role badge */}
      {role && !role.isGuest && (
        <div style={{
          margin:       'var(--space-3) var(--space-4)',
          padding:      '6px 12px',
          borderRadius: 'var(--radius-full)',
          background:   badge.bg,
          border:       `1px solid ${badge.border}`,
          color:        badge.color,
          fontSize:     '0.72rem',
          fontWeight:   700,
          letterSpacing:'0.06em',
          textAlign:    'center',
        }}>
          {badge.label}
        </div>
      )}

      <nav className="sidebar-nav">
        {visibleNav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'vote' && activePage !== 'vote' && (
              <span className="badge badge-live" style={{ marginLeft: 'auto', fontSize: '0.6rem' }}>Live</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ marginTop:'auto', padding:'var(--space-4)', borderTop:'1px solid var(--glass-border)', fontSize:'0.72rem', color:'var(--outline)', lineHeight:1.5 }}>
        <p style={{ fontFamily:'var(--font-mono)' }}>ChainVote v1.0</p>
        <p style={{ marginTop:4 }}>Tamper-proof voting on Ethereum</p>
      </div>
    </aside>
  );
}
