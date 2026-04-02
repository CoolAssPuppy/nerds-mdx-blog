"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BlogCard } from "./BlogCard.js";

type BlogGridPost = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly publishedAt: string;
  readonly featureImage?: string;
  readonly featured?: boolean;
  readonly readingTime?: string;
  readonly tags?: readonly string[];
};

type BlogGridProps = {
  readonly initialPosts: readonly BlogGridPost[];
  readonly postsPerPage?: number;
  readonly basePath?: string;
  readonly className?: string;
};

export function BlogGrid({
  initialPosts,
  postsPerPage = 12,
  basePath = "/blog",
  className = "",
}: BlogGridProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFiltering = query.trim().length > 0;

  const filteredPosts = useMemo(() => {
    if (!isFiltering) return initialPosts;
    const lowerQuery = query.trim().toLowerCase();

    return initialPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
      const tagMatch = post.tags?.some((t) =>
        t.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || excerptMatch || tagMatch;
    });
  }, [initialPosts, query, isFiltering]);

  const displayedPosts = useMemo(
    () => initialPosts.slice(0, page * postsPerPage),
    [initialPosts, page, postsPerPage]
  );

  const hasMore = displayedPosts.length < initialPosts.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoading(false);
    }, 300);
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (isFiltering) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, isLoading, loadMore, isFiltering]);

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.target.value);
    setPage(1);
  }

  function clearSearch(): void {
    setQuery("");
    setPage(1);
    inputRef.current?.focus();
  }

  const postsToRender = isFiltering ? filteredPosts : displayedPosts;

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-slate-500 text-lg font-medium">No blog posts yet</p>
        <p className="text-slate-400 text-sm mt-2">Check back soon for new content.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-10">
        <div className="relative max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder={`Search ${initialPosts.length} posts...`}
            className="w-full pl-12 pr-10 py-3.5 text-base bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all duration-200 placeholder:text-slate-400 shadow-sm"
          />
          {query.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-150"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {isFiltering && (
          <p className="mt-3 text-sm text-slate-500">
            {filteredPosts.length === 1
              ? "1 post found"
              : `${filteredPosts.length} posts found`}
            {filteredPosts.length === 0 && ". Try a different search term."}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsToRender.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            publishedAt={post.publishedAt}
            featureImage={post.featureImage}
            featured={post.featured}
            readingTime={post.readingTime}
            basePath={basePath}
          />
        ))}
      </div>

      {!isFiltering && hasMore && (
        <div ref={loaderRef} className="flex justify-center py-16">
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-500">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm">Loading more...</span>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {isFiltering && filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No posts found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
