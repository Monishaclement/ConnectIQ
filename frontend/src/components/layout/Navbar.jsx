import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import SearchBar from "../common/SearchBar";
import Avatar from "../common/Avatar";
import "../../styles/layout/Navbar.css";

export default function Navbar({ onMenuClick, searchValue, onSearchChange }) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick} aria-label="Menu">
          ☰
        </button>
        {onSearchChange ? (
          <SearchBar
            value={searchValue || ""}
            onChange={onSearchChange}
            placeholder="Search users, skills, intents..."
            className="navbar-search"
          />
        ) : null}
      </div>

      <div className="navbar-right">
        <button
          className="navbar-icon-btn"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 ? (
            <span className="navbar-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          ) : null}
        </button>

        <button
          className="navbar-profile-btn"
          onClick={() => navigate("/profile")}
        >
          <Avatar src={user?.profileImage} name={user?.name} size="sm" />
          <span className="navbar-profile-name">{user?.name}</span>
        </button>
      </div>
    </header>
  );
}
