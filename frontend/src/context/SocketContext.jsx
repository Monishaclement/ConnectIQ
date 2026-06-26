import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import socket from "../socket";
import { useAuth } from "./AuthContext";
import {
  getConnections,
  saveConnections,
  getNotifications,
  saveNotifications,
} from "../utils/storage";
import { NOTIFICATION_TYPES } from "../utils/constants";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connections, setConnections] = useState({
    pending: [],
    sent: [],
    accepted: [],
  });
  const [typingUsers, setTypingUsers] = useState({});

  const addNotification = useCallback(
    (notification) => {
      if (!user) return;
      const existing = getNotifications(user._id);
      const updated = [
        {
          id: Date.now(),
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        },
        ...existing,
      ].slice(0, 50);
      saveNotifications(user._id, updated);
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    },
    [user]
  );

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const stored = getConnections(user._id);
    setConnections(stored);

    socket.connect();

    const handleOnline = ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    };

    const handleOffline = ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const handleReceiveRequest = ({ fromUserId, requestId }) => {
      setConnections((prev) => {
        const updated = {
          ...prev,
          pending: [
            ...prev.pending.filter((p) => p.requestId !== requestId),
            { fromUserId, requestId, createdAt: new Date().toISOString() },
          ],
        };
        saveConnections(user._id, updated);
        return updated;
      });
      addNotification({
        type: NOTIFICATION_TYPES.CONNECTION,
        message: "You received a new connection request",
        fromUserId,
        requestId,
      });
    };

    const handleRequestAccepted = ({ fromUserId }) => {
      setConnections((prev) => {
        const updated = {
          ...prev,
          sent: prev.sent.filter((s) => s.toUserId !== fromUserId),
          accepted: [
            ...prev.accepted.filter((a) => a.userId !== fromUserId),
            { userId: fromUserId, createdAt: new Date().toISOString() },
          ],
        };
        saveConnections(user._id, updated);
        return updated;
      });
      addNotification({
        type: NOTIFICATION_TYPES.CONNECTION,
        message: "Your connection request was accepted",
        fromUserId,
      });
    };

    const handleReceiveMessage = ({ fromUserId, message }) => {
      addNotification({
        type: NOTIFICATION_TYPES.CHAT,
        message: "You received a new message",
        fromUserId,
        preview: message,
      });
    };

    const handleTyping = ({ fromUserId }) => {
      setTypingUsers((prev) => ({ ...prev, [fromUserId]: true }));
    };

    const handleStopTyping = ({ fromUserId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[fromUserId];
        return next;
      });
    };

    socket.on("user_online", handleOnline);
    socket.on("user_offline", handleOffline);
    socket.on("receive_request", handleReceiveRequest);
    socket.on("request_accepted", handleRequestAccepted);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("user_online", handleOnline);
      socket.off("user_offline", handleOffline);
      socket.off("receive_request", handleReceiveRequest);
      socket.off("request_accepted", handleRequestAccepted);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.disconnect();
    };
  }, [isAuthenticated, user, addNotification]);

  const sendRequest = (toUserId) => {
    if (!user) return;
    socket.emit("send_request", { toUserId });
    setConnections((prev) => {
      const updated = {
        ...prev,
        sent: [
          ...prev.sent.filter((s) => s.toUserId !== toUserId),
          { toUserId, createdAt: new Date().toISOString() },
        ],
      };
      saveConnections(user._id, updated);
      return updated;
    });
  };

  const acceptRequest = (requestId, fromUserId) => {
    socket.emit("accept_request", { requestId });
    setConnections((prev) => {
      const updated = {
        ...prev,
        pending: prev.pending.filter((p) => p.requestId !== requestId),
        accepted: [
          ...prev.accepted.filter((a) => a.userId !== fromUserId),
          { userId: fromUserId, createdAt: new Date().toISOString() },
        ],
      };
      saveConnections(user._id, updated);
      return updated;
    });
  };

  const rejectRequest = (requestId) => {
    setConnections((prev) => {
      const updated = {
        ...prev,
        pending: prev.pending.filter((p) => p.requestId !== requestId),
      };
      saveConnections(user._id, updated);
      return updated;
    });
  };

  const removeConnection = (userId) => {
    setConnections((prev) => {
      const updated = {
        ...prev,
        accepted: prev.accepted.filter((a) => a.userId !== userId),
      };
      saveConnections(user._id, updated);
      return updated;
    });
  };

  const sendMessage = (toUserId, message) => {
    socket.emit("send_message", { toUserId, message });
  };

  const emitTyping = (toUserId) => {
    socket.emit("typing", { toUserId });
  };

  const emitStopTyping = (toUserId) => {
    socket.emit("stop_typing", { toUserId });
  };

  const isOnline = (userId) => onlineUsers.has(userId);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        connections,
        typingUsers,
        sendRequest,
        acceptRequest,
        rejectRequest,
        removeConnection,
        sendMessage,
        emitTyping,
        emitStopTyping,
        isOnline,
        setConnections,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
