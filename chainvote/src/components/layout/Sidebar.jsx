import { NAV_ITEMS } from '../../utils/constants';

export function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
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

      {/* Footer hint */}
      <div style={{ marginTop:'auto', padding:'var(--space-4)', borderTop:'1px solid var(--glass-border)', fontSize:'0.72rem', color:'var(--outline)', lineHeight:1.5 }}>
        <p style={{ fontFamily:'var(--font-mono)' }}>ChainVote v1.0</p>
        <p style={{ marginTop:4 }}>Tamper-proof voting on Ethereum</p>
      </div>
    </aside>
  );
}
