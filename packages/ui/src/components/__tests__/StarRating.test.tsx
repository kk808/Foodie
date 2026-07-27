import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarRating } from "../StarRating";

describe("StarRating", () => {
  it("renders as a read-only image with an accessible label by default", () => {
    render(<StarRating rating={3} />);
    expect(screen.getByRole("img", { name: "3 out of 5 stars" })).toBeTruthy();
  });

  it("renders interactive radio buttons when onChange is provided", () => {
    render(<StarRating rating={3} onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("calls onChange with the clicked star's value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StarRating rating={2} onChange={onChange} />);

    await user.click(screen.getByRole("radio", { name: "4 stars" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("respects an explicit readOnly override even with onChange", () => {
    render(<StarRating rating={3} onChange={() => {}} readOnly />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });
});
