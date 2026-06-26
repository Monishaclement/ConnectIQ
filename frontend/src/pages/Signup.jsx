import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Input from "../components/common/Input";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/common/Button";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
} from "../utils/validation";
import "../styles/pages/Auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">ConnectIQ</Link>
          <h1>Create your account</h1>
          <p>Join ConnectIQ and start building your network</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChange={update("name")}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            value={form.password}
            onChange={update("password")}
            error={errors.password}
            showStrength
          />
          <PasswordInput
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
          />
          <Button type="submit" loading={loading} className="auth-submit">
            Create Account
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
