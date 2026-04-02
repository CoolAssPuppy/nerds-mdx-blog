import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogGrid } from "@/components/BlogGrid";

const makePosts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `post-${i}`,
    title: `Post ${i}`,
    excerpt: `Excerpt for post ${i}`,
    publishedAt: new Date(2026, 0, count - i).toISOString(),
    tags: [i % 2 === 0 ? "even" : "odd"],
  }));

describe("BlogGrid", () => {
  it("should render posts", () => {
    render(<BlogGrid initialPosts={makePosts(3)} basePath="/blog" />);
    expect(screen.getByText("Post 0")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
  });

  it("should show search input with post count", () => {
    render(<BlogGrid initialPosts={makePosts(5)} basePath="/blog" />);
    const input = screen.getByPlaceholderText(/Search 5 posts/);
    expect(input).toBeInTheDocument();
  });

  it("should filter posts by search query", async () => {
    render(<BlogGrid initialPosts={makePosts(5)} basePath="/blog" />);
    const input = screen.getByPlaceholderText(/Search/);

    await userEvent.type(input, "Post 0");
    expect(screen.getByText("Post 0")).toBeInTheDocument();
    expect(screen.queryByText("Post 1")).not.toBeInTheDocument();
  });

  it("should show empty state when no posts", () => {
    render(<BlogGrid initialPosts={[]} basePath="/blog" />);
    expect(screen.getByText(/No blog posts yet/)).toBeInTheDocument();
  });

  it("should show result count when filtering", async () => {
    render(<BlogGrid initialPosts={makePosts(5)} basePath="/blog" />);
    const input = screen.getByPlaceholderText(/Search/);

    await userEvent.type(input, "Post 0");
    expect(screen.getByText(/1 post found/)).toBeInTheDocument();
  });
});
