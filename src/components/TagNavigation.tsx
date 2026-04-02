"use client";

import { useState } from "react";
import Link from "next/link";
import { formatTagName } from "../data/format.js";

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
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm rounded-full transition-all duration-150 ${
        tag === currentTag
          ? "bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-500/20"
          : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50"
      }`}
    >
      {formatTagName(tag, tagAcronyms)}
      <span className="text-xs opacity-50">({tagCounts[tag]})</span>
    </Link>
  );

  return (
    <section className={`bg-slate-50 border-b border-slate-200 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-4 flex items-center justify-between text-slate-700"
          >
            <span className="text-sm font-medium">
              Browse topics ({allTags.length})
            </span>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
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
        <div className="hidden md:block py-5">
          <div className="flex flex-wrap gap-2 justify-center">
            {allTags.map(tagLink)}
          </div>
        </div>
      </div>
    </section>
  );
}
