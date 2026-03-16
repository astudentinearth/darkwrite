import path from "path";
import { defineConfig, build, type InlineConfig } from "vite";
import electron from "vite-plugin-electron";

const resolve = {
  alias: {
    "@": path.resolve("src/"),
    "font-list": path.resolve("node_modules/font-list/index.js"),
  },
};

const DISTDIR = path.resolve("dist-electron");

const preloadConfig: InlineConfig = {
  resolve,
  configFile: false,
  build: {
    outDir: DISTDIR,
    lib: {
      entry: path.resolve("src/preload/preload.ts"),
      formats: ["cjs"],
      fileName: () => "preload.js",
    },
    rollupOptions: {
      external: ["electron"],
    },
    license: {
      fileName: "thirdparty.preload.md",
    },
  },
};


export default defineConfig({
  plugins: [
    {
      name: "build-preload",
      async buildStart() {
        await build(preloadConfig)
      }
    },
    electron([
      {
        entry: "src/main.ts",
        vite: {
          resolve,
          build: {
            outDir: path.resolve(DISTDIR),
            rollupOptions: {
              external: ["typeorm", "better-sqlite3", "@libsql/client", /^@libsql\/.*/],
            },
            license: {
              fileName: "thirdparty.main.md",
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
