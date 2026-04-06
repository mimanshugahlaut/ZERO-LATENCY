export function Skeleton({ width = '100%', height = '1rem', borderRadius, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: borderRadius || 'var(--radius-md)', ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass" style={{ padding: 'var(--space-6)', display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'var(--space-4)' }}>
        <Skeleton width="60px" height="60px" borderRadius="50%" />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
          <Skeleton height="1rem" width="60%" />
          <Skeleton height="0.75rem" width="40%" />
        </div>
      </div>
      <Skeleton height="0.85rem" />
      <Skeleton height="0.85rem" width="80%" />
      <Skeleton height="2.5rem" borderRadius="var(--radius-md)" />
    </div>
  );
}
