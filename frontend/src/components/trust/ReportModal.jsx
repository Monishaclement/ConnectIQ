import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { REPORT_REASONS } from "../../utils/constants";
import "../../styles/components/ReportModal.css";

export default function ReportModal({ isOpen, onClose, onSubmit, userName }) {
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit({ reason, description });
    setLoading(false);
    setReason("spam");
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report ${userName || "User"}`}>
      <div className="report-form">
        <label className="report-label">Reason</label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="report-select"
        >
          {REPORT_REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        <label className="report-label">Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional details..."
          className="report-textarea"
          rows={4}
        />

        <div className="report-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={handleSubmit}>
            Submit Report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
