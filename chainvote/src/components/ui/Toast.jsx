import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export function Toast({ message, type = 'info', duration = 3500, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300); }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return createPortal(
    <div className="toast-container">
      <div className={`toast toast-${type}`} style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}>
        <span style={{ fontSize: '1.1rem' }}>{ICONS[type]}</span>
        <span style={{ flex: 1, fontSize: '0.88rem' }}>{message}</span>
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          style={{ background: 'none', border: 'none', color: 'var(--outline)', cursor: 'pointer', fontSize: '0.9rem' }}
        >✕</button>
      </div>
    </div>,
    document.body
  );
}

// ToastManager — use this via context or a global ref
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
  };
  const remove = (id) => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, show, remove, success: m => show(m,'success'), error: m => show(m,'error'), info: m => show(m,'info') };
}

export function ToastRenderer({ toasts, remove }) {
  return createPortal(
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span style={{ fontSize: '1.1rem' }}>{ICONS[t.type]}</span>
          <span style={{ flex: 1, fontSize: '0.88rem' }}>{t.message}</span>
          <button onClick={() => remove(t.id)} style={{ background:'none',border:'none',color:'var(--outline)',cursor:'pointer' }}>✕</button>
        </div>
      ))}
    </div>,
    document.body
  );
}
