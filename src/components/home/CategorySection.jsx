import { Link } from "react-router-dom";
import "./CategorySection.css";
import categories from "../../data/categories";

const CategorySection = () => {
  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Collections</span>
          <h2 id="categories-title" className="section-title">
            Explore by category
          </h2>
          <p className="section-lead">Browse the PRV range by category.</p>
        </div>

        <ul className="category-grid">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link to={`/catalogue/${cat.slug}`} className="category-card">
                <span className="category-media frame">
                  <img src={cat.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="category-title">{cat.title}</span>
                <span className="category-cta">
                  Explore <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategorySection;