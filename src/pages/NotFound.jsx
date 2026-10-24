import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="section page-offset">
      <title>Page not found | PRV Bath Fittings</title>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">404</span>
          <h1 className="section-title">We couldn’t find that page</h1>
          <p className="section-lead">
            The link may be out of date. Try browsing our products instead.
          </p>
        </div>
        <Link to="/catalogue/bath-fittings" className="btn btn--primary">
          Browse products
        </Link>
      </div>
    </section>
  );
};

export default NotFound;