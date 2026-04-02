export const blogConfigTemplate = `import { defineConfig } from "@strategicnerds/nerds-mdx-blog";

export default defineConfig({
  siteUrl: "https://example.com", // TODO: Replace with your site URL
  blog: {
    title: "Blog",
    description: "My blog",
    basePath: "/blog",
    contentDir: "content/blog",
    postsPerPage: 12,
  },
  author: {
    name: "Your Name",
    // url: "https://example.com/about",
    // email: "you@example.com",
    // twitter: "@handle",
  },
});
`;
