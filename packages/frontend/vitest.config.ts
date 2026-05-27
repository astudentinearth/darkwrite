import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vitest/config";

const appAliases = {
  "@": resolve("src"),
};

// const appConfig: TestProjectConfiguration = {
//   test: {
//     name: "app-frontend",
//     environment: "jsdom",
//     root: resolve("."),
//     include: ["src/**/*.test.{ts,tsx}"],
//     exclude: ["src/electron/**/*.test.{ts,tsx}"],
//     setupFiles: ["src/test/setup.react.ts"],
//     globals: true,
//     css: true,
//     deps: {
//       optimizer: {
//         web: {
//           include: ["react-tweet", "katex", "lucide-react"],
//         },
//       },
//     },
//     server: {
//       deps: {
//         inline: ["react-tweet", "katex", "lucide-react"],
//       },
//     },
//     pool: "threads",
//   },
//   resolve: {
//     alias: appAliases,
//   },
// };

export default defineConfig({
  resolve: {
    alias: appAliases,
  },
  plugins: [react(), svgr()],
  test: {
    globals: true,
  },
});
