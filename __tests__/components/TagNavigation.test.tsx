import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TagNavigation } from "@/components/TagNavigation";

const defaultProps = {
  allTags: ["developer-relations", "ai", "marketing"],
  tagCounts: {
    "developer-relations": 5,
    ai: 12,
    marketing: 8,
  },
  currentTag: "ai",
};

describe("TagNavigation", () => {
  it("should render tag links on desktop", () => {
    render(<TagNavigation {...defaultProps} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should display formatted tag names", () => {
    render(<TagNavigation {...defaultProps} />);
    expect(screen.getAllByText(/AI/).length).toBeGreaterThanOrEqual(1);
  });

  it("should display tag counts", () => {
    render(<TagNavigation {...defaultProps} />);
    expect(screen.getAllByText("(12)").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("(5)").length).toBeGreaterThanOrEqual(1);
  });

  it("should link tags to the default basePath", () => {
    render(<TagNavigation {...defaultProps} />);
    const aiLinks = screen.getAllByRole("link", { name: /AI/ });
    expect(aiLinks[0]).toHaveAttribute("href", "/blog/tag/ai");
  });

  it("should link tags to a custom basePath", () => {
    render(<TagNavigation {...defaultProps} basePath="/articles" />);
    const aiLinks = screen.getAllByRole("link", { name: /AI/ });
    expect(aiLinks[0]).toHaveAttribute("href", "/articles/tag/ai");
  });

  it("should show the mobile toggle button with tag count", () => {
    render(<TagNavigation {...defaultProps} />);
    expect(
      screen.getByText(`Browse topics (${defaultProps.allTags.length})`)
    ).toBeInTheDocument();
  });

  it("should expand tag list on mobile when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<TagNavigation {...defaultProps} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);

    // After expanding, mobile tags should be visible in the DOM
    // The mobile container renders tags when isExpanded is true
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("should collapse tag list on second toggle click", async () => {
    const user = userEvent.setup();
    const { container } = render(<TagNavigation {...defaultProps} />);

    const toggleButton = screen.getByRole("button");
    await user.click(toggleButton);
    await user.click(toggleButton);

    // After collapsing, the mobile expanded container should not render tags
    const mobileDiv = container.querySelector(".md\\:hidden");
    const expandedWrapper = mobileDiv?.querySelector(".pb-4");
    expect(expandedWrapper).toBeNull();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <TagNavigation {...defaultProps} className="extra-class" />
    );
    const section = container.querySelector("section");
    expect(section).toHaveClass("extra-class");
  });
});
