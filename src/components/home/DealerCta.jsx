import { Link } from "react-router-dom";
import "./DealerCta.css";

const DealerCta = () => {
  return (
    <section className="section" aria-labelledby="dealer-cta-title">
      <div className="container dealer-cta">
        <div>
          <span className="eyebrow">Dealers</span>
          <h2 id="dealer-cta-title" className="section-title">
            Find a PRV dealer
          </h2>
          <p className="section-lead">
            Talk to us about where to see PRV fittings and how to choose the
            right ones.
          </p>
        </div>

        <div className="dealer-cta-actions">
          <Link to="/dealer" className="btn btn--primary">
            Find a Dealer
          </Link>
          <Link to="/contact" className="btn btn--secondary">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealerCta;