
import ProductCard from "./ProductCard";
import Reveal from "../common/Reveal";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <Reveal
          key={product.id}
          delay={(index % 4) * 70}
        >
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
};

export default ProductGrid;
