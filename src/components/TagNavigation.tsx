"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTagName } from "../data/format";

type TagNavigationProps = {
  readonly allTags: readonly string[];
  readonly tagCounts: Record<string, number>;
  readonly currentTag: string;
  readonly basePath?: string;
  readonly tagAcronyms?: readonly string[];
  readonly className?: string;
};

export function TagNavigation({
  allTags,
  tagCounts,
  currentTag,
  basePath = "/blog",
  tagAcronyms,
  className = "",
}: TagNavigationProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  const tagLink = (tag: string) => (
    <Link
      key={tag}
      href={`${basePath}/tag/${encodeURIComponent(tag)}`}
      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
        tag === currentTag
          ? "bg-primary text-primary-foreground font-medium"
          : "bg-card text-foreground hover:bg-muted border border-border"
      }`}
    >
      {formatTagName(tag, tagAcronyms)}
      <span className="ml-1 text-xs opacity-60">({tagCounts[tag]})</span>
    </Link>
  );

  return (
    <section className={`bg-muted border-b border-border ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-4 flex items-center justify-between text-foreground"
          >
            <span className="text-sm font-medium">
              Browse all topics ({allTags.length})
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isExpanded && (
            <div className="pb-4 flex flex-wrap gap-2">
              {allTags.map(tagLink)}
            </div>
          )}
        </div>
        <div className="hidden md:block py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {allTags.map(tagLink)}
          </div>
        </div>
      </div>
    </section>
  );
}
