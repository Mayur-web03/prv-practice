import bath from "../assets/images/categories/bath.png";
import mixers from "../assets/images/categories/mixers.png";
import crafts from "../assets/images/categories/crafts.png";
import wellness from "../assets/images/categories/wellness.png";

// Category slugs must match the `category` field in data/product.js
const categories = [
  { title: "Bath Fittings", slug: "bath-fittings", image: bath },
  { title: "PRV Mixers", slug: "mixers", image: mixers },
  { title: "PRV Crafts", slug: "crafts", image: crafts },
  { title: "Health & Wellness", slug: "wellness", image: wellness },
];

export default categories;