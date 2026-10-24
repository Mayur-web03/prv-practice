import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/images/categories/logo.png";
import SideMenu from "./SideMenu";
import { productLinks, primaryLinks } from "../../data/navigation";

const SCROLL_THRESHOLD = 40;

const linkClass = ({ isActive }) => `nav-link${isActive ? " is-active" : ""}`;

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const toggleRef = useRef(null);
  const dropdownRef = useRef(null);

  // Scrolled state (passive listener, only updates when the value changes)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the Products dropdown on outside click or Escape
  useEffect(() => {
    if (!productsOpen) return;

    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        dropdownRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [productsOpen]);

  // Close drawer and return focus to the menu button
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close drawer after navigating (do not steal focus)
  const closeMenuOnNavigate = useCallback(() => setMenuOpen(false), []);

  // Hover opens the dropdown for mouse users only; touch and keyboard use click
  const onPointerEnter = (e) => {
    if (e.pointerType === "mouse") setProductsOpen(true);
  };
  const onPointerLeave = (e) => {
    if (e.pointerType === "mouse") setProductsOpen(false);
  };
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setProductsOpen(false);
  };

  const overlay = isHome && !scrolled;
  const inCatalogue = pathname.startsWith("/catalogue");

  return (
    <>
      <header
        className={`navbar${overlay ? " navbar--overlay" : ""}${scrolled ? " is-scrolled" : ""}`}
      >
        <div className="navbar-inner">
          <button
            ref={toggleRef}
            type="button"
            className="navbar-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="navbar-toggle-bars" aria-hidden="true" />
          </button>

          <Link to="/" className="navbar-logo">
            <img src={logo} alt="PRV home" width="145" height="56" />
          </Link>

          <nav className="navbar-links" aria-label="Primary">
            <div
              className="nav-dropdown"
              ref={dropdownRef}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              onBlur={onBlur}
            >
              <button
                type="button"
                className={`nav-link nav-dropdown-trigger${inCatalogue ? " is-active" : ""}`}
                aria-expanded={productsOpen}
                aria-controls="products-menu"
                onClick={() => setProductsOpen((v) => !v)}
              >
                Products
                <span className="nav-chevron" aria-hidden="true" />
              </button>

              <div
                id="products-menu"
                className={`nav-panel${productsOpen ? " open" : ""}`}
              >
                <ul className="nav-panel-inner">
                  {productLinks.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `nav-panel-link${isActive ? " is-active" : ""}`
                        }
                        onClick={() => setProductsOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {primaryLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/dealer"
            className="btn btn--primary navbar-cta"
            aria-label="Find a Dealer"
          >
            <span className="cta-long" aria-hidden="true">Find a Dealer</span>
            <span className="cta-short" aria-hidden="true">Dealers</span>
          </Link>
        </div>
      </header>

      <SideMenu
        open={menuOpen}
        onClose={closeMenu}
        onNavigate={closeMenuOnNavigate}
      />
    </>
  );
};

export default Navbar;