import { defineConfig, PluginOption } from "vite";
import path from "path";
import electron from "vite-plugin-electron/simple";

const resolve = {
  alias: {
    "@": path.resolve("src/"),
    "font-list": path.resolve("node_modules/font-list/index.js"),
  },
};

const plugins: PluginOption[] = [
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
