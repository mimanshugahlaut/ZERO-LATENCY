import { useState, useEffect, useRef, useCallback } from 'react';
import { MAX_FEED_ITEMS } from '../utils/constants';
import { truncateAddress } from '../utils/formatters';
import { MOCK_CANDIDATES } from './useCandidates';

const MOCK_EVENTS = [
  { id: '1', voter: '0x1234567890abcdef1234', candidateId: 0, candidateName: 'Alice Johnson',  dotColor: '#3b82f6', timestamp: Date.now() - 120_000,  blockIndex: 1, isNew: false },
  { id: '2', voter: '0x234567890abcdef12345', candidateId: 1, candidateName: 'Bob Martinez',   dotColor: '#8b5cf6', timestamp: Date.now() - 300_000,  blockIndex: 2, isNew: false },
  { id: '3', voter: '0x34567890abcdef123456', candidateId: 2, candidateName: 'Carol Chen',     dotColor: '#10b981', timestamp: Date.now() - 600_000,  blockIndex: 3, isNew: false },
  { id: '4', voter: '0x4567890abcdef1234567', candidateId: 0, candidateName: 'Alice Johnson',  dotColor: '#3b82f6', timestamp: Date.now() - 900_000,  blockIndex: 4, isNew: false },
  { id: '5', voter: '0x567890abcdef12345678', candidateId: 3, candidateName: 'David Okafor',   dotColor: '#f59e0b', timestamp: Date.now() - 1_200_000, blockIndex: 5, isNew: false },
];

export function useEvents(readContract, candidates) {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const listenerRef         = useRef(null);

  const addEvent = useCallback((evt) => {
    setEvents(prev => {
      const candidate = candidates?.find(c => c.id === Number(evt.candidateId));
      const newEvt = {
        id:            evt.blockIndex?.toString() || Date.now().toString(),
        voter:         evt.voter,
        candidateId:   Number(evt.candidateId),
        candidateName: candidate?.name || `Candidate ${evt.candidateId}`,
        dotColor:      candidate?.dotColor || '#3b82f6',
        timestamp:     Date.now(),
        blockIndex:    Number(evt.blockIndex),
        isNew:         true,
      };
      const updated = [newEvt, ...prev].slice(0, MAX_FEED_ITEMS);
      // Clear isNew after 3s
      setTimeout(() => setEvents(e => e.map(ev => ev.id === newEvt.id ? { ...ev, isNew: false } : ev)), 3000);
      return updated;
    });
  }, [candidates]);

  useEffect(() => {
    if (!readContract) return;
    try {
      const filter = readContract.filters.VoteCast();
      readContract.on(filter, (voter, candidateId, blockIndex, voteHash) => {
        addEvent({ voter, candidateId, blockIndex, voteHash });
      });
      listenerRef.current = filter;
    } catch {}
    return () => {
      if (readContract && listenerRef.current) {
        readContract.removeAllListeners('VoteCast');
      }
    };
  }, [readContract, addEvent]);

  return { events };
}
