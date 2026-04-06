import { useState, useEffect, useRef, useCallback } from 'react';
import { MAX_FEED_ITEMS } from '../utils/constants';

export function useEvents(readContract, candidates) {
  const [events, setEvents] = useState([]);
  const listenerRef         = useRef(null);

  const addEvent = useCallback((voter, candidateId, voteHash, evt) => {
    setEvents(prev => {
      const candidate = candidates?.find(c => c.id === Number(candidateId));
      const newEvt = {
        id:            voteHash + Date.now(),
        voter,
        candidateId:   Number(candidateId),
        candidateName: candidate?.name || `Candidate ${candidateId}`,
        dotColor:      candidate?.dotColor || '#3b82f6',
        timestamp:     Date.now(),
        blockIndex:    evt?.logIndex || 0,
        isNew:         true,
      };
      const updated = [newEvt, ...prev].slice(0, MAX_FEED_ITEMS);
      setTimeout(() => setEvents(e => e.map(ev => ev.id === newEvt.id ? { ...ev, isNew: false } : ev)), 3000);
      return updated;
    });
  }, [candidates]);

  useEffect(() => {
    if (!readContract) return;
    try {
      readContract.on('VoteCasted', addEvent);
      listenerRef.current = true;
    } catch (e) {
      console.error("Event error", e);
    }
    
    return () => {
      if (readContract && listenerRef.current) {
        readContract.removeAllListeners('VoteCasted');
      }
    };
  }, [readContract, addEvent]);

  return { events };
}
