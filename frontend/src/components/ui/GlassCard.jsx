export function GlassCard({ children, className = '', style = {}, onClick }) {
  return (
    <div
      className={`glass ${className}`}
      style={{ padding: 'var(--space-6)', ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
