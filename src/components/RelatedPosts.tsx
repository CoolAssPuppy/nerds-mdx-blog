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
      className="group flex gap-4 p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200"
    >
      {post.featureImage && (
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={post.featureImage}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <time className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {formattedDate}
        </time>
        <h4 className="mt-1.5 text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2 leading-snug">
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
    <aside className={`mt-20 pt-12 border-t border-slate-200 ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-7 bg-indigo-500 rounded-full" />
        <h3 className="text-xl font-semibold text-slate-900">
          Continue reading
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {relatedPosts.map((post) => (
          <RelatedPostCard key={post.slug} post={post} basePath={basePath} />
        ))}
      </div>
    </aside>
  );
}
