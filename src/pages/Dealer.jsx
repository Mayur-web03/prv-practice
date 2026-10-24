import { Link } from "react-router-dom";

const Dealer = () => {
  return (
    <section className="section page-offset">
      <title>Dealers | PRV Bath Fittings</title>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Dealers</span>
          <h1 className="section-title">Find or become a PRV dealer</h1>
          <p className="section-lead">
            Our dealer directory and enquiry form are being prepared. In the
            meantime, please get in touch and we will point you in the right
            direction.
          </p>
        </div>
        <Link to="/contact" className="btn btn--primary">
          Contact us
        </Link>
      </div>
    </section>
  );
};

export default Dealer;