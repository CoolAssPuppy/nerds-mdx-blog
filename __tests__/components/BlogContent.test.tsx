import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogContent } from "@/components/BlogContent";

describe("BlogContent", () => {
  it("should render children content", () => {
    render(<BlogContent>Article body text</BlogContent>);
    expect(screen.getByText("Article body text")).toBeInTheDocument();
  });

  it("should render copy link and copy article buttons", () => {
    render(<BlogContent>Content</BlogContent>);
    expect(screen.getByText("Copy link")).toBeInTheDocument();
    expect(screen.getByText("Copy article")).toBeInTheDocument();
  });

  it("should render two buttons", () => {
    render(<BlogContent>Content</BlogContent>);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("should apply custom className", () => {
    const { container } = render(
      <BlogContent className="custom-class">Content</BlogContent>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should apply default empty className when none provided", () => {
    const { container } = render(<BlogContent>Content</BlogContent>);
    expect(container.firstChild).toHaveClass("relative");
  });

  it("should show copied feedback after clicking copy link", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    render(<BlogContent>Content</BlogContent>);

    fireEvent.click(screen.getByText("Copy link"));

    await waitFor(() => {
      expect(screen.getAllByText("Copied!").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should show copied feedback after clicking copy article", async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const { container } = render(<BlogContent>Content</BlogContent>);

    // jsdom does not compute innerText so we patch the content ref div
    const contentDiv = container.querySelector(
      ".relative > div:last-child"
    ) as HTMLDivElement;
    Object.defineProperty(contentDiv, "innerText", {
      value: "Content",
      configurable: true,
    });

    fireEvent.click(screen.getByText("Copy article"));

    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("should not crash when clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: () => Promise.reject(new Error("Not supported")),
      },
      writable: true,
      configurable: true,
    });

    render(<BlogContent>Content</BlogContent>);

    fireEvent.click(screen.getByText("Copy link"));

    // Should still show "Copy link" (no crash, no state change on error)
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });
});
