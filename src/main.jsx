import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

// The accidental standalone About page was removed; replace old bookmarks
// before mounting the app so they do not create a second home-page address.
if (["/about", "/about/"].includes(window.location.pathname)) {
  window.location.replace("/");
} else {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
