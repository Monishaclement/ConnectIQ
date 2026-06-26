import { getInitials } from "../../utils/formatters";
import "../../styles/components/Avatar.css";

export default function Avatar({ src, name, size = "md", online }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={name || "User"} className="avatar-img" />
      ) : (
        <span className="avatar-initials">{getInitials(name)}</span>
      )}
      {online !== undefined ? (
        <span className={`avatar-status ${online ? "online" : "offline"}`} />
      ) : null}
    </div>
  );
}
