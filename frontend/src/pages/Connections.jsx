import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import "../styles/pages/Connections.css";

export default function Connections() {
  const { connections, acceptRequest, rejectRequest, removeConnection, isOnline } = useSocket();
  const { success } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("pending");

  const tabs = [
    { id: "pending", label: "Pending", count: connections.pending.length },
    { id: "sent", label: "Sent", count: connections.sent.length },
    { id: "accepted", label: "My Connections", count: connections.accepted.length },
  ];

  const handleAccept = (req) => {
    acceptRequest(req.requestId, req.fromUserId);
    success("Connection accepted!");
  };

  const handleReject = (req) => {
    rejectRequest(req.requestId);
    success("Request rejected");
  };

  const handleRemove = (userId) => {
    removeConnection(userId);
    success("Connection removed");
  };

  const renderList = () => {
    if (tab === "pending") {
      if (!connections.pending.length) {
        return <EmptyState icon="📬" title="No pending requests" description="When someone sends you a request, it will appear here" />;
      }
      return connections.pending.map((req) => (
        <div key={req.requestId} className="conn-item card">
          <Avatar name="User" size="md" online={isOnline(req.fromUserId)} />
          <div className="conn-info">
            <strong>Connection Request</strong>
            <p>User ID: {req.fromUserId?.slice(-6)}</p>
          </div>
          <div className="conn-actions">
            <Button size="sm" onClick={() => handleAccept(req)}>Accept</Button>
            <Button variant="secondary" size="sm" onClick={() => handleReject(req)}>Reject</Button>
          </div>
        </div>
      ));
    }

    if (tab === "sent") {
      if (!connections.sent.length) {
        return <EmptyState icon="📤" title="No sent requests" description="Connect with recommended users to grow your network" />;
      }
      return connections.sent.map((req) => (
        <div key={req.toUserId} className="conn-item card">
          <Avatar name="User" size="md" />
          <div className="conn-info">
            <strong>Request Sent</strong>
            <p>Waiting for response</p>
          </div>
          <Badge variant="warning">Pending</Badge>
        </div>
      ));
    }

    if (!connections.accepted.length) {
      return <EmptyState icon="🤝" title="No connections yet" description="Start connecting with people to build your network" />;
    }
    return connections.accepted.map((conn) => (
      <div key={conn.userId} className="conn-item card">
        <Avatar name="User" size="md" online={isOnline(conn.userId)} />
        <div className="conn-info">
          <strong>Connected</strong>
          <p>{isOnline(conn.userId) ? "Online" : "Offline"}</p>
        </div>
        <div className="conn-actions">
          <Button size="sm" onClick={() => navigate(`/chat?user=${conn.userId}`)}>Message</Button>
          <Button variant="danger" size="sm" onClick={() => handleRemove(conn.userId)}>Remove</Button>
        </div>
      </div>
    ));
  };

  return (
    <div className="page-container connections-page animate-fade-in">
      <div className="page-header">
        <h1>Connections</h1>
        <p>Manage your connection requests and network</p>
      </div>

      <div className="conn-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count > 0 ? <span className="conn-tab-count">{t.count}</span> : null}
          </button>
        ))}
      </div>

      <div className="conn-list">{renderList()}</div>
    </div>
  );
}
