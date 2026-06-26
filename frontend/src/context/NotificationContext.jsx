import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getNotifications, saveNotifications } from "../utils/storage";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(() => {
    if (user) {
      setNotifications(getNotifications(user._id));
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
    window.addEventListener("notifications-updated", loadNotifications);
    return () => window.removeEventListener("notifications-updated", loadNotifications);
  }, [loadNotifications]);

  const markAsRead = (id) => {
    if (!user) return;
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(user._id, updated);
    setNotifications(updated);
  };

  const markAllAsRead = () => {
    if (!user) return;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(user._id, updated);
    setNotifications(updated);
  };

  const deleteNotification = (id) => {
    if (!user) return;
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(user._id, updated);
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
