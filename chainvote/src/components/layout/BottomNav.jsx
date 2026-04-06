import { NAV_ITEMS } from '../../utils/constants';

export function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item ${activePage === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
        >
          <span className="bnav-icon">{item.emoji}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
