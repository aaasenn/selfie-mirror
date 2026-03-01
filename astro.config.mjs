// @ts-check
import { defineConfig } from "astro/config";
import { qrcode } from "vite-plugin-qrcode";

import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), icon()],

  vite: {
    plugins: [tailwindcss(), qrcode()],
    server: {
      host: true,
    },
  },
});
