import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        color: "#aaa",
        padding: "60px 6%",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "40px",
        }}
      >
        <div>
          <h4 style={{ color: "#d4af37" }}>PRV</h4>
          <p>Precision. Craft. Trust.</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Become Dealer</p>
          <p>Catalogue</p>
          <p>Contact Us</p>
        </div>

        <div>
          <h4>Message</h4>
          <p>Thank you for visiting our site.</p>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "40px", fontSize: "12px" }}>
        © {new Date().getFullYear()} PRV Bath Fittings
      </p>
    </footer>
  );
};

export default Footer;
