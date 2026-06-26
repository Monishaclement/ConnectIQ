import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import "../styles/pages/NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content animate-fade-in">
        <span className="not-found-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="not-found-actions">
          <Link to="/"><Button variant="secondary">Go Home</Button></Link>
          <Link to="/dashboard"><Button>Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}

export function ErrorPage({ message = "Something went wrong" }) {
  return (
    <div className="not-found-page">
      <div className="not-found-content animate-fade-in">
        <span className="not-found-icon">⚠️</span>
        <h1>Oops!</h1>
        <p>{message}</p>
        <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    </div>
  );
}
