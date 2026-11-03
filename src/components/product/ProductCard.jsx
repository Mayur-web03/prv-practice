import "./ProductCard.css";

const ProductCard = ({ product, priority = false }) => {
  return (
    <article className="product-card">
      <div className="product-media frame motion-media">
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      <div className="product-info">
        <h2 className="product-name">{product.name}</h2>
        {product.price && <p className="product-price">{product.price}</p>}
      </div>
    </article>
  );
};

export default ProductCard;