import { Link, useParams } from "react-router-dom";
import products from "../data/product.js";
import ProductGrid from "../components/product/ProductGrid";
import "./Catalogue.css";

// "bath-fittings" -> "bath fittings" (all hyphens, not just the first)
const toTitle = (slug = "") => slug.replace(/-/g, " ");

const Catalogue = () => {
  const { category } = useParams();
  const title = toTitle(category);

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <>
      <title>{`${title} | PRV Bath Fittings`}</title>

      <section className="section catalogue">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Catalogue</span>
            <h1 className="section-title catalogue-title">{title}</h1>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="catalogue-empty" role="status">
              <p>No products are listed in this category yet.</p>
              <Link to="/dealer" className="btn btn--primary">
                Find a Dealer
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Catalogue;