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

  const getDisplayUser = (connection) => connection.user || connection.requester || connection.receiver || null;

  const handleAccept = async (req) => {
    await acceptRequest(req.requestId, req.fromUserId || req.userId);
    success("Connection accepted!");
  };

  const handleReject = async (req) => {
    await rejectRequest(req.requestId);
    success("Request rejected");
  };

  const handleRemove = async (userId) => {
    await removeConnection(userId);
    success("Connection removed");
  };

  const renderList = () => {
    if (tab === "pending") {
      if (!connections.pending.length) {
        return <EmptyState icon="📬" title="No pending requests" description="When someone sends you a request, it will appear here" />;
      }
      return connections.pending.map((req) => {
        const displayUser = getDisplayUser(req);
        const displayId = req.fromUserId || req.userId || displayUser?._id;

        return (
        <div key={req.requestId} className="conn-item card">
          <Avatar src={displayUser?.profileImage} name={displayUser?.name || "User"} size="md" online={isOnline(displayId)} />
          <div className="conn-info">
            <strong>{displayUser?.name || "Connection Request"}</strong>
            <p>{displayUser?.location || `User ID: ${displayId?.slice(-6)}`}</p>
          </div>
          <div className="conn-actions">
            <Button size="sm" onClick={() => handleAccept(req)}>Accept</Button>
            <Button variant="secondary" size="sm" onClick={() => handleReject(req)}>Reject</Button>
          </div>
        </div>
        );
      });
    }

    if (tab === "sent") {
      if (!connections.sent.length) {
        return <EmptyState icon="📤" title="No sent requests" description="Connect with recommended users to grow your network" />;
      }
      return connections.sent.map((req) => {
        const displayUser = getDisplayUser(req);
        const displayId = req.toUserId || req.userId || displayUser?._id;

        return (
        <div key={req.requestId || displayId} className="conn-item card">
          <Avatar src={displayUser?.profileImage} name={displayUser?.name || "User"} size="md" />
          <div className="conn-info">
            <strong>{displayUser?.name || "Request Sent"}</strong>
            <p>{displayUser?.location || "Waiting for response"}</p>
          </div>
          <Badge variant="warning">Pending</Badge>
        </div>
        );
      });
    }

    if (!connections.accepted.length) {
      return <EmptyState icon="🤝" title="No connections yet" description="Start connecting with people to build your network" />;
    }
    return connections.accepted.map((conn) => {
      const displayUser = getDisplayUser(conn);
      const displayId = conn.userId || displayUser?._id;

      return (
      <div key={displayId} className="conn-item card">
        <Avatar src={displayUser?.profileImage} name={displayUser?.name || "User"} size="md" online={isOnline(displayId)} />
        <div className="conn-info">
          <strong>{displayUser?.name || "Connected"}</strong>
          <p>{isOnline(displayId) ? "Online" : displayUser?.location || "Offline"}</p>
        </div>
        <div className="conn-actions">
          <Button size="sm" onClick={() => navigate(`/chat?user=${displayId}`)}>Message</Button>
          <Button variant="danger" size="sm" onClick={() => handleRemove(displayId)}>Remove</Button>
        </div>
      </div>
      );
    });
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
