import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import {
  addPrebuildScript,
  patchTailwindConfig,
  patchNextConfig,
  writeFileIfNotExists,
} from "@/cli/patch";

let tmpDir: string;

function createFile(relativePath: string, content = ""): void {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function readFile(relativePath: string): string {
  return fs.readFileSync(path.join(tmpDir, relativePath), "utf-8");
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nerds-patch-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("addPrebuildScript", () => {
  it("should create scripts object when missing", () => {
    createFile("package.json", JSON.stringify({ name: "test" }));

    addPrebuildScript(tmpDir);

    const pkg = JSON.parse(readFile("package.json"));
    expect(pkg.scripts.prebuild).toBe("nerds-mdx-blog generate-manifest");
  });

  it("should add prebuild when scripts exists but prebuild is missing", () => {
    createFile(
      "package.json",
      JSON.stringify({ scripts: { build: "tsc" } }, null, 2)
    );

    addPrebuildScript(tmpDir);

    const pkg = JSON.parse(readFile("package.json"));
    expect(pkg.scripts.prebuild).toBe("nerds-mdx-blog generate-manifest");
    expect(pkg.scripts.build).toBe("tsc");
  });

  it("should not duplicate if prebuild already contains nerds-mdx-blog", () => {
    createFile(
      "package.json",
      JSON.stringify(
        { scripts: { prebuild: "nerds-mdx-blog generate-manifest" } },
        null,
        2
      )
    );

    addPrebuildScript(tmpDir);

    const pkg = JSON.parse(readFile("package.json"));
    expect(pkg.scripts.prebuild).toBe("nerds-mdx-blog generate-manifest");
  });

  it("should prepend to existing prebuild script", () => {
    createFile(
      "package.json",
      JSON.stringify(
        { scripts: { prebuild: "echo hello" } },
        null,
        2
      )
    );

    addPrebuildScript(tmpDir);

    const pkg = JSON.parse(readFile("package.json"));
    expect(pkg.scripts.prebuild).toBe(
      "nerds-mdx-blog generate-manifest && echo hello"
    );
  });
});

describe("patchTailwindConfig", () => {
  it("should add content path to tailwind.config.ts", () => {
    createFile(
      "tailwind.config.ts",
      'export default { content: [\n  "./src/**/*.tsx"\n] };'
    );

    patchTailwindConfig(tmpDir, "content/blog");

    const content = readFile("tailwind.config.ts");
    expect(content).toContain("nerds-mdx-blog");
  });

  it("should find tailwind.config.js when .ts is absent", () => {
    createFile(
      "tailwind.config.js",
      'module.exports = { content: [\n  "./src/**/*.tsx"\n] };'
    );

    patchTailwindConfig(tmpDir, "content/blog");

    const content = readFile("tailwind.config.js");
    expect(content).toContain("nerds-mdx-blog");
  });

  it("should find tailwind.config.mjs when .ts and .js are absent", () => {
    createFile(
      "tailwind.config.mjs",
      'export default { content: [\n  "./src/**/*.tsx"\n] };'
    );

    patchTailwindConfig(tmpDir, "content/blog");

    const content = readFile("tailwind.config.mjs");
    expect(content).toContain("nerds-mdx-blog");
  });

  it("should skip patching if nerds-mdx-blog is already present", () => {
    const original =
      'export default { content: [\n  "./node_modules/@strategicnerds/nerds-mdx-blog/dist/**/*.{js,jsx}",\n  "./src/**/*.tsx"\n] };';
    createFile("tailwind.config.ts", original);

    patchTailwindConfig(tmpDir, "content/blog");

    const content = readFile("tailwind.config.ts");
    expect(content).toBe(original);
  });

  it("should do nothing when no tailwind config exists", () => {
    patchTailwindConfig(tmpDir, "content/blog");
    // No error thrown, no files created
    expect(fs.existsSync(path.join(tmpDir, "tailwind.config.ts"))).toBe(false);
  });
});

describe("patchNextConfig", () => {
  const baseConfig =
    "const nextConfig = {\n  reactStrictMode: true,\n};\nexport default nextConfig;";

  it("should add transpilePackages to next.config.ts", () => {
    createFile("next.config.ts", baseConfig);

    patchNextConfig(tmpDir);

    const content = readFile("next.config.ts");
    expect(content).toContain("transpilePackages");
    expect(content).toContain("nerds-mdx-blog");
  });

  it("should add rewrites for .md URLs", () => {
    createFile("next.config.ts", baseConfig);

    patchNextConfig(tmpDir);

    const content = readFile("next.config.ts");
    expect(content).toContain("slug.md");
    expect(content).toContain("rewrites");
  });

  it("should skip transpilePackages if already present", () => {
    const configWithTranspile =
      'const nextConfig = {\n  transpilePackages: ["@strategicnerds/nerds-mdx-blog"],\n};\nexport default nextConfig;';
    createFile("next.config.ts", configWithTranspile);

    patchNextConfig(tmpDir);

    const content = readFile("next.config.ts");
    const matches = content.match(/transpilePackages/g);
    expect(matches).toHaveLength(1);
  });

  it("should skip rewrites if slug.md is already present", () => {
    const configWithRewrites =
      'const nextConfig = {\n  async rewrites() { return [{ source: "/blog/:slug.md", destination: "/blog/:slug/markdown" }]; },\n};\nexport default nextConfig;';
    createFile("next.config.ts", configWithRewrites);

    patchNextConfig(tmpDir);

    const content = readFile("next.config.ts");
    const matches = content.match(/slug\.md/g);
    expect(matches).toHaveLength(1);
  });

  it("should find next.config.js when .ts is absent", () => {
    createFile(
      "next.config.js",
      "const nextConfig = {\n  reactStrictMode: true,\n};\nmodule.exports = nextConfig;"
    );

    patchNextConfig(tmpDir);

    const content = readFile("next.config.js");
    expect(content).toContain("transpilePackages");
  });

  it("should do nothing when no next config exists", () => {
    patchNextConfig(tmpDir);
    expect(fs.existsSync(path.join(tmpDir, "next.config.ts"))).toBe(false);
  });
});

describe("writeFileIfNotExists", () => {
  it("should create file with content", () => {
    const filePath = path.join(tmpDir, "new-file.ts");

    const result = writeFileIfNotExists(filePath, "hello");

    expect(result).toBe(true);
    expect(fs.readFileSync(filePath, "utf-8")).toBe("hello");
  });

  it("should create intermediate directories", () => {
    const filePath = path.join(tmpDir, "a", "b", "c", "deep.ts");

    const result = writeFileIfNotExists(filePath, "deep content");

    expect(result).toBe(true);
    expect(fs.readFileSync(filePath, "utf-8")).toBe("deep content");
  });

  it("should skip existing files and return false", () => {
    const filePath = path.join(tmpDir, "existing.ts");
    fs.writeFileSync(filePath, "original");

    const result = writeFileIfNotExists(filePath, "replacement");

    expect(result).toBe(false);
    expect(fs.readFileSync(filePath, "utf-8")).toBe("original");
  });
});
