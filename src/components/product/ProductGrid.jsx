import ProductCard from "./ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="product-animate"
          style={{ animationDelay: `${index * 0.12}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
