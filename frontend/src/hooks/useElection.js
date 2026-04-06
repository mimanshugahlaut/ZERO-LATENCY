import { useState, useEffect, useCallback } from 'react';
import { ELECTION_STATE } from '../utils/constants';

export function useElection(callRead) {
  const [state, setState]           = useState(null);
  const [name]                      = useState('ChainVote Election');
  const [totalVotes, setTotalVotes] = useState(0);
  const [chainLength, setChainLength] = useState(0);
  const [loading, setLoading]       = useState(true);

  const fetchElectionData = useCallback(async () => {
    if (!callRead) return;
    try {
      const isActive = await callRead('electionActive');
      const length = await callRead('getLedgerLength');

      if (typeof isActive !== 'boolean' || length === null || length === undefined) {
        setState(null);
        setTotalVotes(0);
        setChainLength(0);
        return;
      }

      setState(isActive ? ELECTION_STATE.STARTED : ELECTION_STATE.NOT_STARTED);
      setTotalVotes(Number(length));
      setChainLength(Number(length));
    } catch {
      setState(ELECTION_STATE.NOT_STARTED);
      setTotalVotes(0);
      setChainLength(0);
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
