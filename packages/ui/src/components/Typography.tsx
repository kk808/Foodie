import { createElement, forwardRef } from "react";
import type { HTMLAttributes, ElementType } from "react";

/**
 * Matches the 7 text styles on the Figma Foundations page (node 1:143):
 * Heading/XL, Heading/L, Heading/M, Body/Regular, Body/Medium,
 * Label/Caption, Button/Label. Typography is deliberately not modeled as a
 * Tailwind theme.fontSize scale (build plan §3/§4) — it's composed here as
 * plain utility classes per variant so downstream code doesn't need to
 * juggle a font-size/weight/line-height tuple by hand.
 */
const variantClassName = {
  "heading-xl": "text-[24px] font-extrabold leading-[30px]",
  "heading-l": "text-[20px] font-bold leading-[26px]",
  "heading-m": "text-[16px] font-bold leading-[22px]",
  "body-regular": "text-[15px] font-normal leading-[22px]",
  "body-medium": "text-[15px] font-medium leading-[22px]",
  "label-caption": "text-[12px] font-normal leading-[16px]",
  "button-label": "text-[16px] font-bold leading-[20px]",
} as const;

const colorClassName = {
  primary: "text-text-primary",
  secondary: "text-text-secondary",
  inverse: "text-text-inverse",
} as const;

/** Sensible default element per variant; override with the `as` prop. */
const defaultElement: Record<TypographyVariant, ElementType> = {
  "heading-xl": "h1",
  "heading-l": "h2",
  "heading-m": "h3",
  "body-regular": "p",
  "body-medium": "p",
  "label-caption": "span",
  "button-label": "span",
};

export type TypographyVariant = keyof typeof variantClassName;
export type TypographyColor = keyof typeof colorClassName;

export type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant: TypographyVariant;
  color?: TypographyColor;
  as?: ElementType;
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant, color = "primary", as, className, ...props }, ref) => {
    const Component = as ?? defaultElement[variant];
    const classes = [variantClassName[variant], colorClassName[color], className]
      .filter(Boolean)
      .join(" ");

    return createElement(Component, { ref, className: classes, ...props });
  }
);

Typography.displayName = "Typography";
