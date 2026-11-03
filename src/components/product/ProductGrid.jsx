import ProductCard from "./ProductCard";
import Reveal from "../common/Reveal";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  return (
    <ul className="product-grid">
      {products.map((product, index) => (
        // Stagger by column (index % 4) so later rows never wait long
        <Reveal as="li" key={product.id} delay={(index % 4) * 70}>
          {/* First row is above the fold on most screens: load it eagerly */}
          <ProductCard product={product} priority={index < 4} />
        </Reveal>
      ))}
    </ul>
  );
};

export default ProductGrid;