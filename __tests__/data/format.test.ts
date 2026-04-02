import { describe, it, expect } from "vitest";
import { formatTagName } from "@/data/format";

describe("formatTagName", () => {
  it("should capitalize single words", () => {
    expect(formatTagName("tutorial")).toBe("Tutorial");
  });

  it("should convert kebab-case to title case", () => {
    expect(formatTagName("getting-started")).toBe("Getting Started");
  });

  it("should uppercase known acronyms", () => {
    expect(formatTagName("ai")).toBe("AI");
    expect(formatTagName("api")).toBe("API");
    expect(formatTagName("seo")).toBe("SEO");
    expect(formatTagName("roi")).toBe("ROI");
    expect(formatTagName("kpi")).toBe("KPI");
    expect(formatTagName("dx")).toBe("DX");
  });

  it("should handle mixed acronyms and words", () => {
    expect(formatTagName("ai-marketing")).toBe("AI Marketing");
    expect(formatTagName("developer-dx")).toBe("Developer DX");
  });

  it("should handle custom acronyms via parameter", () => {
    expect(formatTagName("sdk", ["sdk"])).toBe("SDK");
    expect(formatTagName("sdk-tools", ["sdk"])).toBe("SDK Tools");
  });

  it("should use default acronyms when none provided", () => {
    expect(formatTagName("plg")).toBe("PLG");
    expect(formatTagName("abm")).toBe("ABM");
  });
});
