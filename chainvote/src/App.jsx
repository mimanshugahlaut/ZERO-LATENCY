import { useState } from 'react';
import { Layout }      from './components/layout/Layout';
import { ToastRenderer, useToast } from './components/ui/Toast';
import { useAuth }    from './hooks/useAuth';
import { AuthModal }   from './components/auth/AuthModal';
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

  // Core hooks
  const auth        = useAuth();
  // We'll stub wallet out to prevent breaking legacy components temporarily, mapping account to user id.
  const wallet      = { 
    account: auth.user?.id || null, 
    isConnecting: auth.isLoading, 
    isConnected: auth.isAuthenticated,
    connect: () => auth.setIsAuthModalOpen(true),
    disconnect: auth.logout
  };

  const { callRead, callWrite, readContract } = useContract(wallet.account);
  const election    = useElection(callRead);
  const candidates  = useCandidates(callRead);
  const events      = useEvents(readContract, candidates.candidates);
  const toast       = useToast();

  const renderPage = () => {
    const commonProps = { wallet, auth, election, callRead, callWrite, toast };
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

      {/* Auth Modal for Email/Phone OTP */}
      <AuthModal 
        isOpen={auth.isAuthModalOpen} 
        onClose={() => auth.setIsAuthModalOpen(false)} 
        onLogin={(identifier, method) => {
          return auth.login(identifier, method).then(() => {
            toast.add('Successfully securely logged in', 'success');
          });
        }} 
      />

      {/* Global toast notifications */}
      <ToastRenderer toasts={toast.toasts} remove={toast.remove} />
    </>
  );
}
