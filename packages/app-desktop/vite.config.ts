import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import electron from "vite-plugin-electron/simple";
import tailwind from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

const resolve = {
  alias: {
    "@main": path.resolve("src/electron/"),
    "@": path.resolve("src/"),
    "@common": path.resolve("src/common"),
    "font-list": path.resolve("node_modules/font-list/index.js"),
  },
};

const plugins: PluginOption[] = [
  react(),
  tailwind(),
  svgr(),
  electron({
    main: {
      entry: path.resolve("src/electron/main.ts"),
      vite: {
        resolve,
        build: {
          rollupOptions: {
            external: ["typeorm"],
          },
        },
      },
    },
    preload: {
      input: path.resolve("src/electron/preload/preload.ts"),
      vite: {
        resolve,
      },
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
