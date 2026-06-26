import "../../styles/components/EmptyState.css";

export default function EmptyState({ icon = "📭", title, description, action }) {
  return (
    <div className="empty-state animate-fade-in">
      <span className="empty-icon">{icon}</span>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  );
}
