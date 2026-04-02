import fs from "fs";
import path from "path";

export function addPrebuildScript(projectRoot: string): void {
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  if (!pkg.scripts) pkg.scripts = {};

  if (!pkg.scripts.prebuild) {
    pkg.scripts.prebuild = "nerds-mdx-blog generate-manifest";
  } else if (!pkg.scripts.prebuild.includes("nerds-mdx-blog")) {
    pkg.scripts.prebuild = `nerds-mdx-blog generate-manifest && ${pkg.scripts.prebuild}`;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

export function patchTailwindV3Config(projectRoot: string): void {
  const candidates = [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.mjs",
  ];

  for (const filename of candidates) {
    const configPath = path.join(projectRoot, filename);
    if (!fs.existsSync(configPath)) continue;

    let content = fs.readFileSync(configPath, "utf-8");

    if (!content.includes("nerds-mdx-blog")) {
      content = content.replace(
        /content:\s*\[/,
        'content: [\n    "./node_modules/@strategicnerds/nerds-mdx-blog/dist/**/*.{js,jsx}",',
      );
      fs.writeFileSync(configPath, content);
    }
    break;
  }
}

export function patchTailwindV4Css(
  projectRoot: string,
  globalCssPath: string
): void {
  const cssPath = path.join(projectRoot, globalCssPath);
  let content = fs.readFileSync(cssPath, "utf-8");

  if (content.includes("nerds-mdx-blog")) return;

  const sourceDirective =
    '@source "../node_modules/@strategicnerds/nerds-mdx-blog/dist";';

  if (content.includes('@import "tailwindcss"')) {
    content = content.replace(
      '@import "tailwindcss"',
      `@import "tailwindcss";\n${sourceDirective}`
    );
  } else if (content.includes("@import 'tailwindcss'")) {
    content = content.replace(
      "@import 'tailwindcss'",
      `@import 'tailwindcss';\n${sourceDirective}`
    );
  }

  fs.writeFileSync(cssPath, content);
}

export function patchNextConfig(projectRoot: string): void {
  const candidates = [
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
  ];

  for (const filename of candidates) {
    const configPath = path.join(projectRoot, filename);
    if (!fs.existsSync(configPath)) continue;

    let content = fs.readFileSync(configPath, "utf-8");

    if (!content.includes("transpilePackages")) {
      content = content.replace(
        /const nextConfig\s*[:=]\s*{/,
        'const nextConfig = {\n  transpilePackages: ["@strategicnerds/nerds-mdx-blog"],',
      );
    }

    if (!content.includes("slug.md")) {
      const rewriteBlock = `
  async rewrites() {
    return [
      {
        source: "/blog/:slug.md",
        destination: "/blog/:slug/markdown",
      },
    ];
  },`;

      content = content.replace(
        /const nextConfig\s*[:=]\s*{/,
        `const nextConfig = {${rewriteBlock}`,
      );
    }

    fs.writeFileSync(configPath, content);
    break;
  }
}

export function writeFileIfNotExists(
  filePath: string,
  content: string
): boolean {
  if (fs.existsSync(filePath)) return false;

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  return true;
}
