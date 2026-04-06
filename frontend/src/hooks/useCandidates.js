import { useState, useEffect, useCallback } from 'react';
import { candidateDotColor } from '../utils/formatters';

export const MOCK_CANDIDATES = [
  { id: 0, name: 'Alice Johnson',   party: 'Transparency Party',   voteCount: 19 },
  { id: 1, name: 'Bob Martinez',    party: 'Innovation Alliance',   voteCount: 15 },
  { id: 2, name: 'Carol Chen',      party: 'Progressive Front',    voteCount: 9 },
  { id: 3, name: 'David Okafor',    party: 'Reform Coalition',     voteCount: 4 },
];

export function useCandidates(callRead) {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [loading, setLoading]       = useState(true);

  const fetchCandidates = useCallback(async () => {
    if (!callRead) { setLoading(false); return; }
    try {
      const count = Number(await callRead('candidateCount'));
      if (count === 0) { setCandidates(MOCK_CANDIDATES); setLoading(false); return; }
      const results = await Promise.all(
        Array.from({ length: count }, (_, i) => callRead('getCandidate', i))
      );
      setCandidates(results.map((r, i) => ({
        id:        Number(r.id ?? i),
        name:      r.name,
        voteCount: Number(r.voteCount),
      })));
    } catch {
      setCandidates(MOCK_CANDIDATES);
    } finally {
      setLoading(false);
    }
  }, [callRead]);

  useEffect(() => {
    fetchCandidates();
    const interval = setInterval(fetchCandidates, 10_000);
    return () => clearInterval(interval);
  }, [fetchCandidates]);

  // Enrich with colors
  const enriched = candidates.map((c, i) => ({
    ...c,
    dotColor: candidateDotColor(i),
  }));

  return { candidates: enriched, loading, refresh: fetchCandidates };
}
