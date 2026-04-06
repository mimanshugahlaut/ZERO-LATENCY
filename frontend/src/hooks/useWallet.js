import { useState, useEffect, useCallback } from 'react';
import {
  HARDHAT_CHAIN_ID,
  ensureHardhatNetwork,
  normalizeWeb3Error,
  parseChainId,
} from '../utils/web3';

export function useWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isMetaMask =
    typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask);

  const syncWalletState = useCallback(async () => {
    if (!window.ethereum) {
      setAccount(null);
      setChainId(null);
      return;
    }

    try {
      const [accounts, chainIdHex] = await Promise.all([
        window.ethereum.request({ method: 'eth_accounts' }),
        window.ethereum.request({ method: 'eth_chainId' }),
      ]);

      setAccount(accounts?.[0] || null);
      setChainId(parseChainId(chainIdHex));
    } catch (err) {
      setError(normalizeWeb3Error(err));
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('Wallet not connected: MetaMask not installed.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await ensureHardhatNetwork(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });

      setAccount(accounts?.[0] || null);
      setChainId(parseChainId(chainIdHex));
    } catch (err) {
      setError(normalizeWeb3Error(err));
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    syncWalletState();

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts?.[0] || null);
    };

    const handleChainChanged = (nextChainIdHex) => {
      setChainId(parseChainId(nextChainIdHex));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [syncWalletState]);

  const isConnected = Boolean(account);
  const isWrongNetwork = chainId !== null && chainId !== HARDHAT_CHAIN_ID;

  return {
    account,
    chainId,
    isConnecting,
    isConnected,
    isMetaMask,
    isWrongNetwork,
    error,
    connect,
    disconnect,
  };
}
