import { Link } from "react-router-dom";
import "./Footer.css";
import { productLinks, primaryLinks } from "../../data/navigation";

const Footer = () => {
  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-wordmark">
              PRV
            </Link>
            <p className="footer-tagline">Precision. Craft. Trust.</p>
          </div>

          <nav aria-labelledby="footer-products">
            <h2 id="footer-products" className="footer-heading">
              Products
            </h2>
            <ul className="footer-list">
              {productLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-support">
            <h2 id="footer-support" className="footer-heading">
              Support
            </h2>
            <ul className="footer-list">
              {primaryLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PRV Bath Fittings</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;