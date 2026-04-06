import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/contract';

export function useContract(account) {
  const [contract, setContract]           = useState(null);
  const [readContract, setReadContract]   = useState(null);
  const [provider, setProvider]           = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;
    const prov = new BrowserProvider(window.ethereum);
    setProvider(prov);
    // Read-only contract (no signer needed)
    const ro = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, prov);
    setReadContract(ro);
  }, []);

  useEffect(() => {
    if (!window.ethereum || !account || !provider) return;
    const setup = async () => {
      try {
        const signer = await provider.getSigner();
        const c = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(c);
      } catch (err) {
        console.error('Contract setup error:', err);
      }
    };
    setup();
  }, [account, provider]);

  const callRead = useCallback(async (method, ...args) => {
    if (!readContract) throw new Error('No provider');
    return readContract[method](...args);
  }, [readContract]);

  const callWrite = useCallback(async (method, ...args) => {
    if (!contract) throw new Error('Wallet not connected');
    const tx = await contract[method](...args);
    return tx.wait();
  }, [contract]);

  return { contract, readContract, provider, callRead, callWrite };
}
