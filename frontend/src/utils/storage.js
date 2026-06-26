import { STORAGE_KEYS } from "./constants";

export const getStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getUserIntents = (userId) => {
  const all = getStorage(STORAGE_KEYS.INTENTS, {});
  return all[userId] || [];
};

export const saveUserIntents = (userId, intents) => {
  const all = getStorage(STORAGE_KEYS.INTENTS, {});
  all[userId] = intents;
  setStorage(STORAGE_KEYS.INTENTS, all);
};

export const getConnections = (userId) => {
  const all = getStorage(STORAGE_KEYS.CONNECTIONS, {});
  return all[userId] || { pending: [], sent: [], accepted: [] };
};

export const saveConnections = (userId, connections) => {
  const all = getStorage(STORAGE_KEYS.CONNECTIONS, {});
  all[userId] = connections;
  setStorage(STORAGE_KEYS.CONNECTIONS, all);
};

export const getMessages = (userId, partnerId) => {
  const all = getStorage(STORAGE_KEYS.MESSAGES, {});
  const key = [userId, partnerId].sort().join("_");
  return all[key] || [];
};

export const saveMessages = (userId, partnerId, messages) => {
  const all = getStorage(STORAGE_KEYS.MESSAGES, {});
  const key = [userId, partnerId].sort().join("_");
  all[key] = messages;
  setStorage(STORAGE_KEYS.MESSAGES, all);
};

export const getNotifications = (userId) => {
  const all = getStorage(STORAGE_KEYS.NOTIFICATIONS, {});
  return all[userId] || [];
};

export const saveNotifications = (userId, notifications) => {
  const all = getStorage(STORAGE_KEYS.NOTIFICATIONS, {});
  all[userId] = notifications;
  setStorage(STORAGE_KEYS.NOTIFICATIONS, all);
};

export const getBlockedUsers = (userId) => {
  const all = getStorage(STORAGE_KEYS.BLOCKED, {});
  return all[userId] || [];
};

export const saveBlockedUsers = (userId, blocked) => {
  const all = getStorage(STORAGE_KEYS.BLOCKED, {});
  all[userId] = blocked;
  setStorage(STORAGE_KEYS.BLOCKED, all);
};

export const getProfileExtended = (userId) => {
  const all = getStorage(STORAGE_KEYS.PROFILE_EXT, {});
  return all[userId] || {};
};

export const saveProfileExtended = (userId, data) => {
  const all = getStorage(STORAGE_KEYS.PROFILE_EXT, {});
  all[userId] = data;
  setStorage(STORAGE_KEYS.PROFILE_EXT, all);
};

export const getSettings = (userId) => {
  const all = getStorage(STORAGE_KEYS.SETTINGS, {});
  return (
    all[userId] || {
      emailNotifications: true,
      pushNotifications: true,
      profileVisibility: "public",
      showOnlineStatus: true,
    }
  );
};

export const saveSettings = (userId, settings) => {
  const all = getStorage(STORAGE_KEYS.SETTINGS, {});
  all[userId] = settings;
  setStorage(STORAGE_KEYS.SETTINGS, all);
};
