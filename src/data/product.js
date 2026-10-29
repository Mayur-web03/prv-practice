
import tap1 from "../assets/images/products/tap1.png";
import tap2 from "../assets/images/products/tap2.png";
import mixer1 from "../assets/images/products/mixer1.png";
import craft1 from "../assets/images/products/craft1.png";

const products = [
  {
    id: 1,
    slug: "prv-wall-mixer",
    name: "PRV Wall Mixer",
    category: "bath-fittings",
    price: "₹4,999",
    image: tap1,
  },
  {
    id: 2,
    slug: "prv-basin-tap",
    name: "PRV Basin Tap",
    category: "bath-fittings",
    price: "₹3,499",
    image: tap2,
  },
  {
    id: 3,
    slug: "prv-concealed-mixer",
    name: "PRV Concealed Mixer",
    category: "mixers",
    price: "₹6,999",
    image: mixer1,
  },
  {
    id: 4,
    slug: "prv-cutting-wheel",
    name: "PRV Cutting Wheel",
    category: "crafts",
    price: "₹1,299",
    image: craft1,
  },
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export default products;
