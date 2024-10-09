import path from "path";
import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@common": path.resolve("../common"),
    },
  },
});
