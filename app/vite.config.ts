import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import electron from "vite-plugin-electron/simple";
import tailwind from "@tailwindcss/vite";

const resolve = {
  alias: {
    "@main": path.resolve("src/electron/"),
    "@": path.resolve("src/"),
  },
};

const plugins: PluginOption[] = [
  react(),
  tailwind(),
  electron({
    main: {
      entry: path.resolve("src/electron/main.ts"),
      vite: {
        resolve,
      },
    },
    preload: {
      input: path.resolve("src/electron/preload/preload.ts"),
      vite: {
        resolve
      }
    },
  }),
];

export default defineConfig({
  plugins,
  resolve,
  build: {
    outDir: path.resolve("dist"),
  },
});
