import { Link, useParams } from "react-router-dom";
import products from "../data/product";
import "./ProductDetail.css";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ProductDetail() {
  const { slug } = useParams();

  const product = products.find(
    (item) => slugify(item.name) === slug
  );

  if (!product) {
    return (
      <section className="product-detail">
        <div className="product-detail__container">
          <h1>Product Not Found</h1>
          <p>The product you are looking for is unavailable.</p>
          <Link to="/catalogue/bath-fittings" className="btn btn--primary">
            Back to Catalogue
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <div className="product-detail__container">
        <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/catalogue/${product.category}`}>Catalogue</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail__grid">
          <div className="product-detail__image-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail__image"
            />
          </div>

          <div className="product-detail__content">
            <p className="product-detail__category">
              {product.category.replace(/-/g, " ")}
            </p>

            <h1>{product.name}</h1>

            <p className="product-detail__price">
              {product.price}
            </p>

            <p className="product-detail__description">
              Explore quality and reliable products from PRV Bath Fittings.
              Contact our team for product specifications, availability,
              dealer pricing and further details.
            </p>

            <div className="product-detail__actions">
              <Link
                to={`/contact?product=${encodeURIComponent(product.name)}`}
                className="btn btn--primary"
              >
                Enquire Now
              </Link>

              <Link
                to={`/catalogue/${product.category}`}
                className="btn btn--secondary"
              >
                Back to Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;