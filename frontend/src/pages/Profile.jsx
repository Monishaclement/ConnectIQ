import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/common/Avatar";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import ProfileCompletionBar from "../components/profile/ProfileCompletionBar";
import "../styles/pages/Profile.css";

export default function Profile() {
  const { user, profileExtended } = useAuth();

  if (!user) return null;

  return (
    <div className="page-container profile-page animate-fade-in">
      <div className="profile-header card">
        <Avatar src={user.profileImage} name={user.name} size="xl" />
        <div className="profile-header-info">
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          {user.location ? <p className="profile-location">📍 {user.location}</p> : null}
          <div className="profile-trust">
            <Badge variant="primary">Trust: {user.trustScore ?? 50}</Badge>
            <Badge variant={user.riskScore > 50 ? "danger" : "success"}>
              Risk: {user.riskScore ?? 0}
            </Badge>
            {user.isVerified ? <Badge variant="success">Verified</Badge> : null}
          </div>
          <Link to="/profile/edit">
            <Button size="sm">Edit Profile</Button>
          </Link>
        </div>
      </div>

      <div className="profile-grid">
        <ProfileCompletionBar user={user} extended={profileExtended} />

        <div className="profile-section card">
          <h2>About</h2>
          <p>{user.bio || "No bio added yet."}</p>
        </div>

        <div className="profile-section card">
          <h2>Skills</h2>
          <div className="tag-list">
            {user.skills?.length
              ? user.skills.map((s) => <Badge key={s} variant="primary">{s}</Badge>)
              : <p className="empty-text">No skills added</p>}
          </div>
        </div>

        <div className="profile-section card">
          <h2>Interests</h2>
          <div className="tag-list">
            {user.interests?.length
              ? user.interests.map((i) => <Badge key={i}>{i}</Badge>)
              : <p className="empty-text">No interests added</p>}
          </div>
        </div>

        {profileExtended.goals?.length ? (
          <div className="profile-section card">
            <h2>Goals</h2>
            <div className="tag-list">
              {profileExtended.goals.map((g) => <Badge key={g} variant="success">{g}</Badge>)}
            </div>
          </div>
        ) : null}

        {profileExtended.education ? (
          <div className="profile-section card">
            <h2>Education</h2>
            <p>{profileExtended.education}</p>
          </div>
        ) : null}

        {profileExtended.experience ? (
          <div className="profile-section card">
            <h2>Experience</h2>
            <p>{profileExtended.experience}</p>
          </div>
        ) : null}

        {(profileExtended.github || profileExtended.linkedin || profileExtended.portfolio) ? (
          <div className="profile-section card">
            <h2>Links</h2>
            <div className="profile-links">
              {profileExtended.github ? <a href={profileExtended.github} target="_blank" rel="noreferrer">GitHub</a> : null}
              {profileExtended.linkedin ? <a href={profileExtended.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : null}
              {profileExtended.portfolio ? <a href={profileExtended.portfolio} target="_blank" rel="noreferrer">Portfolio</a> : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
