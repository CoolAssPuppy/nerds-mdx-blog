# nerds-mdx-blog

Drop-in MDX blog for Next.js. Install, init, write posts.

## Quickstart

```bash
npm install nerds-mdx-blog
npx nerds-mdx-blog init
npm run dev
```

Visit `http://localhost:3000/blog`. You have a blog.

## What you get

- Blog listing page with infinite scroll and search
- Individual post pages with MDX rendering
- Tag system with filtering and counts
- Floating table of contents (scroll-tracking sidebar)
- Related posts (tag-based recommendations)
- RSS feed at `/api/rss`
- JSON API at `/api/blog`
- Markdown endpoint at `/blog/my-post.md` (for AI crawlers)
- Scheduled publishing (future dates hidden in production)
- Build-time manifest for production performance
- Full SEO scaffolding: Article/TechArticle, BreadcrumbList, FAQPage, HowTo, and CollectionPage JSON-LD schemas
- OpenGraph and Twitter card metadata on every page

## Writing posts

Create `.mdx` files in `content/blog/`:

```mdx
---
title: "My first post"
publishedAt: "2026-04-01T08:00:00.000Z"
excerpt: "A short summary for listings and SEO."
tags:
  - getting-started
---

Your content here. Regular markdown works.

## You can use headings

And **bold**, *italic*, [links](https://example.com), code blocks, and everything else markdown supports.
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `publishedAt` | Yes | ISO 8601 date. Future dates are hidden in production |
| `excerpt` | Yes | 1-2 sentence summary for listings and meta description |
| `description` | No | SEO description (falls back to excerpt) |
| `featureImage` | No | Path to hero image (e.g., `/images/blog/my-post.jpg`) |
| `featured` | No | Set to `true` to mark as featured |
| `tags` | No | Array of kebab-case tags |
| `updatedAt` | No | ISO date. Shown when different from publishedAt |
| `articleType` | No | `"article"`, `"tech"`, or `"howto"` for JSON-LD schema |
| `faqs` | No | Array of `{ question, answer }` for FAQ schema |
| `howToSteps` | No | Array of `{ name, text }` for HowTo schema |

### Filename convention

Name files with an optional date prefix: `20260401-my-post.mdx`. The date prefix is stripped from the URL slug, so the post appears at `/blog/my-post`.

Files without a date prefix work too: `my-post.mdx` becomes `/blog/my-post`.

## MDX components

These components are available in your posts automatically:

### Callout

```mdx
<Callout variant="warning" title="Heads up">
  This is important information.
</Callout>
```

Variants: `warning`, `info`, `tip`, `note`, `danger`. Each has a default emoji and color scheme. You can override with `emoji="🔥"` or custom `borderColor` and `backgroundColor`.

### Code blocks

Fenced code blocks get syntax highlighting, a language label, and a copy button automatically. No MDX component needed:

````mdx
```typescript
const greeting = "Hello, world!";
```
````

### GitHubRepo

```mdx
<GitHubRepo repo="supabase/supabase">
  Check out the Supabase repository for the full source.
</GitHubRepo>
```

### Mermaid diagrams

```mdx
<Mermaid chart={`
  graph TD
    A[Start] --> B[Process]
    B --> C[End]
`} />
```

Requires `mermaid` as a peer dependency: `npm install mermaid`.

### Video

```mdx
<Video src="/videos/demo.mp4" caption="A quick demo" poster="/images/poster.jpg" />
```

### Social embeds

Just paste a YouTube, Twitter/X, or Instagram URL on its own line:

```mdx
https://www.youtube.com/watch?v=dQw4w9WgXcQ

https://twitter.com/user/status/123456789
```

The URLs are automatically converted to embedded players. No component import needed. Requires `react-tweet` for Twitter embeds: `npm install react-tweet`.

## Configuration

The `init` command creates a `blog.config.ts` at your project root:

```typescript
import { defineConfig } from "nerds-mdx-blog";

