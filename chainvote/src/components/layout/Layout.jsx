import { TopBar }    from './TopBar';
import { Sidebar }   from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout({ children, wallet, auth, electionState, electionName, activePage, onNavigate }) {
  return (
    <>
      {/* Decorative ambient background */}
      <div className="bg-mesh" />

      {/* Top bar */}
      <TopBar wallet={wallet} auth={auth} electionState={electionState} electionName={electionName} />

      <div className="app-shell">
        {/* Desktop sidebar */}
        <Sidebar activePage={activePage} onNavigate={onNavigate} />

        {/* Page content */}
        <main className="main-content" style={{ position:'relative', zIndex:1 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activePage={activePage} onNavigate={onNavigate} />
    </>
  );
}
