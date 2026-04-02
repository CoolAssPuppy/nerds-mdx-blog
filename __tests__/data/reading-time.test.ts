import { describe, it, expect } from "vitest";
import {
  stripCodeBlocksAndComponents,
  calculateReadingTime,
} from "@/data/reading-time";

describe("stripCodeBlocksAndComponents", () => {
  it("should strip fenced code blocks", () => {
    const input = "Before\n```typescript\nconst x = 1;\n```\nAfter";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("const x = 1");
  });

  it("should strip inline code", () => {
    const input = "Use `console.log` for debugging";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Use");
    expect(result).toContain("for debugging");
    expect(result).not.toContain("console.log");
  });

  it("should strip self-closing JSX components", () => {
    const input = "Before <MyComponent prop='value' /> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("MyComponent");
  });

  it("should strip JSX components with children", () => {
    const input = "Before <Callout>Some warning text</Callout> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("Callout");
    expect(result).not.toContain("Some warning text");
  });

  it("should strip HTML comments", () => {
    const input = "Before <!-- hidden comment --> After";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before");
    expect(result).toContain("After");
    expect(result).not.toContain("hidden comment");
  });

  it("should handle content with no strippable elements", () => {
    const input = "Just plain text with nothing special.";
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toBe(input);
  });

  it("should handle multiple code blocks", () => {
    const input = [
      "Intro text",
      "```js",
      "const a = 1;",
      "```",
      "Middle text",
      "```python",
      "x = 2",
      "```",
      "End text",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Intro text");
    expect(result).toContain("Middle text");
    expect(result).toContain("End text");
    expect(result).not.toContain("const a = 1");
    expect(result).not.toContain("x = 2");
  });

  it("should strip code blocks that contain triple backtick references in text", () => {
    const input = [
      "Explanation of code fences:",
      "```markdown",
      "Use ``` to start a code block.",
      "Then close with ```.",
      "```",
      "That was the example.",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Explanation of code fences:");
    expect(result).toContain("That was the example.");
    expect(result).not.toContain("Use ");
  });

  it("should strip multi-line JSX components with nested content", () => {
    const input = [
      "Before the callout.",
      "<Callout>",
      "  This is a warning.",
      "  It spans multiple lines.",
      "</Callout>",
      "After the callout.",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Before the callout.");
    expect(result).toContain("After the callout.");
    expect(result).not.toContain("This is a warning.");
    expect(result).not.toContain("It spans multiple lines.");
    expect(result).not.toContain("Callout");
  });

  it("should strip self-closing components with multiple props", () => {
    const input =
      'Text before <Image src="/photo.jpg" alt="A photo" width={800} height={600} /> text after.';
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Text before");
    expect(result).toContain("text after.");
    expect(result).not.toContain("Image");
    expect(result).not.toContain("photo.jpg");
  });

  it("should strip multi-line HTML comments", () => {
    const input = [
      "Visible text.",
      "<!--",
      "  This is a hidden",
      "  multi-line comment.",
      "-->",
      "More visible text.",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Visible text.");
    expect(result).toContain("More visible text.");
    expect(result).not.toContain("hidden");
    expect(result).not.toContain("multi-line comment");
  });

  it("should handle mixed strippable content types together", () => {
    const input = [
      "Intro paragraph with `inline code` here.",
      "",
      "```typescript",
      "const x = 42;",
      "```",
      "",
      "<Alert type='warning'>Watch out!</Alert>",
      "",
      "<!-- TODO: add more content -->",
      "",
      "<CodeExample />",
      "",
      "Final paragraph.",
    ].join("\n");
    const result = stripCodeBlocksAndComponents(input);

    expect(result).toContain("Intro paragraph with");
    expect(result).toContain("here.");
    expect(result).not.toContain("inline code");
    expect(result).not.toContain("const x = 42");
    expect(result).not.toContain("Alert");
    expect(result).not.toContain("Watch out!");
    expect(result).not.toContain("TODO");
    expect(result).not.toContain("CodeExample");
    expect(result).toContain("Final paragraph.");
  });

  it("should handle empty string input", () => {
    const result = stripCodeBlocksAndComponents("");
    expect(result).toBe("");
  });
});

describe("calculateReadingTime", () => {
  it("should return minimum 1 minute for short content", () => {
    const result = calculateReadingTime("Hello world.");

    expect(result).toBe("1");
  });

  it("should calculate reading time for longer content", () => {
    const words = Array(500).fill("word").join(" ");
    const result = calculateReadingTime(words);

    expect(Number(result)).toBeGreaterThanOrEqual(2);
  });

  it("should exclude code blocks from reading time", () => {
    const longCode = Array(1000).fill("code").join(" ");
    const content = `Short intro.\n\n\`\`\`typescript\n${longCode}\n\`\`\`\n\nShort outro.`;

    const result = calculateReadingTime(content);

    expect(result).toBe("1");
  });

  it("should return a string", () => {
    const result = calculateReadingTime("Some content here.");

    expect(typeof result).toBe("string");
  });
});
