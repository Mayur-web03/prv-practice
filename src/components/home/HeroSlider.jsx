import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSlider.css";
import slider1 from "../../assets/images/hero/slider1.png";
import slider2 from "../../assets/images/hero/slider2.png";
import slider3 from "../../assets/images/hero/slider3.png";
import slider4 from "../../assets/images/hero/slider4.png";
import slider5 from "../../assets/images/hero/slider5.png";

// `focus` is the CSS object-position, so the product stays in view on narrow screens.
const slides = [
  {
    image: slider1,
    alt: "Rain shower above a dark stone bathroom with a floating basin",
    focus: "60% 50%",
    title: "Precision Engineering",
    subtitle: "Innovative solutions built with expertise and care",
  },
  {
    image: slider2,
    alt: "Chrome tap beside a bright window with small plants on shelves",
    focus: "38% 50%",
    title: "Health with Water",
    subtitle: "Supporting everyday wellness through intelligent hydration",
  },
  {
    image: slider3,
    alt: "Chrome wall-mounted bath mixer with hand shower on a dark panel",
    focus: "50% 40%",
    title: "Modern Bathroom Solutions",
    subtitle: "Designed for comfort and durability",
  },
  {
    image: slider4,
    alt: "Overhead rain shower lit from above in a dark bathroom",
    focus: "45% 50%",
    title: "Premium Shower Experience",
    subtitle: "Luxury design with flawless performance",
  },
  {
    image: slider5,
    alt: "Chrome basin tap on a white round basin against dark marble",
    focus: "44% 60%",
    title: "Elegant Basin Fittings",
    subtitle: "Minimal design with maximum functionality",
  },
];

const AUTOPLAY_MS = 6500;

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  // Only slides with position <= reach have their image in the DOM, so the
  // first paint downloads one image instead of five.
  const [reach, setReach] = useState(0);
  const [playing, setPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);

  const goTo = useCallback((next) => {
    setIndex(next);
    setReach((r) => Math.max(r, Math.min(next + 1, slides.length - 1)));
  }, []);

  // Auto-advance; pauses on hover, keyboard focus, or when the user pauses it
  useEffect(() => {
    if (!playing || hovering || focusWithin) return;
    const id = setTimeout(() => goTo((index + 1) % slides.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, playing, hovering, focusWithin, goTo]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
      }}
    >
      <div aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.title}
              className={`hero-slide${active ? " is-active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!active}
              inert={!active}
            >
              {i <= reach && (
                <img
                  className="hero-image"
                  src={slide.image}
                  alt={slide.alt}
                  style={{ objectPosition: slide.focus }}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  onLoad={
                    i === 0
                      ? () => setReach((r) => Math.max(r, 1))
                      : undefined
                  }
                />
              )}
              <div className="hero-overlay" />

              <div className="container hero-copy">
                <span className="eyebrow">PRV Bath Fittings</span>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <div className="hero-actions">
                  <Link to="/catalogue/bath-fittings" className="btn btn--light">
                    Explore Products
                  </Link>
                  <Link to="/dealer" className="btn btn--outline-light">
                    Find a Dealer
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-controls">
        <div className="container hero-controls-inner">
          <button
            type="button"
            className="hero-pause"
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <rect x="2" y="1" width="3.5" height="12" />
                <rect x="8.5" y="1" width="3.5" height="12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1l10 6-10 6z" />
              </svg>
            )}
          </button>

          <div className="hero-dots" role="group" aria-label="Choose slide">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                className="hero-dot"
                aria-label={`Show slide ${i + 1}: ${slide.title}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;