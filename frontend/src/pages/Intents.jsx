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
  }, [user]);

  const loadIntents = () => {
    const mine = getUserIntents(user._id);
    const allUsers = getStorage("connectiq_intents", {});
    const allIntents = Object.entries(allUsers).flatMap(([uid, items]) =>
      items.map((i) => ({ ...i, userId: uid, userName: uid === user._id ? user.name : i.userName || "User" }))
    );
    setIntents(allIntents.length ? allIntents : mine.map((i) => ({ ...i, userId: user._id, userName: user.name })));
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

  const handleSave = () => {
    if (!form.title.trim()) {
      showError("Title is required");
      return;
    }
    const intentData = {
      _id: editing?._id || `intent_${Date.now()}`,
      type: form.type,
      title: form.title,
      description: form.description,
      requiredSkills: parseTags(form.requiredSkills),
      isActive: true,
      createdAt: editing?.createdAt || new Date().toISOString(),
      userName: user.name,
    };

    const mine = getUserIntents(user._id);
    const updated = editing
      ? mine.map((i) => (i._id === editing._id ? intentData : i))
      : [...mine, intentData];
    saveUserIntents(user._id, updated);
    loadIntents();
    setModalOpen(false);
    success(editing ? "Intent updated!" : "Intent created!");
  };

  const handleDelete = (id) => {
    const mine = getUserIntents(user._id).filter((i) => i._id !== id);
    saveUserIntents(user._id, mine);
    loadIntents();
    success("Intent deleted");
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
