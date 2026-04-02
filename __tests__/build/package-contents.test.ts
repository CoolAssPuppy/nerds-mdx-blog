import { describe, it, expect } from "vitest";
import { execFileSync } from "child_process";
import path from "path";
import fs from "fs";

const ROOT = path.resolve(__dirname, "../..");

describe("npm pack contents", () => {
  const packOutput = (() => {
    const raw = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: ROOT,
      encoding: "utf-8",
      timeout: 30000,
    });
    const parsed = JSON.parse(raw) as Array<{ files: Array<{ path: string }> }>;
    return parsed[0].files.map((f) => f.path);
  })();

  it("should include dist/ directory with expected subdirectories", () => {
    const distFiles = packOutput.filter((f) => f.startsWith("dist/"));
    expect(distFiles.length).toBeGreaterThan(0);

    const hasCliDir = distFiles.some((f) => f.startsWith("dist/cli/"));
    const hasDataDir = distFiles.some((f) => f.startsWith("dist/data/"));
    const hasComponentsDir = distFiles.some((f) =>
      f.startsWith("dist/components/")
    );

    expect(hasCliDir).toBe(true);
    expect(hasDataDir).toBe(true);
    expect(hasComponentsDir).toBe(true);
  });

  it("should include src/css/fallback.css", () => {
    expect(packOutput).toContain("src/css/fallback.css");
  });

  it("should include README.md", () => {
    const hasReadme = packOutput.some(
      (f) => f.toLowerCase() === "readme.md"
    );
    expect(hasReadme).toBe(true);
  });

  it("should include LICENSE", () => {
    const hasLicense = packOutput.some(
      (f) => f.toLowerCase() === "license" || f.toLowerCase() === "license.md"
    );
    expect(hasLicense).toBe(true);
  });

  it("should not include test files", () => {
    const testFiles = packOutput.filter(
      (f) => f.includes("__tests__") || f.includes(".test.")
    );
    expect(testFiles).toEqual([]);
  });

  it("should not include TypeScript source files from src/ (except css)", () => {
    const srcTsFiles = packOutput.filter(
      (f) => f.startsWith("src/") && !f.startsWith("src/css/") && f.endsWith(".ts")
    );
    expect(srcTsFiles).toEqual([]);
  });

  it("should not include vitest config or test setup", () => {
    const testInfra = packOutput.filter(
      (f) =>
        f.includes("vitest.config") ||
        f.includes("setup.ts") ||
        f.includes("__tests__")
    );
    expect(testInfra).toEqual([]);
  });

  it("should include package.json", () => {
    expect(packOutput).toContain("package.json");
  });

  it("should include declaration files in dist/", () => {
    const dtsFiles = packOutput.filter(
      (f) => f.startsWith("dist/") && f.endsWith(".d.ts")
    );
    expect(dtsFiles.length).toBeGreaterThan(0);
  });

  it("should match the files field in package.json", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT, "package.json"), "utf-8")
    );
    const filesField = pkg.files as string[];

    for (const pattern of filesField) {
      const cleanPattern = pattern.replace(/\/$/, "");
      const matchingFiles = packOutput.filter(
        (f) => f === cleanPattern || f.startsWith(cleanPattern + "/")
      );
      expect(
        matchingFiles.length,
        `Expected files matching "${pattern}" in pack output`
      ).toBeGreaterThan(0);
    }
  });
});
