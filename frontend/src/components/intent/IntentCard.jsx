import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { INTENT_CATEGORIES } from "../../utils/constants";
import { formatDate } from "../../utils/formatters";
import "../../styles/components/IntentCard.css";

export default function IntentCard({ intent, isOwner, onEdit, onDelete }) {
  const category = INTENT_CATEGORIES.find((c) => c.value === intent.type);

  return (
    <div className="intent-card card animate-fade-in">
      <div className="intent-card-header">
        <Badge variant="primary">
          {category?.icon} {category?.label || intent.type}
        </Badge>
        {intent.isActive === false ? <Badge variant="warning">Inactive</Badge> : null}
      </div>
      <h3 className="intent-title">{intent.title}</h3>
      <p className="intent-desc">{intent.description}</p>
      {intent.requiredSkills?.length ? (
        <div className="intent-skills">
          {intent.requiredSkills.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      ) : null}
      <div className="intent-footer">
        <span className="intent-date">{formatDate(intent.createdAt)}</span>
        <div className="intent-actions">
          {isOwner ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEdit(intent)}>Edit</Button>
              <Button variant="danger" size="sm" onClick={() => onDelete(intent._id)}>Delete</Button>
            </>
          ) : (
            <Link to={`/intents/${intent._id}`}>
              <Button variant="secondary" size="sm">View Details</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function IntentCardWithUser({ intent }) {
  const category = INTENT_CATEGORIES.find((c) => c.value === intent.type);

  return (
    <Link to={`/intents/${intent._id}`} className="intent-card card intent-card-link animate-fade-in">
      <div className="intent-card-header">
        <Badge variant="primary">{category?.icon} {category?.label}</Badge>
      </div>
      <h3 className="intent-title">{intent.title}</h3>
      <p className="intent-desc">{intent.description?.slice(0, 120)}...</p>
      {intent.userName ? (
        <div className="intent-user">
          <Avatar name={intent.userName} size="sm" />
          <span>{intent.userName}</span>
        </div>
      ) : null}
    </Link>
  );
}
