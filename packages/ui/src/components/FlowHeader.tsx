import { StepProgress } from "./StepProgress";

/**
 * Matches the header used on every flow step frame (Screens page, e.g. node
 * 7:37 + 7:45 on "Step 1 — Snap Your Food"): a close button + progress bar
 * row (`gap-lg`, 16px), followed by a "Step X of 5" caption. The two are
 * always shipped together in Figma, so they're one component rather than
 * StepProgress + a loose label.
 */
export type FlowHeaderProps = {
  /** 1-based current step. */
  step: number;
  totalSteps?: number;
  onClose?: () => void;
  className?: string;
};

export function FlowHeader({
  step,
  totalSteps = 5,
  onClose,
  className,
}: FlowHeaderProps) {
  return (
    <div
      className={["flex w-full flex-col gap-xl", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full items-center gap-lg">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={[
            "text-[18px] font-bold leading-none text-text-primary",
            "outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focus-ring",
          ].join(" ")}
        >
          ✕
        </button>
        <StepProgress
          currentStep={step}
          totalSteps={totalSteps}
          className="flex-1"
        />
      </div>
      <p className="text-[12px] font-normal leading-[16px] text-text-secondary">
        Step {step} of {totalSteps}
      </p>
    </div>
  );
}
