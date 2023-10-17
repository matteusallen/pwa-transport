// vite.config.ts
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    svgr(),
    VitePWA({
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: [
          "**/*",
      ],
      manifest: {
        "theme_color": "#F0941E",
        "background_color": "#000000",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "short_name": "truckyu",
        "description": "web app",
        "name": "truckyu web",
        "icons": [
            {
                "src": "/src/assets/images/Truckyu.svg",
                "sizes": "282x123",
                "type": "image/svg"
            }
        ],
      }
    }),
  ],
  define: {
    'process.env': {}
  },
  server: {
    host: true,
    port: 8000, // This is the port which we will use in docker
    // Thanks @sergiomoura for the window fix
    // add the next lines if you're using windows and hot reload doesn't work
     watch: {
       usePolling: true
     }
  }
});