import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatTile } from "../StatTile";

describe("StatTile", () => {
  it("renders value and label", () => {
    render(<StatTile value="47" label="Foods Tried" />);
    expect(screen.getByText("47")).toBeTruthy();
    expect(screen.getByText("Foods Tried")).toBeTruthy();
  });

  it("defaults to the teal color variant", () => {
    const { container } = render(<StatTile value="47" label="Foods Tried" />);
    expect(container.firstElementChild?.className).toContain("bg-brand-primary");
  });

  it("applies the requested color variant", () => {
    const { container } = render(
      <StatTile color="orange" value="47" label="Foods Tried" />
    );
    expect(container.firstElementChild?.className).toContain("bg-accent-orange");
  });
});
