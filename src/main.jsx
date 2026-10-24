import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.css"; // tokens first
import "./index.css"; // base + shared primitives
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);