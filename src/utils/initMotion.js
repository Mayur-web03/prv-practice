// Call once before React renders (src/main.jsx).
// Hidden-until-revealed styling is ONLY enabled when it is safe:
//  - the browser supports IntersectionObserver
//  - the user has not asked for reduced motion
export default function initMotion() {
  if (typeof window === "undefined") return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supported = "IntersectionObserver" in window;

  if (supported && !reduce) {
    document.documentElement.classList.add("motion-ready");
  }
}