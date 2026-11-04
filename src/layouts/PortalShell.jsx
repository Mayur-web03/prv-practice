import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { ROLE_LABELS } from "../auth/roles";

export default function PortalShell({ title, nav, loginPath }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close drawer on navigation and on Escape.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(loginPath, { replace: true });
  };

  const items = nav.filter((n) => !n.roles || n.roles.includes(user.role));

  return (
    <div className="portal">
      <a className="skip-link" href="#portal-main">
        Skip to content
      </a>

      <aside className={`portal-sidebar ${open ? "is-open" : ""}`} aria-label={`${title} navigation`}>
        <div className="portal-brand">
          <span>PRV</span>
          <small>{title}</small>
        </div>
        <nav>
          {items.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `portal-link ${isActive ? "active" : ""}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/" className="portal-link portal-back">
          ← Public website
        </NavLink>
      </aside>

      {open && <div className="portal-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="portal-body">
        <header className="portal-topbar">
          <button
            type="button"
            className="portal-menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ☰
          </button>
          <div className="portal-user">
            <div>
              <strong>{user.company || user.name}</strong>
              <small>{ROLE_LABELS[user.role]}</small>
            </div>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </header>

        <main id="portal-main" tabIndex={-1} className="portal-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

