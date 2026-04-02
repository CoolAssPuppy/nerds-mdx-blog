// JSON-LD structured data uses dangerouslySetInnerHTML per Next.js convention.
// The data is generated server-side from trusted config, not user input.
export const blogPageTemplate = `import { blog } from "@/lib/blog";
import { BlogGrid } from "@strategicnerds/nerds-mdx-blog/components";
import { generateCollectionJsonLd } from "@strategicnerds/nerds-mdx-blog";

export const revalidate = 86400;

export const metadata = {
  title: blog.config.blog.title,
  description: blog.config.blog.description,
};

export default async function BlogPage() {
  const posts = blog.getAllPosts();
  const jsonLd = generateCollectionJsonLd(posts.slice(0, 20), blog.config);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold text-foreground mb-8">
        {blog.config.blog.title}
      </h1>
      <BlogGrid
        initialPosts={posts}
        postsPerPage={blog.config.blog.postsPerPage}
        basePath={blog.config.blog.basePath}
      />
    </div>
  );
}
`;
