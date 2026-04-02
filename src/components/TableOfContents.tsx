"use client";

import { useEffect, useState, useMemo } from "react";

type TOCItem = {
  readonly id: string;
  readonly text: string;
  readonly level: number;
};

type TableOfContentsProps = {
  readonly content: string;
  readonly className?: string;
};

export function extractHeadings(content: string): TOCItem[] {
  const cleaned = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/~~~[\s\S]*?~~~/g, "");

  const headings: TOCItem[] = [];
  const regex = /^(#{1,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(cleaned)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${
        isExpanded ? "rotate-90" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const headings = useMemo(() => extractHeadings(content), [content]);

  const activeH2Id = useMemo(() => {
    if (!activeId) return null;
    const activeIndex = headings.findIndex((h) => h.id === activeId);
    if (activeIndex === -1) return null;
    if (headings[activeIndex].level <= 2) return headings[activeIndex].id;
    for (let i = activeIndex - 1; i >= 0; i--) {
      if (headings[i].level <= 2) return headings[i].id;
    }
    return null;
  }, [activeId, headings]);

  const visibleH3Ids = useMemo(() => {
    if (!activeH2Id) return new Set<string>();
    const ids = new Set<string>();
    const activeH2Index = headings.findIndex((h) => h.id === activeH2Id);
    if (activeH2Index === -1) return ids;
    for (let i = activeH2Index + 1; i < headings.length; i++) {
      if (headings[i].level <= 2) break;
      ids.add(headings[i].id);
    }
    return ids;
  }, [activeH2Id, headings]);

  const headingsWithChildren = useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i < headings.length; i++) {
      if (headings[i].level <= 2) {
        const next = headings[i + 1];
        if (next?.level === 3) ids.add(headings[i].id);
      }
    }
    return ids;
  }, [headings]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      className={`hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-200px)] overflow-y-auto transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${className}`}
    >
      <div className="border-l-2 border-border pl-4">
        <p className="text-sm font-semibold text-foreground mb-3">
          On this page
        </p>
        <ul>
          {headings.map((heading) => {
            const isH3 = heading.level === 3;
            const isH3Visible = !isH3 || visibleH3Ids.has(heading.id);
            const hasChildren = headingsWithChildren.has(heading.id);
            const isExpanded = activeH2Id === heading.id;

            return (
              <li
                key={heading.id}
                className={`transition-all duration-200 ${
                  heading.level === 1
                    ? "ml-0 mt-2"
                    : heading.level === 2
                      ? "ml-3 mt-2"
                      : "ml-6"
                } ${isH3Visible ? "opacity-100 max-h-10 mt-1" : "hidden"} first:mt-0`}
              >
                <a
                  href={`#${heading.id}`}
                  className={`flex items-center justify-between gap-2 text-sm leading-tight transition-colors ${
                    activeId === heading.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(heading.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setActiveId(heading.id);
                  }}
                >
                  <span>{heading.text}</span>
                  {hasChildren && (
                    <span className="flex-shrink-0">
                      <ChevronIcon isExpanded={isExpanded} />
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
