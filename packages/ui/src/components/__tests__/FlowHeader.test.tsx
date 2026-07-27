import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlowHeader } from "../FlowHeader";

describe("FlowHeader", () => {
  it("shows the current step and progress bar", () => {
    render(<FlowHeader step={2} />);
    expect(screen.getByText("Step 2 of 5")).toBeTruthy();
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("2");
  });

  it("respects a custom totalSteps", () => {
    render(<FlowHeader step={1} totalSteps={3} />);
    expect(screen.getByText("Step 1 of 3")).toBeTruthy();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    render(<FlowHeader step={1} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
