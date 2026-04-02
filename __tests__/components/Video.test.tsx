import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Video } from "@/mdx/Video";

describe("Video", () => {
  it("should render a video element with the given src", () => {
    render(<Video src="/videos/demo.mp4" />);
    const video = document.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "/videos/demo.mp4");
  });

  it("should render with controls enabled", () => {
    render(<Video src="/videos/demo.mp4" />);
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("controls");
  });

  it("should render with playsInline attribute", () => {
    render(<Video src="/videos/demo.mp4" />);
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("playsinline");
  });

  it("should set preload to metadata", () => {
    render(<Video src="/videos/demo.mp4" />);
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("preload", "metadata");
  });

  it("should render poster when provided", () => {
    render(<Video src="/videos/demo.mp4" poster="/images/poster.jpg" />);
    const video = document.querySelector("video");
    expect(video).toHaveAttribute("poster", "/images/poster.jpg");
  });

  it("should render a caption when provided", () => {
    render(<Video src="/videos/demo.mp4" caption="A demo video" />);
    expect(screen.getByText("A demo video")).toBeInTheDocument();
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).toBeInTheDocument();
  });

  it("should not render a caption when omitted", () => {
    render(<Video src="/videos/demo.mp4" />);
    const figcaption = document.querySelector("figcaption");
    expect(figcaption).not.toBeInTheDocument();
  });

  it("should wrap content in a figure element", () => {
    const { container } = render(<Video src="/videos/demo.mp4" />);
    const figure = container.querySelector("figure");
    expect(figure).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <Video src="/videos/demo.mp4" className="custom" />
    );
    const figure = container.querySelector("figure");
    expect(figure).toHaveClass("custom");
  });
});
