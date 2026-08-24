// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

import starlight from "@astrojs/starlight";
import { GIT_REPO_URL } from "./src/lib/resources";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      license: {
        fileName: "licenses.md",
      },
    },
  },
  site: "https://darkwrite.app",
  integrations: [
    sitemap(),
    react(),
    starlight({
      title: "Docs",
      sidebar: [        {
          label: "Welcome",
          link: "/docs"
        },
        {
          label: "Installation",
          link: "/docs/installation"
        }, 
        {
          label: "Frequently asked questions",
          link: "/docs/faq"
        },
        {label: "Functionality", items: [{autogenerate: {directory: "docs/functionality"}}]}, 
        {
          label: "Troubleshooting guide",
          link: "/docs/troubleshooting"
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: GIT_REPO_URL,
        },
      ],
      logo: { src: "./public/darkwrite_icon.svg", alt: "Darkwrite logo" },
      customCss: [
        "@fontsource/inter",
        "@fontsource/inter/300",
        "@fontsource/inter/400",
        "@fontsource/inter/500",
        "@fontsource/inter/600",
        "@fontsource/inter/700",
        "@fontsource/inter/800",
        "./src/styles/docs.css",
      ],
    }),
  ],
});
