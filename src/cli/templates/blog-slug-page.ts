// JSON-LD structured data uses dangerouslySetInnerHTML per Next.js convention.
// The data is generated server-side from trusted config, not user input.
export const blogSlugPageTemplate = `import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { blog } from "@/lib/blog";
import {
  getMdxComponents,
  getRemarkPlugins,
  getRehypePlugins,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateHowToJsonLd,
} from "nerds-mdx-blog";
import {
  BlogContent,
  TableOfContents,
  RelatedPosts,
} from "nerds-mdx-blog/components";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blog.getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.getPostBySlug(slug);
  if (!post) return { title: "Not found" };

  const url = \\\`\\\${blog.config.siteUrl}\\\${blog.config.blog.basePath}/\\\${slug}\\\`;
  return {
    title: post.title,
    description: post.description || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      url,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blog.getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blog.getRelatedPosts(slug, 3);
  const components = getMdxComponents();

  const articleJsonLd = generateArticleJsonLd(post, blog.config);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(post, blog.config);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
        }}
      />
      {post.faqs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQJsonLd(post.faqs)),
          }}
        />
      )}
      {post.howToSteps && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateHowToJsonLd(post, post.howToSteps, blog.config)
            ),
          }}
        />
      )}

      <header className="mb-12">
        <time
          dateTime={post.publishedAt}
          className="text-sm text-muted-foreground"
        >
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.readingTime && \\\` \u00b7 \\\${post.readingTime} min read\\\`}
        </time>
        <h1 className="mt-4 text-4xl font-bold text-foreground">
          {post.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>
      </header>

      <TableOfContents content={post.content} />

      <BlogContent>
        <article className="prose prose-lg max-w-none prose-a:text-primary prose-headings:text-foreground prose-p:text-foreground">
          <MDXRemote
            source={post.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: getRemarkPlugins(),
                rehypePlugins: getRehypePlugins() as never,
              },
            }}
          />
        </article>
      </BlogContent>

      <RelatedPosts
        posts={relatedPosts}
        currentSlug={slug}
        basePath={blog.config.blog.basePath}
      />
    </div>
  );
}
`;
