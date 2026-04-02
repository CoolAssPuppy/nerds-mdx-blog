import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "@/mdx/Callout";

describe("Callout", () => {
  it("should render children content", () => {
    render(<Callout>Test message</Callout>);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("should render with a title", () => {
    render(<Callout title="Warning">Be careful</Callout>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Be careful")).toBeInTheDocument();
  });

  it("should render all five variants without error", () => {
    const variants = ["warning", "info", "tip", "note", "danger"] as const;
    for (const variant of variants) {
      const { unmount } = render(
        <Callout variant={variant}>Content for {variant}</Callout>
      );
      expect(screen.getByText(`Content for ${variant}`)).toBeInTheDocument();
      unmount();
    }
  });

  it("should use default note variant when none specified", () => {
    const { container } = render(<Callout>Default variant</Callout>);
    const calloutDiv = container.querySelector("[class*='border-l-4']");
    expect(calloutDiv).toBeInTheDocument();
  });

  it("should support custom emoji", () => {
    render(<Callout emoji="🔥">Hot take</Callout>);
    expect(screen.getByText("🔥")).toBeInTheDocument();
  });

  it("should apply custom border and background colors", () => {
    const { container } = render(
      <Callout borderColor="#ff0000" backgroundColor="#fff0f0">
        Custom colors
      </Callout>
    );
    const calloutDiv = container.querySelector("[class*='border-l-4']");
    expect(calloutDiv).toHaveStyle({ borderLeftColor: "#ff0000" });
    expect(calloutDiv).toHaveStyle({ backgroundColor: "#fff0f0" });
  });
});
