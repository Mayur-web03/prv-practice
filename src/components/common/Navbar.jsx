import React, { useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/images/categories/logo.png";
import SideMenu from "./SideMenu";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
        setRotate(true);
      } else {
        setScrolled(false);
        setRotate(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        
        {/* MENU */}
        <button
          className="navbar-menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        {/* LOGO */}
        <div className="navbar-logo">
          <img
            src={logo}
            alt="PRV"
            style={{
              transform: rotate ? "rotate(360deg)" : "rotate(0deg)",
            }}
          />
        </div>

        {/* CTA */}
        <button className="navbar-cta">Find Dealer</button>
      </nav>

      {/* SIDE MENU */}
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;
