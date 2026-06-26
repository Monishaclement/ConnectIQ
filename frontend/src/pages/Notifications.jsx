import { useNotifications } from "../context/NotificationContext";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { formatRelativeTime } from "../utils/formatters";
import { NOTIFICATION_TYPES } from "../utils/constants";
import "../styles/pages/Notifications.css";

const typeIcons = {
  [NOTIFICATION_TYPES.CONNECTION]: "🤝",
  [NOTIFICATION_TYPES.CHAT]: "💬",
  [NOTIFICATION_TYPES.RECOMMENDATION]: "✨",
  [NOTIFICATION_TYPES.SYSTEM]: "ℹ️",
};

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="page-container notifications-page animate-fade-in">
      <div className="notif-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your network activity</p>
        </div>
        {notifications.some((n) => !n.read) ? (
          <Button variant="secondary" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="notif-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item card ${n.read ? "" : "unread"}`}
              onClick={() => markAsRead(n.id)}
            >
              <span className="notif-icon">{typeIcons[n.type] || "📌"}</span>
              <div className="notif-content">
                <p>{n.message}</p>
                {n.preview ? <span className="notif-preview">{n.preview}</span> : null}
                <small>{formatRelativeTime(n.createdAt)}</small>
              </div>
              <button
                className="notif-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                aria-label="Delete notification"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
