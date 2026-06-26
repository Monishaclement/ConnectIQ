export const INTENT_CATEGORIES = [
  { value: "study", label: "Study Partner", icon: "📚" },
  { value: "project", label: "Project Collaboration", icon: "🚀" },
  { value: "mentorship", label: "Mentorship", icon: "🎓" },
  { value: "job", label: "Hiring", icon: "💼" },
  { value: "startup", label: "Startup", icon: "💡" },
];

export const REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "fake", label: "Fake Profile" },
  { value: "abuse", label: "Abuse" },
  { value: "harassment", label: "Harassment" },
  { value: "other", label: "Other" },
];

export const SORT_OPTIONS = [
  { value: "match", label: "Best Match" },
  { value: "trust", label: "Trust Score" },
  { value: "name", label: "Name (A-Z)" },
];

export const NOTIFICATION_TYPES = {
  CONNECTION: "connection",
  CHAT: "chat",
  RECOMMENDATION: "recommendation",
  SYSTEM: "system",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "connectiq_user",
  INTENTS: "connectiq_intents",
  CONNECTIONS: "connectiq_connections",
  MESSAGES: "connectiq_messages",
  NOTIFICATIONS: "connectiq_notifications",
  BLOCKED: "connectiq_blocked",
  SETTINGS: "connectiq_settings",
  PROFILE_EXT: "connectiq_profile_ext",
};
