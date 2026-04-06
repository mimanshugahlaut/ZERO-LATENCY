import { NAV_ITEMS, ADMIN_NAV_ITEMS, VOTER_NAV_ITEMS } from '../../utils/constants';

export function BottomNav({ activePage, onNavigate, role }) {
  const allowedIds = role?.isAdmin ? ADMIN_NAV_ITEMS : VOTER_NAV_ITEMS;
  const visibleNav = NAV_ITEMS.filter(item => allowedIds.includes(item.id));

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      {visibleNav.map(item => (
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
