import type { BlogPost, ResolvedBlogConfig } from "../types";

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822Date(dateString: string): string {
  return new Date(dateString).toUTCString();
}

function markdownToRssHtml(markdown: string): string {
  let html = markdown
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/```[\w]*\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  html = `<p>${html}</p>`;
  return html.replace(/<p><\/p>/g, "");
}

function generateRssItem(
  post: BlogPost,
  config: ResolvedBlogConfig
): string {
  const postUrl = `${config.siteUrl}${config.blog.basePath}/${post.slug}`;
  const contentHtml = markdownToRssHtml(post.content);
  const authorLine = config.author.email
    ? `${config.author.email} (${config.author.name})`
    : config.author.name;

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
      <pubDate>${formatRfc822Date(post.publishedAt)}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>${
    authorLine ? `\n      <author>${escapeXml(authorLine)}</author>` : ""
  }
    </item>`;
}

export function generateRssFeed(
  posts: readonly BlogPost[],
  config: ResolvedBlogConfig
): string {
  const items = posts.map((post) => generateRssItem(post, config)).join("\n");
  const lastBuildDate =
    posts.length > 0
      ? formatRfc822Date(posts[0].publishedAt)
      : formatRfc822Date(new Date().toISOString());

  const authorLine = config.author.email
    ? `${config.author.email} (${config.author.name})`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(config.blog.title)}</title>
    <link>${config.siteUrl}${config.blog.basePath}</link>
    <description>${escapeXml(config.blog.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${config.siteUrl}/api/rss" rel="self" type="application/rss+xml"/>${
    authorLine
      ? `\n    <managingEditor>${escapeXml(authorLine)}</managingEditor>`
      : ""
  }
    <copyright>Copyright ${new Date().getFullYear()} ${config.publisher.name}. All rights reserved.</copyright>
${items}
  </channel>
</rss>`;
}
