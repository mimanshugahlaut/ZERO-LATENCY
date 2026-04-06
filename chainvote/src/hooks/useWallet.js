import { useState, useEffect, useCallback } from 'react';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMask = typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install it.');
      return;
    }
    setIsConnecting(true);
    setError(null);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    // Auto-detect already connected wallet
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accounts => { if (accounts.length) setAccount(accounts[0]); })
      .catch(() => {});

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
    };
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return { account, isConnecting, isConnected: Boolean(account), isMetaMask, error, connect, disconnect };
}
