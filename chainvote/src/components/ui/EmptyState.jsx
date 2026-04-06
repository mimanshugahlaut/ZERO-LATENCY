export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-desc">{description}</p>}
      {action}
    </div>
  );
}
