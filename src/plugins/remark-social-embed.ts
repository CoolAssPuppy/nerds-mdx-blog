import { visit } from "unist-util-visit";
import type { Root, Paragraph, Link, Text } from "mdast";
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx";

type SocialMatch = {
  readonly component: string;
  readonly id: string;
};

function extractTwitterId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i);
  return match ? match[1] : null;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i,
    /youtu\.be\/([a-zA-Z0-9_-]+)/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractInstagramId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

export function matchSocialUrl(url: string): SocialMatch | null {
  const twitterId = extractTwitterId(url);
  if (twitterId) return { component: "TweetEmbed", id: twitterId };

  const youtubeId = extractYouTubeId(url);
  if (youtubeId) return { component: "YouTubeEmbed", id: youtubeId };

  const instagramId = extractInstagramId(url);
  if (instagramId) return { component: "InstagramEmbed", id: instagramId };

  return null;
}

function getUrlFromParagraph(node: Paragraph): string | null {
  if (node.children.length !== 1) return null;

  const child = node.children[0];

  if (child.type === "link") {
    const link = child as Link;
    if (link.children.length === 1 && link.children[0].type === "text") {
      const linkText = (link.children[0] as Text).value.trim();
      if (linkText === link.url) {
        return link.url;
      }
    }
  }

  if (child.type === "text") {
    const text = (child as Text).value.trim();
    if (text.startsWith("http://") || text.startsWith("https://")) {
      return text;
    }
  }

  return null;
}

function createJsxElement(
  component: string,
  id: string
): MdxJsxFlowElement {
  return {
    type: "mdxJsxFlowElement",
    name: component,
    attributes: [{ type: "mdxJsxAttribute", name: "id", value: id }],
    children: [],
  };
}

export function remarkSocialEmbed() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return;

      const url = getUrlFromParagraph(node);
      if (!url) return;

      const match = matchSocialUrl(url);
      if (!match) return;

      const jsxElement = createJsxElement(match.component, match.id);
      (parent.children as (Paragraph | MdxJsxFlowElement)[])[index] =
        jsxElement;
    });
  };
}
