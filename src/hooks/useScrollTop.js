import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// On route change: jump to a #section if the link has one, otherwise to the top.
const useScrollTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
};

export default useScrollTop;