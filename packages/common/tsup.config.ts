import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/models/index.ts"],
  format: ["esm", "cjs"],
  treeshake: true,
  splitting: true,
  clean: true,
  dts: true,
});
