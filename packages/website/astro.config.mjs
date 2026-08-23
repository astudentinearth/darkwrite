// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      license: {
        fileName: "licenses.md"
      }
    }
  },
  site: "https://darkwrite.app",
  integrations: [sitemap(), react()],
});