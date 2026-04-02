import fs from "fs";
import path from "path";

type ProjectInfo = {
  readonly hasSrcDir: boolean;
  readonly hasTailwind: boolean;
  readonly hasNerdsUI: boolean;
  readonly hasNextConfig: boolean;
  readonly appDir: string;
  readonly projectRoot: string;
};

function fileExists(projectRoot: string, ...segments: string[]): boolean {
  return fs.existsSync(path.join(projectRoot, ...segments));
}

export function detectProject(projectRoot: string): ProjectInfo {
  const hasSrcDir = fileExists(projectRoot, "src");
  const appDir = hasSrcDir ? "src/app" : "app";

  const hasTailwind =
    fileExists(projectRoot, "tailwind.config.ts") ||
    fileExists(projectRoot, "tailwind.config.js") ||
    fileExists(projectRoot, "tailwind.config.mjs");

  const hasNextConfig =
    fileExists(projectRoot, "next.config.ts") ||
    fileExists(projectRoot, "next.config.js") ||
    fileExists(projectRoot, "next.config.mjs");

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
    hasTailwind,
    hasNerdsUI,
    hasNextConfig,
    appDir,
    projectRoot,
  };
}
