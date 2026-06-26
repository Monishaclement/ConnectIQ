import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useToast } from "../context/ToastContext";
import { getRecommendations } from "../api/userApi";
import { reportUser } from "../api/reportApi";
import SearchBar from "../components/common/SearchBar";
import RecommendationCard from "../components/recommendation/RecommendationCard";
import ReportModal from "../components/trust/ReportModal";
import EmptyState from "../components/common/EmptyState";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { useDebounce } from "../hooks/useDebounce";
import { INTENT_CATEGORIES } from "../utils/constants";
import { getUserIntents, getBlockedUsers, saveBlockedUsers } from "../utils/storage";
import "../styles/pages/Search.css";

export default function Search() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { sendRequest, connections } = useSocket();
  const { success, error: showError } = useToast();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [users, setUsers] = useState([]);
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sort, setSort] = useState("match");
  const [reportTarget, setReportTarget] = useState(null);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getRecommendations();
      setUsers(res.data || []);
      const allIntents = getUserIntents(user._id);
      setIntents(allIntents);
    } catch {
      showError("Failed to load search data");
    } finally {
      setLoading(false);
    }
  };

  const blocked = getBlockedUsers(user._id);
  const connectedIds = new Set(connections.accepted.map((c) => c.userId));
  const sentIds = new Set(connections.sent.map((s) => s.toUserId));

  const allSkills = [...new Set(users.flatMap((u) => u.user?.skills || []))];

  let filteredUsers = users.filter((r) => {
    const u = r.user;
    if (blocked.includes(u._id)) return false;
    if (u.riskScore > 70) return false;
    const q = debouncedQuery.toLowerCase();
    const matchQuery =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.skills?.some((s) => s.toLowerCase().includes(q)) ||
      u.interests?.some((i) => i.toLowerCase().includes(q)) ||
      u.location?.toLowerCase().includes(q);
    const matchSkill = !skillFilter || u.skills?.includes(skillFilter);
    const matchLocation = !locationFilter || u.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchQuery && matchSkill && matchLocation;
  });

  filteredUsers = [...filteredUsers].sort((a, b) => {
    if (sort === "trust") return (b.user.trustScore || 0) - (a.user.trustScore || 0);
    if (sort === "name") return (a.user.name || "").localeCompare(b.user.name || "");
    return (b.score || 0) - (a.score || 0);
  });

  const filteredIntents = intents.filter((i) => {
    const q = debouncedQuery.toLowerCase();
    const matchQuery =
      !q ||
      i.title?.toLowerCase().includes(q) ||
      i.description?.toLowerCase().includes(q) ||
      i.requiredSkills?.some((s) => s.toLowerCase().includes(q));
    const matchType = typeFilter === "all" || i.type === typeFilter;
    return matchQuery && matchType;
  });

  const handleReport = async ({ reason, description }) => {
    try {
      await reportUser({ reportedUserId: reportTarget._id, reason, description });
      success("User reported successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to report");
    }
  };

  const handleBlock = (userId) => {
    const updated = [...blocked, userId];
    saveBlockedUsers(user._id, updated);
    success("User blocked");
    loadData();
  };

  const showUsers = typeFilter === "all" || typeFilter === "users";
  const showIntents = typeFilter === "all" || typeFilter !== "users";

  return (
    <div className="page-container search-page animate-fade-in">
      <div className="page-header">
        <h1>Global Search</h1>
        <p>Search users, skills, and intents across ConnectIQ</p>
      </div>

      <div className="search-toolbar">
        <SearchBar value={query} onChange={setQuery} placeholder="Search users, skills, intents..." />
        <div className="search-filters">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Results</option>
            <option value="users">Users Only</option>
            {INTENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
            <option value="">All Skills</option>
            {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="search-location-input"
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="match">Best Match</option>
            <option value="trust">Trust Score</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <>
          {showUsers && filteredUsers.length > 0 ? (
            <section className="search-section">
              <h2>Users ({filteredUsers.length})</h2>
              <div className="search-users-grid">
                {filteredUsers.map((r) => (
                  <div key={r.user._id} className="search-user-wrap">
                    <RecommendationCard
                      userData={r}
                      score={r.score}
                      onConnect={sendRequest}
                      onReport={setReportTarget}
                      connected={connectedIds.has(r.user._id)}
                      sent={sentIds.has(r.user._id)}
                    />
                    <div className="trust-scores">
                      <Badge variant="primary">Trust: {r.user.trustScore ?? 50}</Badge>
                      <Badge variant={r.user.riskScore > 50 ? "danger" : "success"}>
                        Risk: {r.user.riskScore ?? 0}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleBlock(r.user._id)}>
                        Block
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {showIntents && filteredIntents.length > 0 ? (
            <section className="search-section">
              <h2>Intents ({filteredIntents.length})</h2>
              <div className="search-intents-list">
                {filteredIntents.map((i) => {
                  const cat = INTENT_CATEGORIES.find((c) => c.value === i.type);
                  return (
                    <div key={i._id} className="search-intent-item card">
                      <Badge variant="primary">{cat?.icon} {cat?.label}</Badge>
                      <h3>{i.title}</h3>
                      <p>{i.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {!filteredUsers.length && !filteredIntents.length ? (
            <EmptyState icon="🔍" title="No results found" description="Try different search terms or filters" />
          ) : null}
        </>
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
