import "./Dealer.css";
import DealerList from "../components/dealer/DealerList";
import DealerApplicationForm from "../components/dealer/DealerApplicationForm";
import Reveal from "../components/common/Reveal";

const Dealer = () => {
  return (
    <>
      <title>Dealers | PRV Bath Fittings</title>

      {/* Above the fold: intentionally NOT revealed, so it paints immediately */}
      <section className="page-offset dealer-intro">
        <div className="container">
          <span className="eyebrow">Dealers</span>
          <h1 className="dealer-title">Find a PRV dealer</h1>
          <p className="section-lead">
            Browse our dealers by city, or apply to become one.
          </p>
          <a href="#become-a-dealer" className="link-arrow dealer-jump">
            Become a dealer <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <DealerList />

      <section
        id="become-a-dealer"
        className="section section--stone"
        aria-labelledby="apply-title"
      >
        <div className="container apply">
          <Reveal className="apply-intro">
            <span className="eyebrow">Partner with us</span>
            <h2 id="apply-title" className="section-title">
              Become a PRV dealer
            </h2>
            <p className="section-lead">
              Tell us about your business. Our team reviews every application
              and contacts you using the details you provide.
            </p>
          </Reveal>

          {/* Form stays static: no animation between the user and typing */}
          <DealerApplicationForm />
        </div>
      </section>
    </>
  );
};

export default Dealer;