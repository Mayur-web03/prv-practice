import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the top whenever the route changes.
const useScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
};

export default useScrollTop;