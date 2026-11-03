import { useEffect, useRef } from "react";

// One shared observer for the whole app (cheaper than one per element).
let observer = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // data attribute (not className) so React re-renders cannot undo it
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target); // reveal once, never again
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  return observer;
}

export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = getObserver();
    if (!io) {
      el.setAttribute("data-revealed", ""); // no observer => show immediately
      return undefined;
    }

    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return ref;
}