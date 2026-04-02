export type ArticleType = "article" | "tech" | "howto";

export type FAQItem = {
  readonly question: string;
  readonly answer: string;
};

export type HowToStep = {
  readonly name: string;
  readonly text: string;
};

export type BlogPost = {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly description?: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly featureImage?: string;
  readonly content: string;
  readonly featured?: boolean;
  readonly faqs?: readonly FAQItem[];
  readonly articleType?: ArticleType;
  readonly howToSteps?: readonly HowToStep[];
  readonly tags?: readonly string[];
  readonly readingTime: string;
};

export type BlogPostMeta = Omit<
  BlogPost,
  "content" | "faqs" | "articleType" | "howToSteps"
>;

export type AuthorConfig = {
  readonly name?: string;
  readonly url?: string;
  readonly email?: string;
  readonly twitter?: string;
  readonly social?: readonly string[];
};

export type PublisherConfig = {
  readonly name?: string;
  readonly logo?: string;
};

export type BlogSectionConfig = {
  readonly title?: string;
  readonly description?: string;
  readonly basePath?: string;
  readonly contentDir?: string;
  readonly postsPerPage?: number;
  readonly revalidate?: number;
};

export type FeaturesConfig = {
  readonly rss?: boolean;
  readonly jsonApi?: boolean;
  readonly tableOfContents?: boolean;
  readonly relatedPosts?: boolean;
  readonly search?: boolean;
  readonly socialEmbeds?: boolean;
  readonly scheduledPublishing?: boolean;
};

export type BlogConfig = {
  readonly siteUrl: string;
  readonly blog?: BlogSectionConfig;
  readonly author?: AuthorConfig;
  readonly publisher?: PublisherConfig;
  readonly features?: FeaturesConfig;
  readonly tagAcronyms?: readonly string[];
};

export type ResolvedBlogConfig = {
  readonly siteUrl: string;
  readonly blog: Required<BlogSectionConfig>;
  readonly author: Required<AuthorConfig>;
  readonly publisher: Required<PublisherConfig>;
  readonly features: Required<FeaturesConfig>;
  readonly tagAcronyms: readonly string[];
};

export type ManifestEntry = {
  readonly file: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly description?: string;
  readonly publishedAt: string;
  readonly updatedAt?: string;
  readonly featureImage?: string;
  readonly featured?: boolean;
  readonly tags?: readonly string[];
  readonly readingTime: string;
};

export type BlogManifest = {
  readonly generatedAt: string;
  readonly postCount: number;
  readonly posts: readonly ManifestEntry[];
};

export type BlogInstance = {
  readonly getAllPosts: () => BlogPostMeta[];
  readonly getAllPostsWithContent: () => BlogPost[];
  readonly getPostBySlug: (slug: string) => BlogPost | null;
  readonly getRelatedPosts: (
    currentSlug: string,
    count?: number
  ) => BlogPostMeta[];
  readonly getFeaturedPosts: () => BlogPostMeta[];
  readonly getAllTags: () => string[];
  readonly getPostsByTag: (tag: string) => BlogPostMeta[];
  readonly getTagCounts: () => Record<string, number>;
  readonly config: ResolvedBlogConfig;
};
