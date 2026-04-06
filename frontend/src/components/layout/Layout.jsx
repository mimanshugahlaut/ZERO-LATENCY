import { TopBar }    from './TopBar';
import { Sidebar }   from './Sidebar';
import { BottomNav } from './BottomNav';

export function Layout({
  children, wallet, auth, role,
  electionState, electionName,
  activePage, onNavigate,
  backendStatus, backendUrl, onRetryBackend,
}) {
  return (
    <>
      {/* Decorative ambient background */}
      <div className="bg-mesh" />

      {/* Top bar */}
      <TopBar
        wallet={wallet}
        auth={auth}
        role={role}
        electionState={electionState}
        electionName={electionName}
        backendStatus={backendStatus}
        backendUrl={backendUrl}
        onRetryBackend={onRetryBackend}
      />

      <div className="app-shell">
        {/* Desktop sidebar */}
        <Sidebar activePage={activePage} onNavigate={onNavigate} role={role} />

        {/* Page content */}
        <main className="main-content" style={{ position:'relative', zIndex:1 }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activePage={activePage} onNavigate={onNavigate} role={role} />
    </>
  );
}
