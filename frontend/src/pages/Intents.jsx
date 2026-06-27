import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import IntentCard, { IntentCardWithUser } from "../components/intent/IntentCard";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import { INTENT_CATEGORIES } from "../utils/constants";
import { parseTags } from "../utils/formatters";
import { getUserIntents, saveUserIntents, getStorage } from "../utils/storage";
import {
  getIntents,
  createIntent,
  updateIntent,
  deleteIntent,
} from "../api/intentApi";
import { useToast } from "../context/ToastContext";
import "../styles/pages/Intents.css";

export default function Intents() {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [tab, setTab] = useState("browse");
  const [intents, setIntents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ type: "study", title: "", description: "", requiredSkills: "" });
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    loadIntents();
  }, [user, debouncedSearch, category]);

  const normalizeIntent = (intent) => ({
    ...intent,
    userId: intent.user?._id || intent.userId || intent.user,
    userName: intent.user?.name || intent.userName || "User",
  });

  const cacheMyIntents = (items) => {
    saveUserIntents(user._id, items.filter((i) => i.userId === user._id));
  };

  const loadIntents = async () => {
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;

      const res = await getIntents(params);
      const normalized = (res.data || []).map(normalizeIntent);
      setIntents(normalized);
      cacheMyIntents(normalized);
    } catch {
      const mine = getUserIntents(user._id);
      const allUsers = getStorage("connectiq_intents", {});
      const allIntents = Object.entries(allUsers).flatMap(([uid, items]) =>
        items.map((i) => ({ ...i, userId: uid, userName: uid === user._id ? user.name : i.userName || "User" }))
      );
      setIntents(allIntents.length ? allIntents : mine.map((i) => ({ ...i, userId: user._id, userName: user.name })));
      showError("Using saved intents because the server could not be reached");
    }
  };

  const myIntents = intents.filter((i) => i.userId === user._id);
  const browseIntents = intents.filter((i) => i.userId !== user._id && i.isActive !== false);

  const filterIntents = (list) =>
    list.filter((i) => {
      const matchSearch =
        !debouncedSearch ||
        i.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        i.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory = !category || i.type === category;
      return matchSearch && matchCategory;
    });

  const openCreate = () => {
    setEditing(null);
    setForm({ type: "study", title: "", description: "", requiredSkills: "" });
    setModalOpen(true);
  };

  const openEdit = (intent) => {
    setEditing(intent);
    setForm({
      type: intent.type,
      title: intent.title,
      description: intent.description || "",
      requiredSkills: intent.requiredSkills?.join(", ") || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showError("Title is required");
      return;
    }
    const intentData = {
      type: form.type,
      title: form.title,
      description: form.description,
      requiredSkills: parseTags(form.requiredSkills),
      isActive: true,
    };

    try {
      if (editing) {
        await updateIntent(editing._id, intentData);
      } else {
        await createIntent(intentData);
      }

      await loadIntents();
      setModalOpen(false);
      success(editing ? "Intent updated!" : "Intent created!");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save intent");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIntent(id);
      await loadIntents();
      success("Intent deleted");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete intent");
    }
  };

  const displayList = tab === "my" ? filterIntents(myIntents) : filterIntents(browseIntents);

  return (
    <div className="page-container intents-page animate-fade-in">
      <div className="intents-header">
        <div>
          <h1>Intents</h1>
          <p>Define what you&apos;re looking for and discover others</p>
        </div>
        <Button onClick={openCreate}>+ Create Intent</Button>
      </div>

      <div className="intents-toolbar">
        <div className="intents-tabs">
          <button className={tab === "browse" ? "active" : ""} onClick={() => setTab("browse")}>Browse</button>
          <button className={tab === "my" ? "active" : ""} onClick={() => setTab("my")}>My Intents</button>
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search intents..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="intents-filter">
          <option value="">All Categories</option>
          {INTENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {displayList.length === 0 ? (
        <EmptyState
          icon="🎯"
          title={tab === "my" ? "No intents yet" : "No intents found"}
          description={tab === "my" ? "Create your first intent to start matching" : "Try adjusting your search or filters"}
          action={tab === "my" ? <Button onClick={openCreate}>Create Intent</Button> : null}
        />
      ) : (
        <div className="intents-grid">
          {displayList.map((intent) =>
            tab === "my" ? (
              <IntentCard
                key={intent._id}
                intent={intent}
                isOwner
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ) : (
              <IntentCardWithUser key={intent._id} intent={intent} />
            )
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Intent" : "Create Intent"}>
        <div className="intent-form">
          <label className="intent-form-label">Category</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="intent-form-select">
            {INTENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Looking for a React study partner" />
          <label className="intent-form-label">Description</label>
          <textarea
            className="intent-form-textarea"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what you're looking for..."
            rows={4}
          />
          <Input label="Required Skills (comma separated)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
          <div className="intent-form-actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
