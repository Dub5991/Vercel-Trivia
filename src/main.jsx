// filepath: c:\Users\Snell\Downloads\vercel-trivia\src\main.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css"; // Correct path to styles.css
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);