import "../../styles/components/SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`search-bar ${className}`}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value ? (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
