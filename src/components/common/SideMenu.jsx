import "./SideMenu.css";
import { Link } from "react-router-dom";

const SideMenu = ({ open, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`menu-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`side-menu ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <nav className="menu-links">
          <Link to="/catalogue/bath-fittings" onClick={onClose}>
            Catalogue
          </Link>
          <Link to="/dealer" onClick={onClose}>
            Become Dealer
          </Link>
          <Link to="/contact" onClick={onClose}>
            Contact Us
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default SideMenu;
