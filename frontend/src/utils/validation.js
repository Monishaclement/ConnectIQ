export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return "";
};

export const validateName = (name) => {
  if (!name?.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 4) return { score: 2, label: "Fair", color: "#f59e0b" };
  if (score <= 5) return { score: 3, label: "Good", color: "#3b82f6" };
  return { score: 4, label: "Strong", color: "#10b981" };
};

export const validateUrl = (url, fieldName = "URL") => {
  if (!url) return "";
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return "";
  } catch {
    return `Please enter a valid ${fieldName}`;
  }
};

export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) return `${fieldName} is required`;
  return "";
};
