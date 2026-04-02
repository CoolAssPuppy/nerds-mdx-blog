#!/usr/bin/env node

import { runInit } from "./init.js";
import { runGenerateManifest } from "./generate-manifest.js";

const args = process.argv.slice(2);
const command = args[0];

function printUsage(): void {
  console.log(`
nerds-mdx-blog - Drop-in MDX blog for Next.js

Commands:
  init                  Set up a blog in your Next.js project
  generate-manifest     Build the blog post manifest for production

Options for init:
  --no-sample-posts     Skip creating sample blog posts
  --content-dir <path>  Content directory (default: content/blog)
  --blog-path <path>    Blog URL path (default: /blog)
  --dry-run             Show what would be created without writing files
`);
}

function parseFlag(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

switch (command) {
  case "init": {
    const result = runInit({
      noSamplePosts: hasFlag("--no-sample-posts"),
      contentDir: parseFlag("--content-dir"),
      blogPath: parseFlag("--blog-path"),
      dryRun: hasFlag("--dry-run"),
    });

    if (result.warnings.length > 0) {
      console.log("\nWarnings:");
      for (const w of result.warnings) {
        console.log(`  - ${w}`);
      }
    }

    if (result.filesCreated.length > 0) {
      console.log("\nFiles created:");
      for (const f of result.filesCreated) {
        console.log(`  + ${f}`);
      }
    }

    if (result.filesModified.length > 0) {
      console.log("\nFiles modified:");
      for (const f of result.filesModified) {
        console.log(`  ~ ${f}`);
      }
    }

    console.log(`
Done! Your blog is ready.

  Write posts:     content/blog/
  View your blog:  http://localhost:3000/blog

Run \`npm run dev\` and visit /blog to see it.
`);
    break;
  }

  case "generate-manifest": {
    const contentDir = parseFlag("--content-dir");
    runGenerateManifest(contentDir);
    break;
  }

  default:
    printUsage();
    break;
}
