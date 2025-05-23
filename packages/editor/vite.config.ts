import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from "node:path";
import tailwind from "@tailwindcss/vite"
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind(), dts({tsconfigPath: "./tsconfig.app.json"})],
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "@darkwrite/ui", "lucide-react", "i18next", "react-i18next"]
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      cssFileName: "editor"
    },
    emptyOutDir: false
  },
  resolve: {
    alias: {
      "@": resolve("src/"),
    }
  }
})
