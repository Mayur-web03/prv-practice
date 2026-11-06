import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css"; // tokens first
import "./index.css"; // base + shared primitives
import "./styles/portal.css"; // dealer + admin portal styles
import App from "./App.jsx";
import "./styles/motion.css";
import initMotion from "./utils/initMotion";
initMotion();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
