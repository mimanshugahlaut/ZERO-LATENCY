export function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
          <h3 className="font-display fw-700" style={{ fontSize: '1.1rem', letterSpacing:'-0.01em' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background:'none',border:'none',color:'var(--outline)',cursor:'pointer',fontSize:'1.2rem',lineHeight:1 }}
          >✕</button>
        </div>
        <div>{children}</div>
        {footer && <div style={{ marginTop:'var(--space-6)', display:'flex', gap:'var(--space-3)', justifyContent:'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}
