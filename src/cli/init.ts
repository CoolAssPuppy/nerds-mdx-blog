import path from "path";
import { detectProject } from "./detect";
import {
  writeFileIfNotExists,
  addPrebuildScript,
  patchTailwindConfig,
  patchNextConfig,
} from "./patch";
import { blogConfigTemplate } from "./templates/blog-config";
import { blogLibTemplate } from "./templates/blog-lib";
import { blogPageTemplate } from "./templates/blog-page";
import { blogSlugPageTemplate } from "./templates/blog-slug-page";
import { blogTagPageTemplate } from "./templates/blog-tag-page";
import { rssRouteTemplate } from "./templates/rss-route";
import { blogApiRouteTemplate } from "./templates/blog-api-route";
import { markdownRouteTemplate } from "./templates/markdown-route";
import { samplePost1, samplePost2 } from "./templates/sample-posts";
import { generateManifest } from "../data/manifest";
import fs from "fs";

type InitOptions = {
  readonly projectRoot?: string;
  readonly noSamplePosts?: boolean;
  readonly contentDir?: string;
  readonly blogPath?: string;
  readonly dryRun?: boolean;
};

type InitResult = {
  readonly filesCreated: string[];
  readonly filesModified: string[];
  readonly warnings: string[];
};

export function runInit(options: InitOptions = {}): InitResult {
  const projectRoot = options.projectRoot || process.cwd();
  const contentDir = options.contentDir || "content/blog";
  const blogPath = options.blogPath || "/blog";
  const dryRun = options.dryRun || false;

  const project = detectProject(projectRoot);
  const filesCreated: string[] = [];
  const filesModified: string[] = [];
  const warnings: string[] = [];

  if (!project.hasNextConfig) {
    warnings.push(
      "No next.config found. Make sure this is a Next.js project."
    );
  }

  if (!project.hasTailwind) {
    warnings.push(
      "No tailwind.config found. Install Tailwind CSS for the blog components to look right."
    );
  }

  const write = (relativePath: string, content: string): boolean => {
    const fullPath = path.join(projectRoot, relativePath);
    if (dryRun) {
      filesCreated.push(relativePath);
      return true;
    }
    const created = writeFileIfNotExists(fullPath, content);
    if (created) filesCreated.push(relativePath);
    return created;
  };

  // 1. Config file
  write("blog.config.ts", blogConfigTemplate);

  // 2. Sample posts
  if (!options.noSamplePosts) {
    write(`${contentDir}/welcome-to-strategic-nerds.mdx`, samplePost1);
    write(`${contentDir}/the-midnight-coders-children.mdx`, samplePost2);
  }

  // 3. Binding layer
  const libDir = project.hasSrcDir ? "src/lib" : "lib";
  write(`${libDir}/blog.ts`, blogLibTemplate);

  // 4. Route files
  const appDir = project.appDir;
  const blogDir = `${appDir}${blogPath}`;

  write(`${blogDir}/page.tsx`, blogPageTemplate);
  write(`${blogDir}/[slug]/page.tsx`, blogSlugPageTemplate);
  write(`${blogDir}/[slug]/markdown/route.ts`, markdownRouteTemplate);
  write(`${blogDir}/tag/[tag]/page.tsx`, blogTagPageTemplate);

  // 5. API routes
  write(`${appDir}/api/rss/route.ts`, rssRouteTemplate);
  write(
    `${appDir}/api/blog/route.ts`,
    blogApiRouteTemplate("https://example.com", blogPath)
  );

  // 6. Fallback CSS (only if NerdsUI not installed)
  if (!project.hasNerdsUI) {
    write(`${blogDir}/blog-tokens.css`, fallbackCss());
  }

  // 7. Patch existing files
  if (!dryRun) {
    try {
      addPrebuildScript(projectRoot);
      filesModified.push("package.json");
    } catch {
      warnings.push("Could not patch package.json. Add prebuild script manually.");
    }

    if (project.hasTailwind) {
      try {
        patchTailwindConfig(projectRoot, "@strategicnerds/nerds-mdx-blog");
        filesModified.push("tailwind.config.*");
      } catch {
        warnings.push("Could not patch tailwind config.");
      }
    }

    if (project.hasNextConfig) {
      try {
        patchNextConfig(projectRoot);
        filesModified.push("next.config.*");
      } catch {
        warnings.push("Could not patch next.config.");
      }
    }

    // 8. Generate initial manifest
    const fullContentDir = path.join(projectRoot, contentDir);
    if (fs.existsSync(fullContentDir)) {
      const manifest = generateManifest(fullContentDir);
      const manifestPath = path.join(
        fullContentDir,
        "..",
        "blog-manifest.json"
      );
      fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
      filesCreated.push("content/blog-manifest.json");
    }
  }

  return { filesCreated, filesModified, warnings };
}

function fallbackCss(): string {
  return `/* @strategicnerds/nerds-mdx-blog fallback tokens -- delete this file if you install NerdsUI */
@import "@strategicnerds/nerds-mdx-blog/css/fallback.css";
`;
}
