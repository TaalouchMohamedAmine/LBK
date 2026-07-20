import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const BACKEND = "http://localhost:3000";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy all /api/* requests → backend
      "/api": {
        target: BACKEND,
        changeOrigin: true,
      },
      // Socket.io
      "/socket.io": {
        target: BACKEND,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
