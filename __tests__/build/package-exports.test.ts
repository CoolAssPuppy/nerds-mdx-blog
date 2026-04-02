import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = path.resolve(__dirname, "../..");
const DIST = path.join(ROOT, "dist");

function tryImport(entryPoint: string): string {
  return execFileSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `import('${entryPoint}').then(() => console.log('OK')).catch(e => { console.error(e.message); process.exit(1) })`,
    ],
    { encoding: "utf-8", timeout: 10000 }
  ).trim();
}

describe("package exports", () => {
  it("should have dist/ directory after build", () => {
    expect(fs.existsSync(DIST)).toBe(true);
  });

  it("should resolve plugins entry point", () => {
    expect(tryImport(`${ROOT}/dist/plugins/index.js`)).toBe("OK");
  });

  it("should resolve data entry points", () => {
    expect(tryImport(`${ROOT}/dist/data/reading-time.js`)).toBe("OK");
    expect(tryImport(`${ROOT}/dist/data/format.js`)).toBe("OK");
    expect(tryImport(`${ROOT}/dist/data/manifest.js`)).toBe("OK");
    expect(tryImport(`${ROOT}/dist/data/rss.js`)).toBe("OK");
    expect(tryImport(`${ROOT}/dist/data/json-ld.js`)).toBe("OK");
  });

  it("should resolve config entry point", () => {
    expect(tryImport(`${ROOT}/dist/config.js`)).toBe("OK");
  });

  it("should resolve CLI without crashing", () => {
    const result = tryImport(`${ROOT}/dist/cli/index.js`);
    expect(result).toContain("nerds-mdx-blog");
  });

  it("should have all relative imports in dist use .js extensions", () => {
    const jsFiles = fs
      .readdirSync(DIST, { recursive: true })
      .filter((f): f is string => typeof f === "string" && f.endsWith(".js"))
      .map((f) => path.join(DIST, f));

    const failures: string[] = [];

    for (const file of jsFiles) {
      // Skip template files -- they contain template literals for user code
      if (file.includes("templates/")) continue;

      const content = fs.readFileSync(file, "utf-8");
      const relativeImports = content.match(
        /from\s+["'](\.\.?\/[^"']+)["']/g
      );
      if (!relativeImports) continue;

      for (const imp of relativeImports) {
        const importPath = imp.match(/["'](\.\.?\/[^"']+)["']/)?.[1];
        if (
          importPath &&
          !importPath.endsWith(".js") &&
          !importPath.endsWith(".css")
        ) {
          failures.push(`${path.relative(DIST, file)}: ${imp}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
