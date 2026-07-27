import type { ReactNode } from "react";
import { StarRating } from "./StarRating";

/**
 * Matches the Figma Discovery List Item component (Components page, node
 * 5:54): a card with a colored icon swatch, food name, star rating, and
 * date. Figma's icon slot is a plain colored square with no glyph in the
 * source file — `icon` is exposed here as an optional ReactNode (emoji,
 * photo, icon component) so the API isn't limited to what's in the mockup.
 *
 * Width is `w-full` (not the Figma frame's fixed 360px) — same reasoning as
 * TextField: a real card should size to its container, not bake in the
 * mockup's demo width.
 */
export type DiscoveryListItemProps = {
  icon?: ReactNode;
  iconColor?: "orange" | "pink" | "yellow" | "green";
  name: string;
  rating: number;
  date: string;
  className?: string;
};

const iconColorClass: Record<NonNullable<DiscoveryListItemProps["iconColor"]>, string> = {
  orange: "bg-accent-orange",
  pink: "bg-accent-pink",
  yellow: "bg-accent-yellow",
  green: "bg-accent-green",
};

export function DiscoveryListItem({
  icon,
  iconColor = "orange",
  name,
  rating,
  date,
  className,
}: DiscoveryListItemProps) {
  return (
    <div
      className={[
        "flex w-full items-center gap-md",
        "h-[68px] rounded-lg bg-bg-surface px-lg py-[14px]",
        "shadow-card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]",
          iconColorClass[iconColor],
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-xs">
        <p className="truncate text-[16px] font-bold leading-[22px] text-text-primary">
          {name}
        </p>
        <div className="flex items-center gap-sm">
          <StarRating rating={rating} readOnly />
          <p className="text-[12px] font-normal leading-[16px] text-text-secondary">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
