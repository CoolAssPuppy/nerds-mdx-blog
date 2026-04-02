import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { runInit } from "@/cli/init";

let tmpDir: string;

function createFile(relativePath: string, content = ""): void {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function setupNextProject(): void {
  fs.mkdirSync(path.join(tmpDir, "src"));
  createFile("package.json", JSON.stringify({ scripts: {} }, null, 2));
  createFile("next.config.ts", "const nextConfig = {};\nexport default nextConfig;");
  createFile(
    "tailwind.config.ts",
    'export default { content: [\n  "./src/**/*.tsx"\n] };'
  );
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nerds-init-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("runInit", () => {
  it("should create blog config file", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(result.filesCreated).toContain("blog.config.ts");
    expect(fs.existsSync(path.join(tmpDir, "blog.config.ts"))).toBe(true);
  });

  it("should create sample posts by default", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.includes("content/blog/"))
    ).toBe(true);
  });

  it("should skip sample posts when --no-sample-posts", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir, noSamplePosts: true });

    expect(
      result.filesCreated.filter((f) => f.includes("content/blog/")).length
    ).toBe(0);
  });

  it("should create route files in src/app when src/ exists", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.startsWith("src/app/blog/"))
    ).toBe(true);
  });

  it("should create route files in app/ when no src/", () => {
    createFile("package.json", JSON.stringify({ scripts: {} }, null, 2));
    createFile("next.config.ts", "const nextConfig = {};\nexport default nextConfig;");

    const result = runInit({ projectRoot: tmpDir });

    expect(result.filesCreated.some((f) => f.startsWith("app/blog/"))).toBe(
      true
    );
  });

  it("should patch package.json with prebuild script", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    const pkg = JSON.parse(
      fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8")
    );
    expect(pkg.scripts.prebuild).toContain("nerds-mdx-blog generate-manifest");
  });

  it("should create fallback CSS when NerdsUI not installed", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.includes("blog-tokens.css"))
    ).toBe(true);
  });

  it("should not create fallback CSS when NerdsUI is installed", () => {
    setupNextProject();
    createFile(
      "package.json",
      JSON.stringify({
        scripts: {},
        dependencies: { "@strategicnerds/nerdsui-web": "^0.1.0" },
      })
    );

    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.includes("blog-tokens.css"))
    ).toBe(false);
  });

  it("should not overwrite existing files", () => {
    setupNextProject();
    createFile("blog.config.ts", "// existing config");

    const result = runInit({ projectRoot: tmpDir });

    expect(result.filesCreated).not.toContain("blog.config.ts");
    const content = fs.readFileSync(
      path.join(tmpDir, "blog.config.ts"),
      "utf-8"
    );
    expect(content).toBe("// existing config");
  });

  it("should support dry run mode", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir, dryRun: true });

    expect(result.filesCreated.length).toBeGreaterThan(0);
    expect(fs.existsSync(path.join(tmpDir, "blog.config.ts"))).toBe(false);
  });

  it("should generate initial manifest", () => {
    setupNextProject();
    runInit({ projectRoot: tmpDir });

    expect(
      fs.existsSync(path.join(tmpDir, "content/blog-manifest.json"))
    ).toBe(true);
  });

  it("should warn when no next.config found", () => {
    createFile("package.json", JSON.stringify({ scripts: {} }));

    const result = runInit({ projectRoot: tmpDir });

    expect(result.warnings.some((w) => w.includes("next.config"))).toBe(true);
  });

  it("should create blog lib binding file", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(result.filesCreated).toContain("src/lib/blog.ts");
  });

  it("should create RSS and API routes", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.includes("api/rss/route.ts"))
    ).toBe(true);
    expect(
      result.filesCreated.some((f) => f.includes("api/blog/route.ts"))
    ).toBe(true);
  });

  it("should create markdown route", () => {
    setupNextProject();
    const result = runInit({ projectRoot: tmpDir });

    expect(
      result.filesCreated.some((f) => f.includes("[slug]/markdown/route.ts"))
    ).toBe(true);
  });
});
