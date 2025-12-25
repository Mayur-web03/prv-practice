import { useParams } from "react-router-dom";
import products from "../data/product.js";
import ProductGrid from "../components/product/ProductGrid";

const Catalogue = () => {
  const { category } = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <section style={{ padding: "120px 6%" }}>
      <h1 style={{ marginBottom: "40px", textTransform: "capitalize" }}>
        {category.replace("-", " ")}
      </h1>

      <ProductGrid products={filteredProducts} />
    </section>
  );
};

export default Catalogue;
