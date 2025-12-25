import { useState, useEffect } from "react";
import "./HeroSlider.css";
import slider1 from "../../assets/images/hero/slider1.png";
import slider2 from "../../assets/images/hero/slider2.png";
import slider3 from "../../assets/images/hero/slider3.png";
import slider4 from "../../assets/images/hero/slider4.png";
import slider5 from "../../assets/images/hero/slider5.png";

const slides = [
  {
    image: slider1,
    title: "Precision Engineering",
    subtitle: "Innovative solutions built with expertise and care",
  },
  {
    image: slider2,
    title: "Health with Water",
    subtitle: "Supporting everyday wellness through intelligent hydration",
  },
  {
    image: slider3,
    title: "Modern Bathroom Solutions",
    subtitle: "Designed for comfort and durability",
  },
  {
    image: slider4,
    title: "Premium Shower Experience",
    subtitle: "Luxury design with flawless performance",
  },
  {
    image: slider5,
    title: "Elegant Basin Fittings",
    subtitle: "Minimal design with maximum functionality",
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${slides[index].image})` }}
      />

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>{slides[index].title}</h1>
        <p>{slides[index].subtitle}</p>
        <button>View Collection</button>
      </div>
    </section>
  );
};

export default HeroSlider;
