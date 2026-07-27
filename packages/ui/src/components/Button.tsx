import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Matches the Figma Button component (Components page, node 4:22): 5 colors
 * (teal/orange/pink/yellow/green), each with Default/Hover/Focus/Disabled
 * states. States are handled natively, not as props:
 * - Hover: `hover:` pseudo-class per color
 * - Focus: browser-native `:focus-visible` + the shared `focus-ring` token,
 *   not a per-color ring (matches build plan §4 — real focus, not decorative)
 * - Disabled: 50% opacity via the native `disabled` attribute, same fill as Default
 */
const button = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-lg px-xl py-lg",
    "text-[16px] font-bold leading-[20px] text-text-inverse",
    "border-[3px] border-solid border-transparent",
    "transition-colors",
    "focus-visible:outline-none focus-visible:border-focus-ring",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      color: {
        teal: "bg-brand-primary hover:bg-brand-primary-hover",
        orange: "bg-accent-orange hover:bg-accent-orange-hover",
        pink: "bg-accent-pink hover:bg-accent-pink-hover",
        yellow: "bg-accent-yellow hover:bg-accent-yellow-hover",
        green: "bg-accent-green hover:bg-accent-green-hover",
      },
    },
    defaultVariants: {
      color: "teal",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color, ...props }, ref) => {
    return (
      <button ref={ref} className={button({ color, className })} {...props} />
    );
  }
);

Button.displayName = "Button";
