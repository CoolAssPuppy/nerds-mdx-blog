import type {
  BlogPost,
  BlogPostMeta,
  FAQItem,
  HowToStep,
  ResolvedBlogConfig,
} from "../types";

function isTechnicalArticle(post: BlogPost): boolean {
  if (post.articleType === "tech" || post.articleType === "howto") return true;
  const title = post.title.toLowerCase();
  return (
    title.includes("how to") ||
    title.includes("guide") ||
    title.includes("tutorial") ||
    title.includes("framework") ||
    title.includes("playbook")
  );
}

function buildAuthorSchema(config: ResolvedBlogConfig) {
  return {
    "@type": "Person" as const,
    "@id": `${config.siteUrl}/#person`,
    name: config.author.name,
    ...(config.author.url && { url: config.author.url }),
    ...(config.author.social?.length && {
      sameAs: config.author.social,
    }),
  };
}

function buildPublisherSchema(config: ResolvedBlogConfig) {
  return {
    "@type": "Organization" as const,
    "@id": `${config.siteUrl}/#organization`,
    name: config.publisher.name,
    url: config.siteUrl,
    ...(config.publisher.logo && {
      logo: {
        "@type": "ImageObject" as const,
        url: `${config.siteUrl}${config.publisher.logo}`,
        width: 200,
        height: 200,
      },
    }),
  };
}

export function generateArticleJsonLd(
  post: BlogPost,
  config: ResolvedBlogConfig
) {
  const isTech = isTechnicalArticle(post);
  const postUrl = `${config.siteUrl}${config.blog.basePath}/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": isTech ? ("TechArticle" as const) : ("Article" as const),
    headline: post.title,
    description: post.description || post.excerpt,
    image: post.featureImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: buildAuthorSchema(config),
    publisher: buildPublisherSchema(config),
    mainEntityOfPage: { "@type": "WebPage" as const, "@id": postUrl },
    isPartOf: { "@id": `${config.siteUrl}/#website` },
    ...(isTech && { proficiencyLevel: "Beginner", dependencies: "None" }),
  };

  return schema;
}

export function generateBreadcrumbJsonLd(
  post: BlogPost,
  config: ResolvedBlogConfig
) {
  const postUrl = `${config.siteUrl}${config.blog.basePath}/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: [
      { "@type": "ListItem" as const, position: 1, name: "Home", item: config.siteUrl },
      {
        "@type": "ListItem" as const,
        position: 2,
        name: config.blog.title,
        item: `${config.siteUrl}${config.blog.basePath}`,
      },
      { "@type": "ListItem" as const, position: 3, name: post.title, item: postUrl },
    ],
  };
}

export function generateFAQJsonLd(faqs: readonly FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question" as const,
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToJsonLd(
  post: BlogPost,
  steps: readonly HowToStep[],
  config: ResolvedBlogConfig
) {
  const postUrl = `${config.siteUrl}${config.blog.basePath}/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo" as const,
    name: post.title,
    description: post.description || post.excerpt,
    image: post.featureImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: buildAuthorSchema(config),
    step: steps.map((step, index) => ({
      "@type": "HowToStep" as const,
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    mainEntityOfPage: { "@type": "WebPage" as const, "@id": postUrl },
    isPartOf: { "@id": `${config.siteUrl}/#website` },
  };
}

export function generateCollectionJsonLd(
  posts: readonly BlogPostMeta[],
  config: ResolvedBlogConfig
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage" as const,
    name: config.blog.title,
    description: config.blog.description,
    url: `${config.siteUrl}${config.blog.basePath}`,
    mainEntity: {
      "@type": "ItemList" as const,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem" as const,
        position: index + 1,
        url: `${config.siteUrl}${config.blog.basePath}/${post.slug}`,
        name: post.title,
      })),
    },
  };
}
