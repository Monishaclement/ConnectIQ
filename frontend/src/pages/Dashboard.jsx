import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useNotifications } from "../context/NotificationContext";
import { getRecommendations } from "../api/userApi";
import ProfileCompletionBar from "../components/profile/ProfileCompletionBar";
import RecommendationCard from "../components/recommendation/RecommendationCard";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { getUserIntents } from "../utils/storage";
import { formatRelativeTime } from "../utils/formatters";
import "../styles/pages/Dashboard.css";

export default function Dashboard() {
  const { user, profileExtended } = useAuth();
  const { connections, sendRequest } = useSocket();
  const { notifications, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendations()
      .then((res) => setRecommendations((res.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const intents = getUserIntents(user._id).filter((i) => i.isActive !== false).slice(0, 3);
  const connectedIds = new Set(connections.accepted.map((c) => c.userId));
  const sentIds = new Set(connections.sent.map((s) => s.toUserId));

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dash-welcome">
        <div>
          <h1>Welcome back, {user.name?.split(" ")[0]} 👋</h1>
          <p>Here&apos;s what&apos;s happening in your network today</p>
        </div>
        <div className="dash-quick-actions">
          <Button size="sm" onClick={() => navigate("/intents")}>Create Intent</Button>
          <Button variant="secondary" size="sm" onClick={() => navigate("/recommendations")}>Find People</Button>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-main-col">
          <ProfileCompletionBar user={user} extended={profileExtended} />

          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Recommended For You</h2>
              <Link to="/recommendations">View all →</Link>
            </div>
            {loading ? (
              <LoadingSpinner />
            ) : recommendations.length === 0 ? (
              <p className="dash-empty">Complete your profile to get recommendations</p>
            ) : (
              <div className="dash-rec-row">
                {recommendations.map((r) => (
                  <RecommendationCard
                    key={r.user._id}
                    userData={r}
                    score={r.score}
                    onConnect={sendRequest}
                    onReport={() => {}}
                    connected={connectedIds.has(r.user._id)}
                    sent={sentIds.has(r.user._id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Active Intents</h2>
              <Link to="/intents">Manage →</Link>
            </div>
            {intents.length === 0 ? (
              <p className="dash-empty">No active intents. <Link to="/intents">Create one</Link></p>
            ) : (
              <div className="dash-intent-list">
                {intents.map((i) => (
                  <div key={i._id} className="dash-intent-item">
                    <strong>{i.title}</strong>
                    <Badge variant="primary">{i.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dash-side-col">
          <div className="dash-section card dash-summary">
            <Avatar src={user.profileImage} name={user.name} size="lg" />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <div className="dash-summary-stats">
              <div><strong>{connections.accepted.length}</strong><span>Connections</span></div>
              <div><strong>{connections.pending.length}</strong><span>Pending</span></div>
              <div><strong>{unreadCount}</strong><span>Notifications</span></div>
            </div>
          </div>

          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Pending Requests</h2>
              <Link to="/connections">View all →</Link>
            </div>
            {connections.pending.length === 0 ? (
              <p className="dash-empty">No pending requests</p>
            ) : (
              connections.pending.slice(0, 3).map((req) => (
                <div key={req.requestId} className="dash-request-item">
                  <Avatar name="User" size="sm" />
                  <span>New connection request</span>
                  <Badge variant="warning">Pending</Badge>
                </div>
              ))
            )}
          </div>

          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Recent Notifications</h2>
              <Link to="/notifications">View all →</Link>
            </div>
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`dash-notif-item ${n.read ? "" : "unread"}`}>
                <span>{n.message}</span>
                <small>{formatRelativeTime(n.createdAt)}</small>
              </div>
            ))}
            {notifications.length === 0 ? <p className="dash-empty">No notifications yet</p> : null}
          </div>

          <div className="dash-section card">
            <div className="dash-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="dash-actions-grid">
              <button onClick={() => navigate("/chat")}>💬 Messages</button>
              <button onClick={() => navigate("/search")}>🔍 Search</button>
              <button onClick={() => navigate("/profile/edit")}>✏️ Edit Profile</button>
              <button onClick={() => navigate("/settings")}>⚙️ Settings</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
