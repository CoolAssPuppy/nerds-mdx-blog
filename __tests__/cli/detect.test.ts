import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { detectProject } from "@/cli/detect";

let tmpDir: string;

function createFile(relativePath: string, content = ""): void {
  const fullPath = path.join(tmpDir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "nerds-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("detectProject", () => {
  it("should detect src/ directory", () => {
    fs.mkdirSync(path.join(tmpDir, "src"));
    createFile("package.json", "{}");

    const result = detectProject(tmpDir);
    expect(result.hasSrcDir).toBe(true);
    expect(result.appDir).toBe("src/app");
  });

  it("should detect no src/ directory", () => {
    createFile("package.json", "{}");

    const result = detectProject(tmpDir);
    expect(result.hasSrcDir).toBe(false);
    expect(result.appDir).toBe("app");
  });

  it("should detect tailwind.config.ts", () => {
    createFile("tailwind.config.ts", "export default {}");
    createFile("package.json", "{}");

    const result = detectProject(tmpDir);
    expect(result.hasTailwind).toBe(true);
  });

  it("should detect next.config.ts", () => {
    createFile("next.config.ts", "export default {}");
    createFile("package.json", "{}");

    const result = detectProject(tmpDir);
    expect(result.hasNextConfig).toBe(true);
  });

  it("should detect NerdsUI in dependencies", () => {
    createFile(
      "package.json",
      JSON.stringify({
        dependencies: { "@strategicnerds/nerdsui-web": "^0.1.0" },
      })
    );

    const result = detectProject(tmpDir);
    expect(result.hasNerdsUI).toBe(true);
  });

  it("should not detect NerdsUI when absent", () => {
    createFile("package.json", JSON.stringify({ dependencies: {} }));

    const result = detectProject(tmpDir);
    expect(result.hasNerdsUI).toBe(false);
  });
});
