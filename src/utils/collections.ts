import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export type Article = CollectionEntry<"articles"> & {
  path: string;
};

export type BlogPost = CollectionEntry<"blog"> & {
  path: string;
  data: CollectionEntry<"blog">["data"] & { date: Date };
};

export type ContentEntry = Article | BlogPost;

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
    .filter((post) => !post.id.startsWith("_"))
    .map((post) => ({
      ...post,
      path: `/blog/${post.id}`,
      data: {
        ...post.data,
        date: parseDateFromFilename(post.id),
      },
    }))
    .sort(sortByDate((post) => post.data.date));
}

export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection("articles");
  return articles
    .map((article) => ({
      ...article,
      path: `/articles/${article.id}`,
    }))
    .sort(sortByDate((item) => item.data.date));
}

export async function getContent(): Promise<ContentEntry[]> {
  const [articles, blogPosts] = await Promise.all([getArticles(), getBlogPosts()]);
  return [...articles, ...blogPosts].sort(sortByDate((item) => item.data.date));
}

export function sortByDate<T>(getDate: (item: T) => Date) {
  return (a: T, b: T) => getDate(b).getTime() - getDate(a).getTime();
}
