import path from "path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

const resolve = {
  alias: {
    "@": path.resolve("src/"),
    "font-list": path.resolve("node_modules/font-list/index.js"),
  },
};

const DISTDIR = path.resolve("dist-electron");

export default defineConfig({
  plugins: [
    electron([
      {
        entry: "src/main.ts",
        vite: {
          resolve,
          build: {
            outDir: path.resolve(DISTDIR),
            rollupOptions: {
              external: ["typeorm"],
            },
            license: {
              fileName: "thirdparty.main.md",
            },
          },
        },
      },
      {
        entry: "src/preload/preload.ts",
        vite: {
          resolve,
          build: {
            outDir: path.resolve(DISTDIR),
            rollupOptions: {
              external: ["typeorm"],
            },
            license: {
              fileName: "thirdparty.preload.md",
            },
          },
        },
      },
    ]),
  ],
  build: {
    outDir: path.resolve("dist_discarded"),
  },
});
