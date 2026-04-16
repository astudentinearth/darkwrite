import { defineConfig } from "vitest/config";
import { resolveAliases } from "./vite.config";

export default defineConfig({
  resolve: resolveAliases,
  test: {
    globals: true,
  },
});
