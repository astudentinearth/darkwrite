import { defineConfig, TestProjectConfiguration } from "vitest/config";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react"

const appAliases = {
  "@renderer": resolve("packages/app-desktop/src"),
  "@main": resolve("packages/app-desktop/src/electron"),
}

const electronConfig: TestProjectConfiguration = {
  test: {
    name: "app-electron",
    environment: "node",
    root: resolve("packages/app-desktop"),
    include: ["src/electron/**/*.test.ts"],
    setupFiles: ["src/test/setup.electron.ts"],
    globals: true,
    pool: "threads"
  },
  resolve: {
    alias: appAliases
  },
};

const appConfig: TestProjectConfiguration = {
  plugins: [react()],
  test: {
    name: "app-frontend",
    environment: "jsdom",
    root: resolve("packages/app-desktop"),
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
    alias: appAliases
  }
};

const commonConfig: TestProjectConfiguration = {
  test: {
    name: "common",
    environment: "node",
    root: resolve("packages/common"),
    include: ["src/**/*.test.ts"],
    globals: true
  },
  resolve: {
      alias: {
        "@common": resolve("packages/common"),
      },
    },
};

export default defineConfig({
  test: {
    workspace: [electronConfig, appConfig, commonConfig],
  },
});
