import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import chainVoteArtifact from '../utils/ChainVote.json';
import {
  FALLBACK_CONTRACT_ADDRESS,
  HARDHAT_CHAIN_ID,
  ensureHardhatNetwork,
  isValidContractAddress,
  loadRuntimeContractConfig,
  normalizeWeb3Error,
} from '../utils/web3';

export const ABI = chainVoteArtifact.abi;

const RUNTIME_ADDRESS_REFRESH_MS = 4000;
const READ_LOG_THROTTLE_MS = 12000;

function shouldLogNow(cacheRef, key) {
  const now = Date.now();
  const last = cacheRef.current.get(key) || 0;
  if (now - last < READ_LOG_THROTTLE_MS) {
    return false;
  }
  cacheRef.current.set(key, now);
  return true;
}

export function useContract() {
  const [provider, setProvider] = useState(null);
  const [contractAddress, setContractAddress] = useState(FALLBACK_CONTRACT_ADDRESS);
  const [status, setStatus] = useState({
    chainId: null,
    isWrongNetwork: false,
    isDeployed: null,
    lastError: null,
  });

  const readLogCache = useRef(new Map());

  const setStatusPatch = useCallback((patch) => {
    setStatus((prev) => ({ ...prev, ...patch }));
  }, []);

  const refreshContractAddress = useCallback(async () => {
    const runtimeConfig = await loadRuntimeContractConfig();
    const nextAddress = runtimeConfig?.address || FALLBACK_CONTRACT_ADDRESS;
    if (isValidContractAddress(nextAddress)) {
      setContractAddress(nextAddress);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    setProvider(new BrowserProvider(window.ethereum));
    refreshContractAddress();

    const interval = setInterval(refreshContractAddress, RUNTIME_ADDRESS_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refreshContractAddress]);

  const assertDeployed = useCallback(
    async (activeProvider) => {
      if (!isValidContractAddress(contractAddress)) {
        return false;
      }
      const code = await activeProvider.getCode(contractAddress);
      return Boolean(code && code !== '0x');
    },
    [contractAddress]
  );

  useEffect(() => {
    if (!window.ethereum || !isValidContractAddress(contractAddress)) {
      return;
    }

    let mounted = true;

    const syncNetworkAndDeployment = async () => {
      try {
        const activeProvider = new BrowserProvider(window.ethereum);
        const network = await activeProvider.getNetwork();
        const chainId = Number(network.chainId);
        const isWrongNetwork = chainId !== HARDHAT_CHAIN_ID;

        if (isWrongNetwork) {
          if (!mounted) return;
          setStatusPatch({
            chainId,
            isWrongNetwork: true,
            isDeployed: null,
          });
          return;
        }

        const deployed = await assertDeployed(activeProvider);
        if (!mounted) return;
        setStatusPatch({
          chainId,
          isWrongNetwork: false,
          isDeployed: deployed,
        });
      } catch {
        if (!mounted) return;
        setStatusPatch({ isDeployed: null });
      }
    };

    syncNetworkAndDeployment();

    return () => {
      mounted = false;
    };
  }, [assertDeployed, contractAddress, setStatusPatch]);

  const ensureProvider = useCallback(async ({ forWrite = false } = {}) => {
    if (!window.ethereum) {
      throw new Error('Wallet not connected: MetaMask not installed.');
    }

    if (forWrite) {
      await ensureHardhatNetwork(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    return new BrowserProvider(window.ethereum);
  }, []);

  const callRead = useCallback(
    async (method, ...args) => {
      if (!isValidContractAddress(contractAddress)) {
        if (shouldLogNow(readLogCache, 'missing-address')) {
          console.error('Contract not deployed: invalid contract address config.');
        }
        setStatusPatch({ isDeployed: false, lastError: 'Contract not deployed.' });
        return null;
      }

      try {
        const activeProvider = await ensureProvider();
        const network = await activeProvider.getNetwork();
        const chainId = Number(network.chainId);
        const isWrongNetwork = chainId !== HARDHAT_CHAIN_ID;

        setStatusPatch({ chainId, isWrongNetwork });

        if (isWrongNetwork) {
          if (shouldLogNow(readLogCache, 'wrong-network-read')) {
            console.error('Wrong network. Switch MetaMask to Hardhat Local (31337).');
          }
          return null;
        }

        const deployed = await assertDeployed(activeProvider);
        if (!deployed) {
          if (shouldLogNow(readLogCache, `missing-code-${contractAddress}`)) {
            console.error(`Contract not deployed at ${contractAddress}.`);
          }
          setStatusPatch({ isDeployed: false, lastError: 'Contract not deployed.' });
          return null;
        }

        const readOnlyContract = new Contract(contractAddress, ABI, activeProvider);
        if (typeof readOnlyContract[method] !== 'function') {
          if (shouldLogNow(readLogCache, `missing-method-${method}`)) {
            console.error(`Contract method "${method}" not found in ABI.`);
          }
          return null;
        }

        const result = await readOnlyContract[method](...args);
        setStatusPatch({ isDeployed: true, lastError: null });
        return result;
      } catch (err) {
        const message = normalizeWeb3Error(err);
        if (shouldLogNow(readLogCache, `read-${method}-${message}`)) {
          console.error(`Read failed (${method}): ${message}`);
        }
        setStatusPatch({ lastError: message });
        return null;
      }
    },
    [assertDeployed, contractAddress, ensureProvider, setStatusPatch]
  );

  const callWrite = useCallback(
    async (method, ...args) => {
      if (!isValidContractAddress(contractAddress)) {
        const message = 'Contract not deployed: invalid contract address config.';
        setStatusPatch({ isDeployed: false, lastError: message });
        throw new Error(message);
      }

      try {
        const activeProvider = await ensureProvider({ forWrite: true });
        const network = await activeProvider.getNetwork();
        const chainId = Number(network.chainId);
        const isWrongNetwork = chainId !== HARDHAT_CHAIN_ID;

        if (isWrongNetwork) {
          const wrongNetworkError =
            'Wrong network. Switch MetaMask to Hardhat Local (31337).';
          setStatusPatch({
            chainId,
            isWrongNetwork: true,
            lastError: wrongNetworkError,
          });
          throw new Error(wrongNetworkError);
        }

        const deployed = await assertDeployed(activeProvider);
        if (!deployed) {
          const notDeployedError = `Contract not deployed at ${contractAddress}.`;
          setStatusPatch({
            chainId,
            isWrongNetwork: false,
            isDeployed: false,
            lastError: notDeployedError,
          });
          throw new Error(notDeployedError);
        }

        const signer = await activeProvider.getSigner();
        const writableContract = new Contract(contractAddress, ABI, signer);

        if (typeof writableContract[method] !== 'function') {
          throw new Error(`Contract method "${method}" not found in ABI.`);
        }

        const tx = await writableContract[method](...args);
        const receipt = await tx.wait();

        setStatusPatch({
          chainId,
          isWrongNetwork: false,
          isDeployed: true,
          lastError: null,
        });

        return receipt;
      } catch (err) {
        const message = normalizeWeb3Error(err);
        setStatusPatch({ lastError: message });
        throw new Error(message);
      }
    },
    [assertDeployed, contractAddress, ensureProvider, setStatusPatch]
  );

  const readContract = useMemo(() => {
    if (
      !provider ||
      !isValidContractAddress(contractAddress) ||
      status.isWrongNetwork ||
      status.isDeployed === false
    ) {
      return null;
    }
    return new Contract(contractAddress, ABI, provider);
  }, [provider, contractAddress, status.isDeployed, status.isWrongNetwork]);

  return {
    provider,
    contractAddress,
    callRead,
    callWrite,
    readContract,
    status,
    refreshContractAddress,
  };
}
