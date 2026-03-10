import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

const resolve = {
  alias: {
    "@": path.resolve("src/"),
  },
};

const plugins: PluginOption[] = [react(), tailwind(), svgr()];

export default defineConfig({
  plugins,
  resolve,
  build: {
    outDir: path.resolve("dist"),
    license: {
      fileName: "thirdparty.frontend.md"
    }
  },
  base: "./"
});
