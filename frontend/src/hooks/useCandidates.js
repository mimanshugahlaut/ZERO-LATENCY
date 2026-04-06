import { useState, useEffect, useCallback } from 'react';
import { candidateDotColor } from '../utils/formatters';

export function useCandidates(callRead) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading]       = useState(true);

  const fetchCandidates = useCallback(async () => {
    if (!callRead) { setLoading(false); return; }
    try {
      const results = await callRead('getAllCandidates');
      if (!Array.isArray(results)) {
        setCandidates([]);
        return;
      }
      const formatted = results.map((r) => ({
        id:        Number(r.id),
        name:      r.name,
        voteCount: Number(r.voteCount),
        exists:    r.exists
      }));
      setCandidates(formatted);
    } catch (e) {
      console.error(e);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [callRead]);

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 10_000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  const enriched = candidates.map((c, i) => ({
    ...c,
    dotColor: candidateDotColor(i),
  }));

  return { candidates: enriched, loading, refresh: fetchCandidates };
}
