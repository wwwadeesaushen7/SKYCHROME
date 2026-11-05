import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("three-")) return "three";
          if (id.includes("index-6u7WIUD-")) return "accounts";
        },
      },
    },
  },
});
