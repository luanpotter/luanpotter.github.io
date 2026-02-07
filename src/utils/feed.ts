import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { getContent, type ContentEntry } from "@/utils/collections";
import { Feed, type Author, type FeedOptions, type Item } from "feed";
import { removeSuffix } from "./utils";
import type { APIContext } from "astro";

// inspired by:
// * https://github.com/delucis/astro-blog-full-text-rss/blob/latest/src/pages/rss.xml.ts
// * https://gsong.dev/articles/astro-feed-unified
const renderers = await loadRenderers([getMDXRenderer()]);
const container = await AstroContainer.create({ renderers });

interface FeedContext {
  baseUrl: string;
}

const renderForRSS = async (context: FeedContext, entry: ContentEntry) => {
  const toAbsoluteUrl = (url: string) => (url.startsWith("/") ? `${context.baseUrl}${url}` : url);
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

const toRSSItem = async (context: FeedContext, entry: ContentEntry): Promise<Item> => ({
  id: entry.path,
  title: entry.data.title,
  description: entry.data.subtitle!,
  link: `${context.baseUrl}/${entry.path}`,
  date: entry.data.date,
  published: entry.data.date,
  content: await renderForRSS(context, entry),
});

const getFeed = async (context: FeedContext): Promise<Item[]> => {
  const entries = await getContent();
  return await Promise.all(entries.map((entry) => toRSSItem(context, entry)));
};

const createBaseFeed = ({ baseUrl }: FeedContext) => {
  const author: Author = {
    name: "Luan Nico",
    email: "contact@luan.xyz",
    link: baseUrl,
    avatar: `${baseUrl}/avatar.png`,
  };
  const options: FeedOptions = {
    id: baseUrl,
    title: "Luan's Feed",
    updated: new Date(),
    language: "en-us",
    feedLinks: {
      rss: `${baseUrl}/rss.xml`,
      atom: `${baseUrl}/atom.xml`,
    },
    description: "Posts and articles published at https://luan.xyz",
    link: baseUrl,
    author,
    favicon: `${baseUrl}/favicon.ico`,
  };
  return new Feed(options);
};

const generateFeed = async (context: FeedContext): Promise<Feed> => {
  const feed = createBaseFeed(context);
  for (const entry of await getFeed(context)) {
    feed.addItem(entry);
  }
  return feed;
};

export async function generateFeedForAstro(astroContext: APIContext): Promise<Feed> {
  const baseUrl = removeSuffix(astroContext.site!.toString(), "/");
  const feedContext = { baseUrl };
  return await generateFeed(feedContext);
}
