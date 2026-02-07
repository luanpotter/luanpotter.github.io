import { generateFeedForAstro } from "@/utils/feed";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const feed = await generateFeedForAstro(context);
  return new Response(feed.atom1(), {
    headers: { "Content-Type": "application/atom+xml" },
  });
}
