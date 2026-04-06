import { useState, useEffect } from 'react';

// Shared instance so we can push logs from outside the hook
let globalLogs = [];
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener([...globalLogs]));
};

export function pushLog(type, message, metadata = {}, visibility = 'both') {
  const newLog = {
    id: Date.now().toString() + Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    type,       // 'system', 'admin', 'voter', 'error'
    message,
    metadata,   // { txHash, actor, raw }
    visibility  // 'admin', 'voter', 'both'
  };
  globalLogs = [newLog, ...globalLogs].slice(0, 50); // Keep last 50 logs
  notify();
}

export function useActivityLog() {
  const [logs, setLogs] = useState(globalLogs);

  useEffect(() => {
    listeners.add(setLogs);
    return () => listeners.delete(setLogs);
  }, []);

  return { logs, pushLog };
}
