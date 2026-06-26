import "../../styles/components/Skeleton.css";

export default function Skeleton({ width, height, className = "", circle = false }) {
  return (
    <div
      className={`skeleton ${circle ? "skeleton-circle" : ""} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton circle width="48px" height="48px" />
      <div className="skeleton-card-content">
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="12px" />
        <Skeleton width="80%" height="12px" />
      </div>
    </div>
  );
}
