import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cva } from "class-variance-authority";

/**
 * Matches the Figma Input Field component (Components page, node 5:71):
 * Default (1px border-subtle) / Focused (2px border-brand-primary) states.
 * Focused is handled via native `:focus` — no separate state prop.
 *
 * `error` is scaffolded (aria-invalid + a data attribute for hooks/testing)
 * but not yet styled: the Figma file has no error/invalid color token, so
 * inventing one here would mean designing outside the source of truth.
 * See TODO.md. Once a token exists, wire the visual style in here.
 */
const input = cva(
  [
    "w-full",
    "bg-bg-surface",
    "rounded-md px-lg py-[14px]",
    "text-[15px] font-normal leading-[22px] text-text-secondary",
    "border border-solid border-border-subtle",
    "transition-colors",
    "placeholder:text-text-secondary",
    "focus:outline-none focus:border-2 focus:border-brand-primary",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" ")
);

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={input({ className })}
        aria-invalid={error || undefined}
        data-error={error || undefined}
        {...props}
      />
    );
  }
);

TextField.displayName = "TextField";
