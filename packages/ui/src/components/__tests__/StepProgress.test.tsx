import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepProgress } from "../StepProgress";

describe("StepProgress", () => {
  it("exposes progress via ARIA", () => {
    render(<StepProgress currentStep={2} />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("2");
    expect(bar.getAttribute("aria-valuemax")).toBe("5");
  });

  it("fills exactly currentStep segments", () => {
    const { container } = render(<StepProgress currentStep={2} />);
    const segments = container.querySelectorAll(
      ':scope > div > div'
    );
    const filled = Array.from(segments).filter((el) =>
      el.className.includes("bg-brand-primary")
    );
    expect(filled).toHaveLength(2);
    expect(segments).toHaveLength(5);
  });

  it("respects a custom totalSteps", () => {
    render(<StepProgress currentStep={1} totalSteps={3} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuemax")).toBe("3");
  });
});
