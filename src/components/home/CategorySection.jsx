import { useNavigate } from "react-router-dom";
import "./CategorySection.css";

import bath from "../../assets/images/categories/bath.png";
import mixers from "../../assets/images/categories/mixers.png";
import crafts from "../../assets/images/categories/crafts.png";
import wellness from "../../assets/images/categories/wellness.png";

const categories = [
  { title: "Bath Fittings", image: bath, path: "bath-fittings" },
  { title: "PRV Mixers", image: mixers, path: "mixers" },
  { title: "PRV Crafts", image: crafts, path: "crafts" },
  { title: "Health & Wellness", image: wellness, path: "wellness" },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="category-section">
      {categories.map((cat) => (
        <div
          key={cat.title}
          className="category-card"
          onClick={() => navigate(`/catalogue/${cat.path}`)}
        >
          <img src={cat.image} alt={cat.title} />
          <div className="category-overlay">
            <h3>{cat.title}</h3>
            <span>Explore →</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default CategorySection;
