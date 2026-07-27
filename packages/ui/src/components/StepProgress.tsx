/**
 * Matches the Figma Progress Step Bar component (Components page, node
 * 5:103): a row of 5 segments, 36x6px each, 4px gap. Segments up to and
 * including `currentStep` are filled (`brand-primary`); the rest are
 * `border-subtle`.
 */
export type StepProgressProps = {
  /** 1-based current step. */
  currentStep: number;
  totalSteps?: number;
  className?: string;
};

export function StepProgress({
  currentStep,
  totalSteps = 5,
  className,
}: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      className={["flex gap-xs h-[6px] items-start", className]
        .filter(Boolean)
        .join(" ")}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {steps.map((step) => (
        <div
          key={step}
          className={[
            "h-[6px] w-[36px] rounded-[3px]",
            step <= currentStep ? "bg-brand-primary" : "bg-border-subtle",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
