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
} from "./types";

// Config
export { defineConfig, resolveConfig, createBlog } from "./config";

// Data
export {
  calculateReadingTime,
  stripCodeBlocksAndComponents,
} from "./data/reading-time";
export { generateManifest } from "./data/manifest";
export { formatTagName } from "./data/format";

// Plugins
export {
  remarkSocialEmbed,
  matchSocialUrl,
} from "./plugins/remark-social-embed";
export { getRemarkPlugins, getRehypePlugins } from "./plugins/preset";

// MDX components
export { getMdxComponents } from "./mdx";
export { Callout } from "./mdx/Callout";
export { CodeBlock } from "./mdx/CodeBlock";
export { GitHubRepo } from "./mdx/GitHubRepo";
export { Mermaid } from "./mdx/Mermaid";
export { Video } from "./mdx/Video";
export {
  TweetEmbed,
  YouTubeEmbed,
  InstagramEmbed,
} from "./mdx/SocialEmbed";
