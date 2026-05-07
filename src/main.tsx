import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "leaflet/dist/leaflet.css";

import App from "./App";
import AppProviders from "./providers/AppProviders";
import "./i18n";


registerSW({
  immediate: true,

  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);
  },

  onRegisterError(error) {
    console.error("Service worker registration failed:", error);
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);