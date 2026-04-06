import staticContractConfig from './contract-address.json';

export const HARDHAT_CHAIN_ID = 31337;
export const HARDHAT_CHAIN_HEX = '0x7A69';

export const HARDHAT_CHAIN_CONFIG = {
  chainId: HARDHAT_CHAIN_HEX,
  chainName: 'Hardhat Local',
  rpcUrls: ['http://127.0.0.1:8545'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
};

const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const FALLBACK_CONTRACT_ADDRESS = staticContractConfig?.address ?? '';

export function isValidContractAddress(address) {
  return ADDRESS_REGEX.test(address || '');
}

export function parseChainId(chainIdHex) {
  return Number.parseInt(chainIdHex, 16);
}

export function normalizeWeb3Error(error) {
  const message = error?.reason || error?.shortMessage || error?.message || 'Unknown error';
  const lowered = message.toLowerCase();

  if (error?.code === 4001 || lowered.includes('user rejected')) {
    return 'Transaction rejected in MetaMask.';
  }
  if (error?.code === -32002 || lowered.includes('already pending')) {
    return 'MetaMask already has a pending request. Open MetaMask and finish it first.';
  }
  if (lowered.includes('insufficient funds')) {
    return 'Insufficient funds on the selected network account.';
  }
  if (lowered.includes('contract not deployed')) {
    return 'Contract not deployed at configured address.';
  }
  if (lowered.includes('wrong network')) {
    return 'Wrong network. Switch MetaMask to Hardhat Local (31337).';
  }

  return message;
}

export async function ensureHardhatNetwork(ethereum) {
  if (!ethereum) {
    throw new Error('Wallet not connected: MetaMask not installed.');
  }

  const currentChainHex = await ethereum.request({ method: 'eth_chainId' });
  if (parseChainId(currentChainHex) === HARDHAT_CHAIN_ID) {
    return;
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_CHAIN_HEX }],
    });
  } catch (switchError) {
    if (switchError?.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [HARDHAT_CHAIN_CONFIG],
      });
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HARDHAT_CHAIN_HEX }],
      });
    } else {
      throw switchError;
    }
  }

  const finalChainHex = await ethereum.request({ method: 'eth_chainId' });
  if (parseChainId(finalChainHex) !== HARDHAT_CHAIN_ID) {
    throw new Error(
      `Wrong network. Expected ${HARDHAT_CHAIN_ID}, got ${parseChainId(finalChainHex)}.`
    );
  }
}

export async function loadRuntimeContractConfig() {
  try {
    const response = await fetch(`/contract-address.json?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    const config = await response.json();
    if (!isValidContractAddress(config?.address)) {
      return null;
    }
    return config;
  } catch {
    return null;
  }
}
