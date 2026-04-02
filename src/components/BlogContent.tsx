"use client";

import { useState, useCallback, useRef, type ReactNode } from "react";

type BlogContentProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const BUTTON_CLASS =
  "inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 rounded-lg transition-colors";

export function BlogContent({ children, className = "" }: BlogContentProps): React.ReactElement {
  const [copiedArticle, setCopiedArticle] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyArticle = useCallback(async () => {
    if (!contentRef.current) return;
    try {
      await navigator.clipboard.writeText(contentRef.current.innerText);
      setCopiedArticle(true);
      setTimeout(() => setCopiedArticle(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-end gap-2 mb-4">
        <button type="button" onClick={handleCopyLink} className={BUTTON_CLASS}>
          {copiedLink ? <CheckIcon /> : <LinkIcon />}
          <span>{copiedLink ? "Copied!" : "Copy link"}</span>
        </button>
        <button type="button" onClick={handleCopyArticle} className={BUTTON_CLASS}>
          {copiedArticle ? <CheckIcon /> : <CopyIcon />}
          <span>{copiedArticle ? "Copied!" : "Copy article"}</span>
        </button>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
