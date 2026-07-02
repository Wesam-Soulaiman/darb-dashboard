import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  cacheDir: ".vite-cache",
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",

      includeAssets: [
        "favicon.ico",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "firebase-messaging-sw.js",
      ],

      manifest: {
        name: "Public Transportation Dashboard",
        short_name: "Transport",
        description: "Public Transportation Dashboard",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        importScripts: ["/firebase-messaging-sw.js"],
      },
    }),
  ],

  build: {
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/");

          if (!normalizedId.includes("/node_modules/")) {
            return undefined;
          }

          if (normalizedId.includes("/node_modules/@mui/icons-material/")) {
            return "mui-icons";
          }

          if (normalizedId.includes("/node_modules/@mui/x-")) {
            return "mui-x";
          }

          if (
            normalizedId.includes("/node_modules/@mui/material/") ||
            normalizedId.includes("/node_modules/@mui/system/") ||
            normalizedId.includes("/node_modules/@mui/utils/") ||
            normalizedId.includes("/node_modules/@emotion/")
          ) {
            return "mui-core";
          }

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/") ||
            normalizedId.includes("/node_modules/react-router/") ||
            normalizedId.includes("/node_modules/react-router-dom/")
          ) {
            return "react-vendor";
          }

          if (
            normalizedId.includes("/node_modules/leaflet/") ||
            normalizedId.includes("/node_modules/react-leaflet/")
          ) {
            return "map-vendor";
          }

          if (normalizedId.includes("/node_modules/@fullcalendar/")) {
            return "calendar-vendor";
          }

          if (
            normalizedId.includes("/node_modules/socket.io-client/") ||
            normalizedId.includes("/node_modules/engine.io-client/")
          ) {
            return "socket-vendor";
          }

          if (normalizedId.includes("/node_modules/@tanstack/react-query/")) {
            return "query-vendor";
          }

          if (
            normalizedId.includes("/node_modules/react-hook-form/") ||
            normalizedId.includes("/node_modules/@hookform/") ||
            normalizedId.includes("/node_modules/zod/")
          ) {
            return "forms-vendor";
          }

          if (
            normalizedId.includes("/node_modules/i18next/") ||
            normalizedId.includes("/node_modules/react-i18next/")
          ) {
            return "i18n-vendor";
          }

          if (normalizedId.includes("/node_modules/dayjs/")) {
            return "date-vendor";
          }

          return undefined;
        },
      },
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
