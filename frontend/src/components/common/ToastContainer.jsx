import { useToast } from "../../context/ToastContext";
import "../../styles/components/Toast.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} animate-slide-in`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="toast-icon">
            {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
          </span>
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
