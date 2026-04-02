// Types
export type {
  ArticleType,
  FAQItem,
  HowToStep,
  BlogPost,
  BlogPostMeta,
  BlogConfig,
  ResolvedBlogConfig,
  BlogInstance,
  ManifestEntry,
  BlogManifest,
  AuthorConfig,
  PublisherConfig,
  BlogSectionConfig,
  FeaturesConfig,
} from "./types.js";

// Config
export { defineConfig, resolveConfig, createBlog } from "./config.js";

// Data
export {
  calculateReadingTime,
  stripCodeBlocksAndComponents,
} from "./data/reading-time.js";
export { generateManifest } from "./data/manifest.js";
export { formatTagName } from "./data/format.js";

// Plugins
export {
  remarkSocialEmbed,
  matchSocialUrl,
} from "./plugins/remark-social-embed.js";
export { getRemarkPlugins, getRehypePlugins } from "./plugins/preset.js";

// MDX components
export { getMdxComponents } from "./mdx/index.js";
export { Callout } from "./mdx/Callout.js";
export { CodeBlock } from "./mdx/CodeBlock.js";
export { GitHubRepo } from "./mdx/GitHubRepo.js";
export { Mermaid } from "./mdx/Mermaid.js";
export { Video } from "./mdx/Video.js";
export {
  TweetEmbed,
  YouTubeEmbed,
  InstagramEmbed,
} from "./mdx/SocialEmbed.js";

// Blog components
export { BlogCard } from "./components/BlogCard.js";
export { BlogGrid } from "./components/BlogGrid.js";
export { BlogContent } from "./components/BlogContent.js";
export {
  TableOfContents,
  extractHeadings,
} from "./components/TableOfContents.js";
export { RelatedPosts } from "./components/RelatedPosts.js";
export { TagNavigation } from "./components/TagNavigation.js";

// Generators
export { generateRssFeed, escapeXml } from "./data/rss.js";
export {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateHowToJsonLd,
  generateCollectionJsonLd,
} from "./data/json-ld.js";
