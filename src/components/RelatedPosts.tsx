import Link from "next/link";
import Image from "next/image";

type RelatedPost = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly featureImage?: string;
};

type RelatedPostsProps = {
  readonly posts: readonly RelatedPost[];
  readonly currentSlug: string;
  readonly basePath?: string;
  readonly className?: string;
};

function RelatedPostCard({
  post,
  basePath,
}: {
  post: RelatedPost;
  basePath: string;
}) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short" }
  );

  return (
    <Link
      href={`${basePath}/${post.slug}`}
      className="group flex gap-4 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors duration-200"
    >
      {post.featureImage && (
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={post.featureImage}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <time className="text-xs text-muted-foreground">{formattedDate}</time>
        <h4 className="mt-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}

export function RelatedPosts({
  posts,
  currentSlug,
  basePath = "/blog",
  className = "",
}: RelatedPostsProps): React.ReactElement | null {
  const relatedPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <aside className={`mt-16 pt-12 border-t border-border ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h3 className="text-lg font-semibold text-foreground">
          Continue reading
        </h3>
      </div>
      <div className="grid gap-4">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} basePath={basePath} />
        ))}
      </div>
    </aside>
  );
}
