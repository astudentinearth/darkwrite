import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, type TestProjectConfiguration } from "vitest/config";

const appAliases = {
  "@": resolve("src"),
  "@main": resolve("src/electron"),
  "@common": resolve("src/common")
};

const electronConfig: TestProjectConfiguration = {
  test: {
    name: "app-electron",
    environment: "node",
    root: resolve("."),
    include: ["src/electron/**/*.test.ts"],
    setupFiles: ["src/test/setup.electron.ts"],
    globals: true,
    pool: "threads",
  },
  resolve: {
    alias: appAliases,
  },
};

const appConfig: TestProjectConfiguration = {
  plugins: [react()],
  test: {
    name: "app-frontend",
    environment: "jsdom",
    root: resolve("."),
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/electron/**/*.test.{ts,tsx}"],
    setupFiles: ["src/test/setup.react.ts"],
    globals: true,
    css: true,
    deps: {
      optimizer: {
        web: {
          include: ["react-tweet", "katex", "lucide-react"],
        },
      },
    },
    server: {
      deps: {
        inline: ["react-tweet", "katex", "lucide-react"],
      },
    },
    pool: "threads",
  },
  resolve: {
    alias: appAliases,
  },
};

export default defineConfig({
  test: {
    workspace: [electronConfig, appConfig],
  },
});
