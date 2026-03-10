import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const resolve = {
  alias: {
    "@": path.resolve("src/"),
  },
};

export default defineConfig({
  resolve,
  build: {
    lib: {
      entry: [path.resolve("src/index.ts")],
      formats: ["es"],
      name: "@darkwrite/common",
    },
    target: "esnext",
    license: {
      fileName: "thirdparty.common.md",
    },
    outDir: path.resolve("dist"),
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    globals: true
  }
});
