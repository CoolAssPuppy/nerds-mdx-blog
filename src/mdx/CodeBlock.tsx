"use client";

import {
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  isValidElement,
  Children,
} from "react";

type CodeBlockProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly "data-language"?: string;
  readonly "data-theme"?: string;
  readonly "data-rehype-pretty-code-figure"?: string;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as { props: { children?: ReactNode } };
    return getTextContent(element.props.children);
  }
  return "";
}

function getLanguageFromChildren(children: ReactNode): string | undefined {
  for (const child of Children.toArray(children)) {
    if (isValidElement(child)) {
      const props = child.props as {
        "data-language"?: string;
        children?: ReactNode;
      };
      if (props["data-language"]) return props["data-language"];
      if (props.children) {
        const nested = getLanguageFromChildren(props.children);
        if (nested) return nested;
      }
    }
  }
  return undefined;
}

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export function CodeBlock({
  children,
  "data-language": directLanguage,
  "data-rehype-pretty-code-figure": isFigure,
}: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const language = directLanguage || getLanguageFromChildren(children);
  const textContent = useMemo(() => getTextContent(children), [children]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [textContent]);

  const copyButton = (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-3 right-3 z-10 p-2 rounded-md bg-gray-700/70 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
      aria-label={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );

  const languageLabel = language ? (
    <div className="absolute top-0 left-4 z-10 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-800 rounded-b-md">
      {language}
    </div>
  ) : null;

  if (isFigure !== undefined) {
    return (
      <div className="relative not-prose group my-6">
        {languageLabel}
        <figure data-rehype-pretty-code-figure="" className="m-0">
          {children}
        </figure>
        {copyButton}
      </div>
    );
  }

  return (
    <div className="relative not-prose group">
      {languageLabel}
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 pt-8 overflow-x-auto">
        {children}
      </pre>
      {copyButton}
    </div>
  );
}
