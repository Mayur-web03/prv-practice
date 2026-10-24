import { Link } from "react-router-dom";
import "./InspirationSection.css";
import room from "../../assets/images/categories/wellness.png";

const InspirationSection = () => {
  return (
    <section
      className="section section--stone"
      aria-labelledby="inspiration-title"
    >
      <div className="container inspiration">
        <div className="inspiration-media frame">
          <img
            src={room}
            alt="Freestanding bathtub beside a window with greenery"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="inspiration-copy">
          <span className="eyebrow">Inspiration</span>
          <h2 id="inspiration-title" className="section-title">
            Fittings that complete the room
          </h2>
          <p className="section-lead">
            From the shower to the basin, the right fittings shape how a
            bathroom looks and feels. Explore the PRV range to find forms and
            finishes for your space.
          </p>
          <Link to="/catalogue/bath-fittings" className="link-arrow">
            Browse bath fittings <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;