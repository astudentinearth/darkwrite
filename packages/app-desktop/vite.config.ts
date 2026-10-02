import path from "node:path";
import chalk from "chalk";
import { build, defineConfig, type InlineConfig } from "vite";
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
    rolldownOptions: {
      external: ["electron"],
    },
    license: {
      fileName: "thirdparty.preload.md",
    },
  },
};

let electronStarted: boolean = false;

export default defineConfig({
  plugins: [
    {
      name: "build-preload",
      async buildStart() {
        await build(preloadConfig);
      },
    },
    electron([
      {
        entry: "src/main.ts",
        async onstart({ startup }) {
          if (!electronStarted) {
            electronStarted = await startup();
            return;
          }

          console.warn(
            chalk.yellow(
              "[dev] ⚠️ Main process is running a stale build. Restart to apply changes.",
            ),
          );
        },
        vite: {
          resolve,
          build: {
            outDir: path.resolve(DISTDIR),
            rolldownOptions: {
              platform: "node",
              external: [
                "electron",
                /^node:/,
                "typeorm",
                "better-sqlite3",
                "@libsql/client",
                /^@libsql\/.*/,
                "write-file-atomic",
              ],
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
