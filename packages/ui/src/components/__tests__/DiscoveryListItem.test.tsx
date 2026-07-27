import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiscoveryListItem } from "../DiscoveryListItem";

describe("DiscoveryListItem", () => {
  it("renders the name, date, and a read-only rating", () => {
    render(
      <DiscoveryListItem name="Tonkotsu Ramen" rating={4} date="21 Jul" />
    );

    expect(screen.getByText("Tonkotsu Ramen")).toBeTruthy();
    expect(screen.getByText("21 Jul")).toBeTruthy();
    expect(screen.getByRole("img", { name: "4 out of 5 stars" })).toBeTruthy();
  });

  it("applies the requested icon color", () => {
    const { container } = render(
      <DiscoveryListItem
        name="Pad Thai"
        rating={3}
        date="12 Jul"
        iconColor="green"
      />
    );
    const iconBox = container.querySelector(".bg-accent-green");
    expect(iconBox).toBeTruthy();
  });
});
