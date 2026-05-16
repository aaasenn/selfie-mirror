// @ts-check
import { defineConfig } from "astro/config";
import { qrcode } from "vite-plugin-qrcode";

import vue from "@astrojs/vue";
import node from "@astrojs/node";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), icon()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),

  vite: {
    plugins: [tailwindcss(), qrcode()],
    server: {
      host: true,
    },
  },
});
