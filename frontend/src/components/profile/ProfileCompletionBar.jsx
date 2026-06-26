import { Link } from "react-router-dom";
import { calculateProfileCompletion } from "../../utils/profileCompletion";
import "../../styles/components/ProfileCompletion.css";

export default function ProfileCompletionBar({ user, extended }) {
  const percentage = calculateProfileCompletion(user, extended);

  return (
    <div className="profile-completion">
      <div className="completion-header">
        <span>Profile Completion</span>
        <span className="completion-percent">{percentage}%</span>
      </div>
      <div className="completion-bar">
        <div className="completion-fill" style={{ width: `${percentage}%` }} />
      </div>
      {percentage < 100 ? (
        <Link to="/profile/edit" className="completion-link">
          Complete your profile →
        </Link>
      ) : null}
    </div>
  );
}
