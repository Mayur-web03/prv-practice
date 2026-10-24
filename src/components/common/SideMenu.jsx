import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import "./SideMenu.css";
import { productLinks, primaryLinks } from "../../data/navigation";

const linkClass = ({ isActive }) =>
  `side-menu-link${isActive ? " is-active" : ""}`;

const SideMenu = ({ open, onClose, onNavigate }) => {
  const asideRef = useRef(null);
  const closeRef = useRef(null);

  // Escape to close, lock page scroll, move focus into the drawer
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Keep Tab / Shift+Tab inside the open drawer
  const trapFocus = (e) => {
    if (e.key !== "Tab") return;

    const items = asideRef.current?.querySelectorAll("a[href], button:not([disabled])");
    if (!items || !items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <div
        className={`menu-overlay${open ? " show" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu"
        ref={asideRef}
        className={`side-menu${open ? " open" : ""}`}
        aria-label="Site menu"
        inert={!open}
        onKeyDown={trapFocus}
      >
        <div className="side-menu-head">
          <span className="side-menu-title">Menu</span>
          <button
            ref={closeRef}
            type="button"
            className="side-menu-close"
            aria-label="Close menu"
            onClick={onClose}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <nav aria-label="Mobile">
          <p className="side-menu-group">Products</p>
          <ul className="side-menu-list">
            {productLinks.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <ul className="side-menu-list side-menu-list--main">
            {primaryLinks.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass} onClick={onNavigate}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/dealer"
          className="btn btn--primary side-menu-cta"
          onClick={onNavigate}
        >
          Find a Dealer
        </Link>
      </aside>
    </>
  );
};

export default SideMenu;