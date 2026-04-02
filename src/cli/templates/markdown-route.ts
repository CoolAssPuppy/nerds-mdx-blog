export const markdownRouteTemplate = `import { blog } from "@/lib/blog";
import { stripCodeBlocksAndComponents } from "nerds-mdx-blog";
import { notFound } from "next/navigation";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blog.getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: RouteProps): Promise<Response> {
  const { slug } = await params;
  const post = blog.getPostBySlug(slug);
  if (!post) notFound();

  const frontmatter = [
    "---",
    \`title: "\${post.title}"\`,
    \`publishedAt: "\${post.publishedAt}"\`,
    \`excerpt: "\${post.excerpt}"\`,
    post.tags?.length ? \`tags: [\${post.tags.join(", ")}]\` : null,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\\n");

  const markdown = frontmatter + post.content;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
`;
