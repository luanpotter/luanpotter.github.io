import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog"> & {
  data: CollectionEntry<"blog">["data"] & { date: Date };
};

function parseDateFromFilename(id: string): Date {
  const match = id.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!match) {
    throw new Error(`Blog post "${id}" filename must start with YYYY-MM-DD-`);
  }
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog");
  return posts
    .map((post) => ({
      ...post,
      data: {
        ...post.data,
        date: parseDateFromFilename(post.id),
      },
    }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getArticles(): Promise<CollectionEntry<"articles">[]> {
  const articles = await getCollection("articles");
  return articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
