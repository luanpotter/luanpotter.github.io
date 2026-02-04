import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

// Polyfill URL.canParse for Bun compatibility
if (typeof URL.canParse !== "function") {
  URL.canParse = (url: string, base?: string) => {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

export default defineConfig({
  site: "https://luan.xyz",
  outDir: "./dist",
  publicDir: "./public",
  integrations: [mdx()],
  markdown: {
    smartypants: false,
  },
});
