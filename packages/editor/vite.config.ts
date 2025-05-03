import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from "node:path";
import tailwind from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "@darkwrite/ui", "lucide-react"]
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
    }
  },
  resolve: {
    alias: {
      "@": resolve("src/"),
    }
  }
})
