import type { BlogConfig, BlogInstance, ResolvedBlogConfig } from "./types";
import { createBlogDataLayer } from "./data/blog";
import { DEFAULT_TAG_ACRONYMS } from "./constants";

export function defineConfig(config: BlogConfig): BlogConfig {
  return config;
}

export function resolveConfig(config: BlogConfig): ResolvedBlogConfig {
  const authorName = config.author?.name ?? "";

  return {
    siteUrl: config.siteUrl,
    blog: {
      title: config.blog?.title ?? "Blog",
      description:
        config.blog?.description ?? "A blog powered by @strategicnerds/nerds-mdx-blog",
      basePath: config.blog?.basePath ?? "/blog",
      contentDir: config.blog?.contentDir ?? "content/blog",
      postsPerPage: config.blog?.postsPerPage ?? 12,
      revalidate: config.blog?.revalidate ?? 86400,
    },
    author: {
      name: authorName,
      url: config.author?.url ?? "",
      email: config.author?.email ?? "",
      twitter: config.author?.twitter ?? "",
      social: config.author?.social ?? [],
    },
    publisher: {
      name: config.publisher?.name ?? authorName,
      logo: config.publisher?.logo ?? "",
    },
    features: {
      rss: config.features?.rss ?? true,
      jsonApi: config.features?.jsonApi ?? true,
      tableOfContents: config.features?.tableOfContents ?? true,
      relatedPosts: config.features?.relatedPosts ?? true,
      search: config.features?.search ?? true,
      socialEmbeds: config.features?.socialEmbeds ?? true,
      scheduledPublishing: config.features?.scheduledPublishing ?? true,
    },
    tagAcronyms: config.tagAcronyms ?? DEFAULT_TAG_ACRONYMS,
  };
}

export function createBlog(config: BlogConfig): BlogInstance {
  const resolved = resolveConfig(config);
  return createBlogDataLayer(resolved);
}
