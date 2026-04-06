import { useState, useEffect } from 'react';

/**
 * useBackendStatus - Track the online status of the ChainVote backend.
 * @returns {Object} { status, url, retry }
 */
export function useBackendStatus() {
  const [status, setStatus] = useState('checking');
  const url = 'http://localhost:4000'; // Hardcoded for local dev

  const check = async () => {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) setStatus('online');
      else setStatus('offline');
    } catch (e) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    check();
    const interval = setInterval(check, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { status, url, retry: check };
}
