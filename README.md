# nerds-mdx-blog

Drop-in MDX blog for Next.js. Install, init, write posts.

## Quickstart

```bash
npm install @strategicnerds/nerds-mdx-blog
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

### Frontmatter reference

Every MDX file starts with a YAML frontmatter block between `---` markers. Here is every supported field:

```yaml
---
# REQUIRED FIELDS

title: "How to build a developer blog"
# The post title. Displayed on the post page, in blog cards, RSS feed,
# OpenGraph tags, and JSON-LD structured data.

publishedAt: "2026-04-01T08:00:00.000Z"
# ISO 8601 date and time. Controls sort order and scheduled publishing.
# Posts with a future date are visible in development but hidden from
# production listings until the date arrives. The date also appears in
# RSS <pubDate>, OpenGraph publishedTime, and JSON-LD datePublished.

excerpt: "A step-by-step guide to setting up an MDX blog with Next.js."
# 1-2 sentence summary. Used in blog card listings, RSS <description>,
# and as the default meta description for SEO if `description` is not set.

# OPTIONAL FIELDS

description: "Learn how to create a production-ready MDX blog..."
# SEO-specific meta description for the <meta name="description"> tag
# and OpenGraph description. If omitted, falls back to `excerpt`.
# Use this when you want a different description for search engines
# than what appears in blog card listings.

featureImage: "/images/blog/developer-blog.jpg"
# Path to the hero image. Rendered prominently at the top of the post
# page below the title. Also used as the OpenGraph image and Twitter
# card image for social sharing. Place images in your public/ directory.
# Displayed in blog cards on the listing page as well.

featured: true
# When true, the post is included in `getFeaturedPosts()` results.
# The BlogCard component renders featured posts in a wider layout.
# Default: false.

tags:
  - nextjs
  - tutorial
  - getting-started
# Array of kebab-case strings for categorization. Powers the tag
# filtering system (/blog/tag/nextjs), related post scoring, and
# search. Tags are displayed as clickable pills on the post page.
# The formatTagName function converts them to display names
# (e.g., "nextjs" -> "Nextjs", "ai" -> "AI").

updatedAt: "2026-06-15T08:00:00.000Z"
# ISO 8601 date. When present and different from publishedAt, the
# post page shows both the publish and update dates. Also used in
# OpenGraph modifiedTime and JSON-LD dateModified. If omitted,
# dateModified defaults to publishedAt.

articleType: "tech"
# Controls which JSON-LD schema type is generated for the post.
# Values:
#   "article"  -> schema.org/Article (default)
#   "tech"     -> schema.org/TechArticle (adds proficiencyLevel)
#   "howto"    -> schema.org/TechArticle (same as tech)
# If omitted, the system auto-detects from the title: posts with
# "how to", "guide", "tutorial", "framework", or "playbook" in
# the title get TechArticle. Everything else gets Article.

faqs:
  - question: "What is MDX?"
    answer: "MDX is markdown with JSX support."
  - question: "Do I need to know React?"
    answer: "Not for basic usage. MDX looks like regular markdown."
# Array of question/answer pairs. When present, generates a
# schema.org/FAQPage JSON-LD schema on the post page. This can
# trigger FAQ rich results in Google Search, showing your Q&A
# directly in search results.

howToSteps:
  - name: "Install the package"
    text: "Run npm install @strategicnerds/nerds-mdx-blog in your project."
  - name: "Initialize"
    text: "Run npx nerds-mdx-blog init to scaffold the blog."
  - name: "Write your first post"
    text: "Create an MDX file in content/blog/ with frontmatter."
# Array of step objects. When present, generates a schema.org/HowTo
# JSON-LD schema on the post page. This can trigger how-to rich
# results in Google Search with a numbered step display.
---
```

### Where each field appears

| Field | Blog card | Post page | OpenGraph | Twitter card | RSS feed | JSON-LD |
|-------|-----------|-----------|-----------|--------------|----------|---------|
| `title` | Title | H1 heading | og:title | twitter:title | item title | headline |
| `publishedAt` | Date | Date | publishedTime | -- | pubDate | datePublished |
| `excerpt` | Summary | Subtitle | (fallback) | (fallback) | description | description |
| `description` | -- | -- | og:description | twitter:description | -- | description |
| `featureImage` | Card image | Hero image | og:image | twitter:image | -- | image |
| `featured` | Wide layout | -- | -- | -- | -- | -- |
| `tags` | (searchable) | Tag pills | -- | -- | -- | -- |
| `updatedAt` | -- | Update date | modifiedTime | -- | -- | dateModified |
| `articleType` | -- | -- | -- | -- | -- | @type |
| `faqs` | -- | -- | -- | -- | -- | FAQPage |
| `howToSteps` | -- | -- | -- | -- | -- | HowTo |
| `readingTime` | "Xm read" | "X min read" | -- | -- | -- | -- |

Reading time is calculated automatically from the post content (excluding code blocks and JSX components). You do not set it in frontmatter.

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
import { defineConfig } from "@strategicnerds/nerds-mdx-blog";

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

## Layouts, headers, and footers

The blog pages are regular Next.js App Router pages inside your `app/` directory. They automatically inherit your site's root `layout.tsx`, which means your existing header, footer, navigation, and global styles apply to every blog page with zero configuration.

If you want blog-specific layout (a sidebar, different header, etc.), create a `layout.tsx` inside `app/blog/`:

```tsx
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-wrapper">
      {/* Blog-specific header, sidebar, etc. */}
      {children}
    </div>
  );
}
```

## Breadcrumbs

### Structured data (automatic)

Every blog post page automatically includes a `BreadcrumbList` JSON-LD schema in the page head:

```
Home > Blog > Post Title
```

This is invisible to users but tells search engines about your site hierarchy. Google can use it to display breadcrumbs in search results. It works out of the box -- no configuration needed.

### Visible breadcrumbs (bring your own)

The package does not ship a visible breadcrumb UI component because most sites already have one that matches their design system. To add visible breadcrumbs, edit the scaffolded `[slug]/page.tsx` and add your breadcrumb component above the header:

```tsx
// In app/blog/[slug]/page.tsx, inside the return:
<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
  {/* Add your breadcrumb component here */}
  <nav className="text-sm text-muted-foreground mb-6">
    <a href="/">Home</a> / <a href="/blog">Blog</a> / {post.title}
  </nav>

  <header className="mb-12">
    {/* ... rest of the page */}
  </header>
</div>
```

The scaffolded route files are yours to edit. The package provides the data and rendering; you control the layout.

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
import { createBlog } from "@strategicnerds/nerds-mdx-blog";
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
