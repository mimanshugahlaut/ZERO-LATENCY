import { useState, useEffect } from 'react';
import { Layout }      from './components/layout/Layout';
import { ToastRenderer, useToast } from './components/ui/Toast';
import { useWallet }    from './hooks/useWallet';
import { useContract }  from './hooks/useContract';
import { useElection }  from './hooks/useElection';
import { useCandidates } from './hooks/useCandidates';
import { useEvents }    from './hooks/useEvents';
import { useBackendStatus } from './hooks/useBackendStatus';
import { useRole }      from './hooks/useRole';
import { ADMIN_NAV_ITEMS, VOTER_NAV_ITEMS } from './utils/constants';

import VotePage    from './pages/VotePage';
import LedgerPage  from './pages/LedgerPage';
import ResultsPage from './pages/ResultsPage';
import AuditPage   from './pages/AuditPage';
import VerifyPage  from './pages/VerifyPage';
import AdminPage   from './pages/AdminPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [page, setPage] = useState('vote');

  const wallet = useWallet();
  const role   = useRole(wallet);

  const auth = {
    user:               wallet.account ? { id: wallet.account, identifier: wallet.account } : null,
    isAuthenticated:    wallet.isConnected,
    isLoading:          wallet.isConnecting,
    setIsAuthModalOpen: wallet.connect,
    logout:             wallet.disconnect,
  };

  const contract   = useContract();
  const { callRead, callWrite, readContract } = contract;
  const election   = useElection(callRead);
  const candidates = useCandidates(callRead);
  const events     = useEvents(readContract, candidates.candidates);
  const toast      = useToast();
  const backend    = useBackendStatus();

  // ── Page access guard ────────────────────────────────────────────────────
  // When role changes, redirect to the role's default landing page if the
  // current page isn't allowed for that role.
  useEffect(() => {
    if (showLanding) return;
    const allowed = role.isAdmin ? ADMIN_NAV_ITEMS : VOTER_NAV_ITEMS;
    if (!allowed.includes(page)) {
      setPage(role.isAdmin ? 'admin' : 'vote');
    }
  }, [role.isAdmin, page, showLanding]);

  const navigateTo = (id) => {
    const allowed = role.isAdmin ? ADMIN_NAV_ITEMS : VOTER_NAV_ITEMS;
    if (allowed.includes(id)) setPage(id);
  };

  const renderPage = () => {
    const commonProps = { wallet, auth, role, contract, election, callRead, callWrite, toast };
    switch (page) {
      case 'vote':    return <VotePage    {...commonProps} candidates={candidates} />;
      case 'ledger':  return <LedgerPage  {...commonProps} candidates={candidates} />;
      case 'results': return <ResultsPage {...commonProps} candidates={candidates} events={events} />;
      case 'audit':   return <AuditPage   {...commonProps} />;
      case 'verify':  return <VerifyPage  {...commonProps} />;
      case 'admin':   return <AdminPage   {...commonProps} />;
      default:        return <VotePage    {...commonProps} candidates={candidates} />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return (
    <>
      <Layout
        wallet={wallet}
        auth={auth}
        role={role}
        electionState={election.state}
        electionName={election.name}
        activePage={page}
        onNavigate={navigateTo}
        backendStatus={backend.status}
        backendUrl={backend.url}
        onRetryBackend={backend.retry}
      >
        {renderPage()}
      </Layout>

      <ToastRenderer toasts={toast.toasts} remove={toast.remove} />
    </>
  );
}