export default defineConfig({
  siteUrl: "https://example.com",
  blog: {
    title: "Blog",
    description: "My blog",
    basePath: "/blog",
    contentDir: "content/blog",
    postsPerPage: 12,
  },
  author: {
    name: "Your Name",
    url: "https://example.com/about",
    email: "you@example.com",
    twitter: "@handle",
    social: [
      "https://twitter.com/handle",
      "https://github.com/handle",
    ],
  },
  publisher: {
    name: "My Site",
    logo: "/images/logo.png",
  },
  tagAcronyms: ["ai", "api", "seo"],
});
```

All fields except `siteUrl` have sensible defaults. The config drives SEO metadata, RSS feed content, JSON-LD schemas, and tag formatting.

## Customizing the UI

### Tier 1: Theme tokens (zero code)

All components use CSS custom properties (`--primary`, `--foreground`, `--border`, etc.) via Tailwind utility classes. To change the accent color, override the CSS variable:

```css
:root {
  --primary: #8b5cf6; /* purple instead of blue */
}
```

### Tier 2: className props

Every component accepts a `className` prop:

```tsx
<BlogCard className="shadow-xl" {...post} />
<Callout className="rounded-2xl" variant="tip">Content</Callout>
```

### Tier 3: Edit the route files

The `init` command scaffolds route files into your `app/` directory. You own these files. Change the layout, add your logo, wrap components in your own markup -- whatever you need. The route files are intentionally simple and readable.

### NerdsUI integration

If you install `@strategicnerds/nerdsui-web`, the blog components automatically pick up your NerdsUI palette. No extra configuration needed. The blog uses the same CSS variable names (`--primary`, `--foreground`, `--background`, `--border`, etc.) and Tailwind classes (`bg-primary`, `text-foreground`, `border-border`).

To set up:
1. `npm install @strategicnerds/nerdsui-web`
2. Import the NerdsUI CSS in your global stylesheet
3. Delete the `blog-tokens.css` fallback file the init created

## CLI reference

### `npx nerds-mdx-blog init`

Scaffolds a complete blog into your Next.js project.

| Flag | Description |
|------|-------------|
| `--no-sample-posts` | Skip creating sample blog posts |
| `--content-dir <path>` | Content directory (default: `content/blog`) |
| `--blog-path <path>` | Blog URL path (default: `/blog`) |
| `--dry-run` | Show what would be created without writing files |

### `npx nerds-mdx-blog generate-manifest`

Builds the post metadata manifest for production. This runs automatically as a prebuild script (added to your `package.json` by `init`).

| Flag | Description |
|------|-------------|
| `--content-dir <path>` | Content directory (default: `content/blog`) |

## Data API

If you need programmatic access to your blog data:

```typescript
import { createBlog } from "nerds-mdx-blog";
import config from "./blog.config";

const blog = createBlog(config);

// All published posts (metadata only)
const posts = blog.getAllPosts();

// Single post with content
const post = blog.getPostBySlug("my-post");

// Related posts by tag similarity
const related = blog.getRelatedPosts("my-post", 3);

// Tag operations
const tags = blog.getAllTags();
const tagged = blog.getPostsByTag("tutorial");
const counts = blog.getTagCounts();

// Featured posts
const featured = blog.getFeaturedPosts();

// All posts with content (for RSS, sitemaps)
const allWithContent = blog.getAllPostsWithContent();
```

## How it works

**Development**: MDX files are read from disk on each request. All posts show (including future-dated ones) so you can preview scheduled content.

**Production**: A build-time manifest (`blog-manifest.json`) is generated by the `prebuild` script. Post metadata is served from this manifest instead of scanning the filesystem. Individual post content is still read from disk on first request, then cached by Next.js.

**Scheduled publishing**: Set a future `publishedAt` date. The post is visible in development but hidden from listings and static generation in production until the date arrives.

## Project structure after init

```
your-project/
  blog.config.ts              # Blog configuration
  content/
    blog/                     # Your MDX posts go here
      welcome.mdx
    blog-manifest.json        # Auto-generated (do not edit)
  src/
    lib/
      blog.ts                 # Thin config binding
    app/
      blog/
        page.tsx              # Blog listing
        [slug]/
          page.tsx            # Post page
          markdown/
            route.ts          # Raw markdown endpoint
        tag/
          [tag]/
            page.tsx          # Tag filter page
      api/
        rss/
          route.ts            # RSS feed
        blog/
          route.ts            # JSON API
```

## License

MIT
