import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TweetEmbed, YouTubeEmbed, InstagramEmbed } from "@/mdx/SocialEmbed";

vi.mock("react-tweet", () => ({
  Tweet: ({ id }: { id: string }) => (
    <div data-testid="tweet" data-tweet-id={id}>
      Mocked Tweet {id}
    </div>
  ),
}));

describe("TweetEmbed", () => {
  it("should render a tweet with the given id", () => {
    render(<TweetEmbed id="123456" />);
    const tweet = screen.getByTestId("tweet");
    expect(tweet).toHaveAttribute("data-tweet-id", "123456");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <TweetEmbed id="123456" className="extra" />
    );
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("YouTubeEmbed", () => {
  it("should render an iframe with the correct YouTube URL", () => {
    render(<YouTubeEmbed id="dQw4w9WgXcQ" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/dQw4w9WgXcQ"
    );
  });

  it("should use the default title when none is provided", () => {
    render(<YouTubeEmbed id="dQw4w9WgXcQ" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("title", "YouTube video");
  });

  it("should use a custom title when provided", () => {
    render(<YouTubeEmbed id="dQw4w9WgXcQ" title="My Video" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("title", "My Video");
  });

  it("should allow fullscreen", () => {
    render(<YouTubeEmbed id="dQw4w9WgXcQ" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("allowfullscreen");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <YouTubeEmbed id="dQw4w9WgXcQ" className="extra" />
    );
    expect(container.firstChild).toHaveClass("extra");
  });
});

describe("InstagramEmbed", () => {
  it("should render an iframe with the correct Instagram URL", () => {
    render(<InstagramEmbed id="CxYz123" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.instagram.com/p/CxYz123/embed"
    );
  });

  it("should have an accessible title", () => {
    render(<InstagramEmbed id="CxYz123" />);
    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("title", "Instagram post");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <InstagramEmbed id="CxYz123" className="extra" />
    );
    expect(container.firstChild).toHaveClass("extra");
  });
});
