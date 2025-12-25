import { useState, useEffect } from "react";
import "./HeroSlider.css";

const slides = [
  {
    image: "/src/assets/images/hero/slider1.png",
    title: "Precision Engineering",
    subtitle: "Innovative solutions built with expertise and care"
  },
  {
    image: "/src/assets/images/hero/slider2.png",
    title: "Health with Water",
    subtitle: "Supporting everyday wellness through intelligent hydration"
  }
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
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
