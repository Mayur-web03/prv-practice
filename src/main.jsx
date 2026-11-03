import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css"; // tokens first
import "./index.css"; // base + shared primitives
import App from "./App.jsx";
import './styles/motion.css';          // after your global css import
import initMotion from './utils/initMotion';
initMotion();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);