import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedPosts } from "@/components/RelatedPosts";

const makePosts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    slug: `post-${i + 1}`,
    title: `Post ${i + 1}`,
    excerpt: `Excerpt for post ${i + 1}`,
    publishedAt: `2026-01-${String(i + 1).padStart(2, "0")}T08:00:00.000Z`,
    featureImage: `/images/post-${i + 1}.jpg`,
  }));

describe("RelatedPosts", () => {
  it("should render nothing when posts array is empty", () => {
    const { container } = render(
      <RelatedPosts posts={[]} currentSlug="current" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render nothing when only post matches currentSlug", () => {
    const posts = [
      {
        slug: "current",
        title: "Current Post",
        excerpt: "Excerpt",
        publishedAt: "2026-01-01T08:00:00.000Z",
      },
    ];
    const { container } = render(
      <RelatedPosts posts={posts} currentSlug="current" />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render the continue reading heading", () => {
    render(
      <RelatedPosts posts={makePosts(2)} currentSlug="not-in-list" />
    );
    expect(screen.getByText("Continue reading")).toBeInTheDocument();
  });

  it("should exclude the current post from related posts", () => {
    render(
      <RelatedPosts posts={makePosts(3)} currentSlug="post-2" />
    );
    expect(screen.queryByText("Post 2")).not.toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
  });

  it("should limit to three related posts", () => {
    render(
      <RelatedPosts posts={makePosts(5)} currentSlug="not-in-list" />
    );
    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post 2")).toBeInTheDocument();
    expect(screen.getByText("Post 3")).toBeInTheDocument();
    expect(screen.queryByText("Post 4")).not.toBeInTheDocument();
  });

  it("should link posts to the default /blog basePath", () => {
    render(
      <RelatedPosts posts={makePosts(1)} currentSlug="not-in-list" />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/post-1");
  });

  it("should link posts to a custom basePath", () => {
    render(
      <RelatedPosts
        posts={makePosts(1)}
        currentSlug="not-in-list"
        basePath="/articles"
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/post-1");
  });

  it("should render feature images when provided", () => {
    const { container } = render(
      <RelatedPosts posts={makePosts(1)} currentSlug="not-in-list" />
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src");
  });

  it("should render formatted dates", () => {
    render(
      <RelatedPosts posts={makePosts(1)} currentSlug="not-in-list" />
    );
    expect(screen.getByText("Jan 2026")).toBeInTheDocument();
  });

  it("should render without feature image when not provided", () => {
    const posts = [
      {
        slug: "no-image",
        title: "No Image Post",
        excerpt: "Excerpt",
        publishedAt: "2026-01-01T08:00:00.000Z",
      },
    ];
    render(<RelatedPosts posts={posts} currentSlug="not-in-list" />);
    expect(screen.getByText("No Image Post")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
