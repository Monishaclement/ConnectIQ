import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import "../../styles/layout/Sidebar.css";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/profile", label: "Profile", icon: "👤" },
  { path: "/intents", label: "Intents", icon: "🎯" },
  { path: "/recommendations", label: "Recommendations", icon: "✨" },
  { path: "/connections", label: "Connections", icon: "🤝" },
  { path: "/chat", label: "Messages", icon: "💬" },
  { path: "/search", label: "Search", icon: "🔍" },
  { path: "/notifications", label: "Notifications", icon: "🔔" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen ? <div className="sidebar-overlay" onClick={onClose} /> : null}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">ConnectIQ</span>
        </div>

        <div className="sidebar-user">
          <Avatar src={user?.profileImage} name={user?.name} size="md" />
          <div>
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-email">{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>
    </>
  );
}
