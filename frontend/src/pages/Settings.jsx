import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Input from "../components/common/Input";
import PasswordInput from "../components/auth/PasswordInput";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { getSettings, saveSettings } from "../utils/storage";
import { validateEmail, validatePassword } from "../utils/validation";
import "../styles/pages/Settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings(user._id));
  const [deleteModal, setDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [emailForm, setEmailForm] = useState({ email: user.email });
  const [errors, setErrors] = useState({});

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(user._id, updated);
    success("Settings saved");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const newErrors = {
      newPass: validatePassword(passwordForm.newPass),
      confirm: passwordForm.newPass !== passwordForm.confirm ? "Passwords do not match" : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    showError("Password change requires backend support. Contact admin.");
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    const err = validateEmail(emailForm.email);
    if (err) {
      setErrors({ email: err });
      return;
    }
    showError("Email update requires backend support. Contact admin.");
  };

  const handleDeleteAccount = () => {
    logout();
    setDeleteModal(false);
    navigate("/");
    success("Account deleted locally");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="page-container settings-page animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="settings-sections">
        <section className="settings-section card">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange} className="settings-form">
            <PasswordInput label="Current Password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} />
            <PasswordInput label="New Password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({ ...passwordForm, newPass: e.target.value })} error={errors.newPass} showStrength />
            <PasswordInput label="Confirm Password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} error={errors.confirm} />
            <Button type="submit">Update Password</Button>
          </form>
        </section>

        <section className="settings-section card">
          <h2>Update Email</h2>
          <form onSubmit={handleEmailChange} className="settings-form">
            <Input label="Email" type="email" value={emailForm.email} onChange={(e) => setEmailForm({ email: e.target.value })} error={errors.email} />
            <Button type="submit">Update Email</Button>
          </form>
        </section>

        <section className="settings-section card">
          <h2>Notification Settings</h2>
          <div className="settings-toggles">
            <label className="toggle-item">
              <span>Email Notifications</span>
              <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => updateSetting("emailNotifications", e.target.checked)} />
            </label>
            <label className="toggle-item">
              <span>Push Notifications</span>
              <input type="checkbox" checked={settings.pushNotifications} onChange={(e) => updateSetting("pushNotifications", e.target.checked)} />
            </label>
          </div>
        </section>

        <section className="settings-section card">
          <h2>Privacy Settings</h2>
          <div className="settings-toggles">
            <label className="toggle-item">
              <span>Show Online Status</span>
              <input type="checkbox" checked={settings.showOnlineStatus} onChange={(e) => updateSetting("showOnlineStatus", e.target.checked)} />
            </label>
            <div className="settings-select-row">
              <span>Profile Visibility</span>
              <select value={settings.profileVisibility} onChange={(e) => updateSetting("profileVisibility", e.target.value)}>
                <option value="public">Public</option>
                <option value="connections">Connections Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section card">
          <h2>Theme</h2>
          <p className="settings-theme-info">ConnectIQ uses a professional Blue & White theme.</p>
          <div className="theme-preview">
            <div className="theme-swatch primary" />
            <div className="theme-swatch secondary" />
            <div className="theme-swatch background" />
          </div>
        </section>

        <section className="settings-section card settings-danger">
          <h2>Danger Zone</h2>
          <div className="danger-actions">
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>Delete Account</Button>
          </div>
        </section>
      </div>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm">
        <p className="delete-warning">This action cannot be undone. All your data will be permanently removed.</p>
        <div className="delete-actions">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
      </Modal>
    </div>
  );
}
