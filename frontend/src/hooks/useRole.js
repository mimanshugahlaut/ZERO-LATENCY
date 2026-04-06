import { useMemo } from 'react';
import { ADMIN_ADDRESS } from '../utils/constants';

/**
 * useRole - Derives the user's role from the connected wallet.
 * @param {Object} wallet - The wallet object from useWallet()
 * @returns {Object} { role, isAdmin, isVoter, isGuest }
 */
export function useRole(wallet) {
  const role = useMemo(() => {
    if (!wallet.account) return 'guest';
    
    // Normalize case as addresses can vary
    const address = wallet.account.toLowerCase();
    const admin   = ADMIN_ADDRESS.toLowerCase();
    
    if (address === admin) return 'admin';
    return 'voter';
  }, [wallet.account]);

  return {
    role,
    isAdmin: role === 'admin',
    isVoter: role === 'voter',
    isGuest: role === 'guest',
  };
}
