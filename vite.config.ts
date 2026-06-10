import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const proxyTarget = env.VITE_PROXY_TARGET;

  return {
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

    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : undefined,
    },
  };
});
