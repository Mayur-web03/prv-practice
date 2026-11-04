import { Link } from "react-router-dom";

export function LoadingView({ label = "Loading…" }) {
  return (
    <div className="state-view" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function Skeleton({ lines = 3 }) {
  return (
    <div className="skeleton-group" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="skeleton" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function EmptyView({ title, text, action }) {
  return (
    <div className="state-view">
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function ErrorView({ message, onRetry }) {
  return (
    <div className="state-view state-error" role="alert">
      <h3>Couldn't load this</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function PermissionDenied() {
  return (
    <div className="state-view state-error" role="alert">
      <h3>You don't have access to this page</h3>
      <p>If you think this is a mistake, contact your administrator.</p>
      <Link className="btn btn-outline" to="/">
        Back to website
      </Link>
    </div>
  );
}

