import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/GC-Sustainability-Updates/',
  plugins: [react(), vanillaExtractPlugin()],
});
