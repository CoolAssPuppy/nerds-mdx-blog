export const rssRouteTemplate = `import { blog } from "@/lib/blog";
import { generateRssFeed } from "nerds-mdx-blog";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET(): Promise<Response> {
  const posts = blog.getAllPostsWithContent();
  const feed = generateRssFeed(posts, blog.config);

  return new Response(feed, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
`;
