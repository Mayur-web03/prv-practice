import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { isAdminRole } from "../../auth/roles";

export default function LoginPage({ area }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const home = area === "admin" ? "/admin" : "/dealer-portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user && (area === "admin" ? isAdminRole(user.role) : user.role === "dealer")) {
    return <Navigate to={home} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await login(email, password, area);
      const from = location.state?.from;
      navigate(from && from.startsWith(home) ? from : home, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-wrap" id="main">
      <form className="login-card" onSubmit={submit} noValidate>
        <h1>{area === "admin" ? "Staff sign in" : "Dealer sign in"}</h1>
        <p className="muted">
          {area === "admin" ? "Admin portal for PRV staff." : "Place and track your orders."}
        </p>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="muted small">
          <Link to="/">← Back to website</Link>
        </p>

        {import.meta.env.VITE_USE_MOCK !== "false" && (
          <p className="muted small">
            Dev logins: dealer@prv.test / dealer123 · admin@prv.test / admin123
          </p>
        )}
      </form>
    </main>
  );
}

