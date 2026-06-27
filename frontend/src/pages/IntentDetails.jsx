import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { INTENT_CATEGORIES } from "../utils/constants";
import { getUserIntents } from "../utils/storage";
import { formatDate } from "../utils/formatters";
import { getIntent } from "../api/intentApi";
import "../styles/pages/Intents.css";

export default function IntentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIntent(id)
      .then((res) => setIntent(res.data))
      .catch(() => {
        const mine = getUserIntents(user._id);
        setIntent(mine.find((i) => i._id === id) || null);
      })
      .finally(() => setLoading(false));
  }, [id, user._id]);

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!intent) {
    return (
      <div className="page-container">
        <div className="intent-not-found card">
          <h2>Intent not found</h2>
          <Link to="/intents"><Button>Back to Intents</Button></Link>
        </div>
      </div>
    );
  }

  const category = INTENT_CATEGORIES.find((c) => c.value === intent.type);
  const intentUser = intent.user || user;

  return (
    <div className="page-container intent-details animate-fade-in">
      <Link to="/intents" className="back-link">← Back to Intents</Link>
      <div className="intent-details-card card">
        <div className="intent-details-header">
          <Badge variant="primary">{category?.icon} {category?.label}</Badge>
          <span className="intent-date">{formatDate(intent.createdAt)}</span>
        </div>
        <h1>{intent.title}</h1>
        <p className="intent-details-desc">{intent.description}</p>
        {intent.requiredSkills?.length ? (
          <div className="intent-details-skills">
            <h3>Required Skills</h3>
            <div className="tag-list">
              {intent.requiredSkills.map((s) => <Badge key={s} variant="primary">{s}</Badge>)}
            </div>
          </div>
        ) : null}
        <div className="intent-details-user">
          <Avatar src={intentUser.profileImage} name={intentUser.name} size="md" />
          <div>
            <strong>{intentUser.name}</strong>
            <p>Intent creator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
