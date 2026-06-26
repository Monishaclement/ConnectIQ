import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import { getRecommendations } from "../api/userApi";
import { reportUser } from "../api/reportApi";
import RecommendationCard from "../components/recommendation/RecommendationCard";
import ReportModal from "../components/trust/ReportModal";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import { CardSkeleton } from "../components/common/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { SORT_OPTIONS } from "../utils/constants";
import { getBlockedUsers } from "../utils/storage";
import "../styles/pages/Recommendations.css";

export default function Recommendations() {
  const { user } = useAuth();
  const { sendRequest, connections } = useSocket();
  const { success, error: showError } = useToast();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("match");
  const [reportTarget, setReportTarget] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    try {
      const res = await getRecommendations();
      setRecommendations(res.data || []);
    } catch {
      showError("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  const blocked = getBlockedUsers(user._id);
  const connectedIds = new Set(connections.accepted.map((c) => c.userId));
  const sentIds = new Set(connections.sent.map((s) => s.toUserId));

  let filtered = recommendations.filter((r) => {
    const u = r.user;
    if (blocked.includes(u._id)) return false;
    if (u.riskScore > 70) return false;
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.skills?.some((s) => s.toLowerCase().includes(q)) ||
      u.location?.toLowerCase().includes(q)
    );
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "trust") return (b.user.trustScore || 0) - (a.user.trustScore || 0);
    if (sort === "name") return (a.user.name || "").localeCompare(b.user.name || "");
    return (b.score || 0) - (a.score || 0);
  });

  const handleConnect = (userId) => {
    sendRequest(userId);
    success("Connection request sent!");
  };

  const handleReport = async ({ reason, description }) => {
    try {
      await reportUser({
        reportedUserId: reportTarget._id,
        reason,
        description,
      });
      success("User reported successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to report user");
    }
  };

  return (
    <div className="page-container rec-page animate-fade-in">
      <div className="page-header">
        <h1>Recommended Users</h1>
        <p>People matched based on your skills, interests, and trust scores</p>
      </div>

      <div className="rec-toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, skill, location..." />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rec-sort">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>Sort: {o.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rec-grid">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="✨" title="No recommendations" description="Complete your profile to get better matches" />
      ) : (
        <div className="rec-grid">
          {filtered.map((r) => (
            <RecommendationCard
              key={r.user._id}
              userData={r}
              score={r.score}
              onConnect={handleConnect}
              onReport={setReportTarget}
              connected={connectedIds.has(r.user._id)}
              sent={sentIds.has(r.user._id)}
            />
          ))}
        </div>
      )}

      <ReportModal
        isOpen={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={handleReport}
        userName={reportTarget?.name}
      />
    </div>
  );
}
