import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "@/mdx/CodeBlock";

describe("CodeBlock", () => {
  it("should render children content", () => {
    render(
      <CodeBlock>
        <code>const x = 1;</code>
      </CodeBlock>
    );
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("should render a copy button", () => {
    render(
      <CodeBlock>
        <code>hello</code>
      </CodeBlock>
    );
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("should display language label when provided", () => {
    render(
      <CodeBlock data-language="typescript">
        <code>const x: number = 1;</code>
      </CodeBlock>
    );
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("should render as figure when rehype-pretty-code attribute present", () => {
    const { container } = render(
      <CodeBlock data-rehype-pretty-code-figure="">
        <pre><code>code here</code></pre>
      </CodeBlock>
    );
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
