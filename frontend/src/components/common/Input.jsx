import "../../styles/components/Input.css";

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}) {
  return (
    <div className={`input-group ${className}`}>
      {label ? <label className="input-label">{label}</label> : null}
      <div className={`input-wrapper ${error ? "input-error" : ""}`}>
        {icon ? <span className="input-icon">{icon}</span> : null}
        <input className="input-field" {...props} />
      </div>
      {error ? <span className="input-error-msg">{error}</span> : null}
    </div>
  );
}
