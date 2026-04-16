import { resolve } from "node:path";
import { defineConfig, type TestProjectConfiguration } from "vitest/config";

const appAliases = {
  "@": resolve("src"),
};

const electronConfig: TestProjectConfiguration = {
  test: {
    name: "app-electron",
    environment: "node",
    root: resolve("."),
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup.electron.ts"],
    globals: true,
    pool: "forks",
    maxWorkers: 1,
    isolate: false,
  },
  resolve: {
    alias: appAliases,
  },
};

export default defineConfig({
  test: {
    projects: [electronConfig],
    env: {
      NODE_ENV: "test",
    },
  },
});
