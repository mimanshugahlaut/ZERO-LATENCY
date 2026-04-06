import { useState } from 'react';
import { Layout }      from './components/layout/Layout';
import { ToastRenderer, useToast } from './components/ui/Toast';
import { useWallet }    from './hooks/useWallet';
import { useContract }  from './hooks/useContract';
import { useElection }  from './hooks/useElection';
import { useCandidates } from './hooks/useCandidates';
import { useEvents }    from './hooks/useEvents';

import VotePage    from './pages/VotePage';
import LedgerPage  from './pages/LedgerPage';
import ResultsPage from './pages/ResultsPage';
import AuditPage   from './pages/AuditPage';
import VerifyPage  from './pages/VerifyPage';
import AdminPage   from './pages/AdminPage';

export default function App() {
  const [page, setPage] = useState('vote');

  const wallet = useWallet();
  const auth = {
    user: wallet.account ? { id: wallet.account, identifier: wallet.account } : null,
    isAuthenticated: wallet.isConnected,
    isLoading: wallet.isConnecting,
    setIsAuthModalOpen: wallet.connect,
    logout: wallet.disconnect,
  };

  const contract = useContract();
  const { callRead, callWrite, readContract } = contract;
  const election    = useElection(callRead);
  const candidates  = useCandidates(callRead);
  const events      = useEvents(readContract, candidates.candidates);
  const toast       = useToast();

  const renderPage = () => {
    const commonProps = { wallet, auth, contract, election, callRead, callWrite, toast };
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

  return (
    <>
      <Layout
        wallet={wallet}
        auth={auth}
        electionState={election.state}
        electionName={election.name}
        activePage={page}
        onNavigate={setPage}
      >
        {renderPage()}
      </Layout>

      <ToastRenderer toasts={toast.toasts} remove={toast.remove} />
    </>
  );
}
