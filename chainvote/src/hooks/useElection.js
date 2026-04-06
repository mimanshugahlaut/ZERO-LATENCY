import { useState, useEffect, useCallback } from 'react';
import { ELECTION_STATE } from '../utils/constants';
import { MOCK_CANDIDATES } from './useCandidates';

export function useElection(callRead) {
  const [state, setState]           = useState(null);
  const [name, setName]             = useState('Board Election 2025');
  const [totalVotes, setTotalVotes] = useState(0);
  const [chainLength, setChainLength] = useState(0);
  const [loading, setLoading]       = useState(true);

  const fetchElectionData = useCallback(async () => {
    if (!callRead) return;
    try {
      const [elState, elName, votes, cLen] = await Promise.all([
        callRead('electionState'),
        callRead('electionName'),
        callRead('totalVotes'),
        callRead('chainLength'),
      ]);
      setState(Number(elState));
      setName(elName);
      setTotalVotes(Number(votes));
      setChainLength(Number(cLen));
    } catch {
      // Contract not deployed — use mock state
      setState(ELECTION_STATE.STARTED);
      setTotalVotes(47);
      setChainLength(47);
    } finally {
      setLoading(false);
    }
  }, [callRead]);

  useEffect(() => {
    fetchElectionData();
    const interval = setInterval(fetchElectionData, 10_000);
    return () => clearInterval(interval);
  }, [fetchElectionData]);

  const turnout = totalVotes > 0 ? Math.min(100, Math.round((totalVotes / 120) * 100)) : 0;

  return { state, name, totalVotes, chainLength, turnout, loading, refresh: fetchElectionData };
}
