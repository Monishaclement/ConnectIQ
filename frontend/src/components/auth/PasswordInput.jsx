import { useState } from "react";
import Input from "../common/Input";
import "../../styles/components/PasswordInput.css";

export default function PasswordInput({
  label = "Password",
  value,
  onChange,
  error,
  showStrength = false,
  placeholder = "Enter your password",
}) {
  const [visible, setVisible] = useState(false);

  const getStrength = () => {
    if (!value) return { score: 0, label: "", color: "" };
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (score <= 2) return { score: 1, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { score: 2, label: "Fair", color: "#f59e0b" };
    if (score <= 4) return { score: 3, label: "Good", color: "#3b82f6" };
    return { score: 4, label: "Strong", color: "#10b981" };
  };

  const strength = getStrength();

  return (
    <div className="password-input">
      <Input
        label={label}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "🙈" : "👁️"}
      </button>
      {showStrength && value ? (
        <div className="password-strength">
          <div className="strength-bars">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="strength-bar"
                style={{
                  background: i <= strength.score ? strength.color : "var(--border)",
                }}
              />
            ))}
          </div>
          <span style={{ color: strength.color }}>{strength.label}</span>
        </div>
      ) : null}
    </div>
  );
}
