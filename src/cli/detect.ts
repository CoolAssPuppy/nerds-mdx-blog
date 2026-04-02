import fs from "fs";
import path from "path";

type ProjectInfo = {
  readonly hasSrcDir: boolean;
  readonly hasTailwindV3: boolean;
  readonly hasTailwindV4: boolean;
  readonly hasTailwind: boolean;
  readonly hasNerdsUI: boolean;
  readonly hasNextConfig: boolean;
  readonly appDir: string;
  readonly projectRoot: string;
  readonly globalCssPath: string | null;
};

function fileExists(projectRoot: string, ...segments: string[]): boolean {
  return fs.existsSync(path.join(projectRoot, ...segments));
}

function findGlobalCss(projectRoot: string): string | null {
  const candidates = [
    "src/app/globals.css",
    "app/globals.css",
    "src/styles/globals.css",
    "styles/globals.css",
  ];
  for (const candidate of candidates) {
    if (fileExists(projectRoot, candidate)) return candidate;
  }
  return null;
}

function isTailwindV4(projectRoot: string, globalCssPath: string | null): boolean {
  if (!globalCssPath) return false;
  try {
    const css = fs.readFileSync(
      path.join(projectRoot, globalCssPath),
      "utf-8"
    );
    return css.includes('@import "tailwindcss"') || css.includes("@import 'tailwindcss'");
  } catch {
    return false;
  }
}

export function detectProject(projectRoot: string): ProjectInfo {
  const hasSrcDir = fileExists(projectRoot, "src");
  const appDir = hasSrcDir ? "src/app" : "app";

  const hasTailwindConfig =
    fileExists(projectRoot, "tailwind.config.ts") ||
    fileExists(projectRoot, "tailwind.config.js") ||
    fileExists(projectRoot, "tailwind.config.mjs");

  const hasNextConfig =
    fileExists(projectRoot, "next.config.ts") ||
    fileExists(projectRoot, "next.config.js") ||
    fileExists(projectRoot, "next.config.mjs");

  const globalCssPath = findGlobalCss(projectRoot);
  const tailwindV4 = isTailwindV4(projectRoot, globalCssPath);

  let hasNerdsUI = false;
  const pkgPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      hasNerdsUI = "@strategicnerds/nerdsui-web" in allDeps;
    } catch {
      // Invalid package.json
    }
  }

  return {
    hasSrcDir,
    hasTailwindV3: hasTailwindConfig && !tailwindV4,
    hasTailwindV4: tailwindV4,
    hasTailwind: hasTailwindConfig || tailwindV4,
    hasNerdsUI,
    hasNextConfig,
    appDir,
    projectRoot,
    globalCssPath,
  };
}
