import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("defaults to the teal color variant", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").className).toContain("bg-brand-primary");
  });

  it("applies the requested color variant", () => {
    render(<Button color="orange">Save</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-accent-orange");
    expect(button.className).not.toContain("bg-brand-primary");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });
});
