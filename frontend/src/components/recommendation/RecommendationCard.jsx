import Avatar from "../common/Avatar";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { getSkillMatch } from "../../utils/profileCompletion";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import "../../styles/components/RecommendationCard.css";

export default function RecommendationCard({
  userData,
  score,
  onConnect,
  onReport,
  connected,
  sent,
}) {
  const { user } = useAuth();
  const { isOnline } = useSocket();
  const targetUser = userData?.user || userData;
  const skillMatch = getSkillMatch(user?.skills, targetUser?.skills);

  return (
    <div className="rec-card card animate-fade-in">
      <div className="rec-card-top">
        <Avatar
          src={targetUser?.profileImage}
          name={targetUser?.name}
          size="lg"
          online={isOnline(targetUser?._id)}
        />
        <div className="rec-match">
          <span className="rec-match-value">{score ?? 0}%</span>
          <span className="rec-match-label">Match</span>
        </div>
      </div>

      <h3 className="rec-name">{targetUser?.name}</h3>
      <p className="rec-location">{targetUser?.location || "Location not set"}</p>

      <div className="rec-scores">
        <div className="rec-score-item">
          <span>Skill Match</span>
          <strong>{skillMatch}%</strong>
        </div>
        <div className="rec-score-item">
          <span>Trust Score</span>
          <strong>{targetUser?.trustScore ?? 50}</strong>
        </div>
      </div>

      {targetUser?.skills?.length ? (
        <div className="rec-skills">
          {targetUser.skills.slice(0, 4).map((s) => (
            <Badge key={s} variant="primary">{s}</Badge>
          ))}
        </div>
      ) : null}

      <div className="rec-actions">
        {connected ? (
          <Badge variant="success">Connected</Badge>
        ) : sent ? (
          <Badge variant="warning">Request Sent</Badge>
        ) : (
          <Button size="sm" onClick={() => onConnect(targetUser?._id)}>
            Connect
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onReport(targetUser)}>
          Report
        </Button>
      </div>
    </div>
  );
}
