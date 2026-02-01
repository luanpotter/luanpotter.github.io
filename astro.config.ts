import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://luan.xyz",
  outDir: "./dist",
  publicDir: "./public",
  integrations: [mdx()],
  markdown: {
    smartypants: false,
  },
});
