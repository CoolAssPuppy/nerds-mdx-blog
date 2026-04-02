import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly featureImage?: string;
  readonly featured?: boolean;
  readonly readingTime?: string;
  readonly basePath?: string;
  readonly className?: string;
};

export function BlogCard({
  slug,
  title,
  excerpt,
  publishedAt,
  featureImage,
  featured = false,
  readingTime,
  basePath = "/blog",
  className = "",
}: BlogCardProps): React.ReactElement {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`${basePath}/${slug}`} className={`block group ${className}`}>
      <article
        className={`h-full rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg ${
          featured ? "md:flex md:flex-row" : ""
        }`}
      >
        {featureImage && (
          <div
            className={`relative overflow-hidden ${
              featured
                ? "aspect-[16/9] md:aspect-auto md:w-1/2"
                : "w-full aspect-[16/9]"
            }`}
          >
            <Image
              src={featureImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
          </div>
        )}
        <div
          className={`p-6 ${
            featured
              ? "md:w-1/2 md:flex md:flex-col md:justify-center"
              : ""
          }`}
        >
          <div className="text-sm text-muted-foreground">
            <time dateTime={publishedAt}>{formattedDate}</time>
            {readingTime && (
              <span className="opacity-60"> | {readingTime}m read</span>
            )}
          </div>
          <h3
            className={`mt-2 font-bold text-foreground group-hover:text-primary transition-colors ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {title}
          </h3>
          <p className="mt-3 text-muted-foreground line-clamp-3">{excerpt}</p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
            Read more
            <svg
              className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </article>
    </Link>
  );
}
