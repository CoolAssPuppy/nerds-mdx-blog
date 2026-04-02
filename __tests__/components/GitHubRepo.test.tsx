import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GitHubRepo } from "@/mdx/GitHubRepo";

describe("GitHubRepo", () => {
  it("should render children content", () => {
    render(
      <GitHubRepo repo="vercel/next.js">Check out Next.js</GitHubRepo>
    );
    expect(screen.getByText("Check out Next.js")).toBeInTheDocument();
  });

  it("should link to the correct GitHub URL", () => {
    render(
      <GitHubRepo repo="vercel/next.js">Next.js</GitHubRepo>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/vercel/next.js");
  });

  it("should open link in a new tab", () => {
    render(
      <GitHubRepo repo="vercel/next.js">Next.js</GitHubRepo>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render the GitHub SVG icon", () => {
    const { container } = render(
      <GitHubRepo repo="vercel/next.js">Next.js</GitHubRepo>
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <GitHubRepo repo="vercel/next.js" className="extra">
        Next.js
      </GitHubRepo>
    );
    expect(container.firstChild).toHaveClass("extra");
  });
});
