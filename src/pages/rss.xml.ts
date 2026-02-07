import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { getContent, type ContentEntry } from "@/utils/collections";

// inspired by https://github.com/delucis/astro-blog-full-text-rss/blob/latest/src/pages/rss.xml.ts
const renderers = await loadRenderers([getMDXRenderer()]);
const container = await AstroContainer.create({ renderers });

const removeSuffix = (str: string, suffix: string) => (str.endsWith(suffix) ? str.slice(0, -suffix.length) : str);

const renderForRSS = async (entry: ContentEntry, urlPrefix: string) => {
  const toAbsoluteUrl = (url: string) => (url.startsWith("/") ? `${urlPrefix}${url}` : url);
  const { Content } = await render(entry);
  const rawContent = await container.renderToString(Content);
  return await transform(rawContent.replace(/^<!DOCTYPE html>/, ""), [
    async (node) => {
      await walk(node, (node) => {
        if (node.name === "a" && node.attributes.href?.startsWith("/")) {
          node.attributes.href = toAbsoluteUrl(node.attributes.href);
        }
        if (node.name === "img" && node.attributes.src?.startsWith("/")) {
          node.attributes.src = toAbsoluteUrl(node.attributes.src);
        }
      });
      return node;
    },
    sanitize({ dropElements: ["script", "style"] }),
  ]);
};

const toRSSItem = async (entry: ContentEntry, urlPrefix: string): Promise<RSSFeedItem> => ({
  title: entry.data.title,
  description: entry.data.subtitle!,
  link: entry.path,
  pubDate: entry.data.date,
  content: await renderForRSS(entry, urlPrefix),
});

export async function GET(context: APIContext) {
  const baseURL = context.site!;
  const urlPrefix = removeSuffix(baseURL.toString(), "/");
  const entries = await getContent();
  const items = await Promise.all(entries.map((entry) => toRSSItem(entry, urlPrefix)));

  return rss({
    title: "Luan's Feed",
    description: "Blogs and articles published at https://luan.xyz",
    site: baseURL,
    customData: `<language>en-us</language>`,
    items,
  });
}
