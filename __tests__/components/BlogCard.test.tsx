import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCard } from "@/components/BlogCard";

describe("BlogCard", () => {
  const defaultProps = {
    slug: "test-post",
    title: "Test Post Title",
    excerpt: "This is a test excerpt for the blog card.",
    publishedAt: "2026-01-15T08:00:00.000Z",
    basePath: "/blog",
  };

  it("should render title and excerpt", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    expect(screen.getByText(defaultProps.excerpt)).toBeInTheDocument();
  });

  it("should render formatted date", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText(/January 15, 2026/)).toBeInTheDocument();
  });

  it("should render reading time when provided", () => {
    render(<BlogCard {...defaultProps} readingTime="5" />);
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });

  it("should link to the post using basePath", () => {
    render(<BlogCard {...defaultProps} basePath="/articles" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/test-post");
  });

  it("should render feature image when provided", () => {
    render(<BlogCard {...defaultProps} featureImage="/images/test.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Test Post Title");
  });
});
