import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Matches the Figma Button component (Components page, node 4:22): 5 colors
 * (teal/orange/pink/yellow/green), each with Default/Hover/Focus/Disabled
 * states. States are handled natively, not as props:
 * - Hover: `hover:` pseudo-class per color
 * - Focus: browser-native `:focus-visible` + the shared `focus-ring` token.
 *   Figma's Focus frame uses a 3px border, which grows the box (52px ->
 *   58px tall). A real button can't resize on focus without an ugly layout
 *   jump, so this uses `outline` instead of `border` — same visual ring,
 *   but outline is drawn outside the box and never affects its size.
 * - Disabled: 50% opacity via the native `disabled` attribute, same fill as Default
 *
 * No border in any state — the box is padding-only (py-lg + 20px line
 * height = 52px tall, matching the Figma Default/Hover/Disabled frames).
 */
const button = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-lg px-xl py-lg",
    "text-[16px] font-bold leading-[20px] text-text-inverse",
    "transition-colors",
    "outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focus-ring",
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
