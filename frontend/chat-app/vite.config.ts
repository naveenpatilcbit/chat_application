import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Change this to your desired port
    // You can also use process.env.PORT to make it configurable:
    // port: parseInt(process.env.PORT || "3001"),
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@pages": path.resolve(__dirname, "src/pages"),
    },
  },
});
