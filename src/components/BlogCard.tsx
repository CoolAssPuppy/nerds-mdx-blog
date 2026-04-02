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
        className={`h-full bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200 ${
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        <div
          className={`p-6 flex flex-col ${
            featured ? "md:w-1/2 md:justify-center md:p-8" : ""
          }`}
        >
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <time dateTime={publishedAt}>{formattedDate}</time>
            {readingTime && (
              <>
                <span className="text-slate-300">|</span>
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
          <h3
            className={`mt-3 font-semibold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors duration-200 ${
              featured ? "text-2xl" : "text-lg"
            }`}
          >
            {title}
          </h3>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed line-clamp-3 flex-1">
            {excerpt}
          </p>
          <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
            Read article
            <svg
              className="ml-1 w-4 h-4"
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
