import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Input from "../components/common/Input";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/common/Button";
import {
  validateEmail,
} from "../utils/validation";
import "../styles/pages/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateEmail(email),
      password: password ? "" : "Password is required",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      await login({ email, password });
      success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in">
        <div className="auth-header">
          <Link to="/" className="auth-logo">ConnectIQ</Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Button type="submit" loading={loading} className="auth-submit">
            Sign In
          </Button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
