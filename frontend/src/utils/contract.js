import { BrowserProvider, Contract } from 'ethers';
import chainVoteArtifact from './ChainVote.json';
import {
  FALLBACK_CONTRACT_ADDRESS,
  isValidContractAddress,
  loadRuntimeContractConfig,
} from './web3';

export const CONTRACT_ABI = chainVoteArtifact.abi;

let currentAddress = FALLBACK_CONTRACT_ADDRESS;

export async function refreshContractAddress() {
  const runtimeConfig = await loadRuntimeContractConfig();
  if (runtimeConfig?.address) {
    currentAddress = runtimeConfig.address;
  }
  return currentAddress;
}

export function getProvider() {
  if (!window.ethereum) {
    return null;
  }
  return new BrowserProvider(window.ethereum);
}

export async function getContract() {
  const provider = getProvider();
  if (!provider) {
    throw new Error('Wallet not connected: MetaMask not installed.');
  }

  await refreshContractAddress();
  if (!isValidContractAddress(currentAddress)) {
    throw new Error('Contract not deployed: invalid address config.');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const signer = await provider.getSigner();
  return new Contract(currentAddress, CONTRACT_ABI, signer);
}

export function getReadContract() {
  const provider = getProvider();
  if (!provider || !isValidContractAddress(currentAddress)) {
    return null;
  }
  return new Contract(currentAddress, CONTRACT_ABI, provider);
}

export function getContractAddress() {
  return currentAddress;
}
