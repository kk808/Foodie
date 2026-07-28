/**
 * Matches the Figma Star Rating component (Components page, node 5:49):
 * 5 stars, 18x18px, 4px gap, Rating 0–5. Figma exports the star as an image
 * asset (two variants: filled/empty) hosted on a temporary Figma URL — not
 * something to embed long-term, so this renders the star as inline SVG
 * instead, toggling fill via the `rating/star` token vs. `border/subtle`.
 *
 * `size` added in Phase 6: the flow's "How did you like it?" step (node
 * 8:100) reuses this same component but at ~40px stars with an ~8px gap,
 * not the 18px/4px used everywhere else (DiscoveryListItem). Defaults to
 * "sm" so every existing call site is unaffected.
 */

const starSizes = {
  sm: { box: 18, gap: "gap-1" },
  lg: { box: 40, gap: "gap-2" },
} as const;

type StarProps = {
  filled: boolean;
  size: number;
};

function Star({ filled, size }: StarProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={size}
      height={size}
      aria-hidden="true"
      className={filled ? "text-rating-star" : "text-border-subtle"}
      fill="currentColor"
    >
      <path d="M9 1.125l2.394 4.85 5.354.778-3.874 3.777.914 5.332L9 13.25l-4.788 2.512.914-5.332L1.252 6.753l5.354-.778L9 1.125z" />
    </svg>
  );
}

export type StarRatingProps = {
  /** 0–5. Fractional values are rounded down to the nearest whole star. */
  rating: number;
  /** Total stars in the row — matches Figma's fixed 5, but left adjustable. */
  totalStars?: number;
  /** Renders interactive buttons (one per star) instead of a static display. */
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  /** "sm" (18px, default — DiscoveryListItem) or "lg" (40px — flow rating input). */
  size?: keyof typeof starSizes;
  className?: string;
};

export function StarRating({
  rating,
  totalStars = 5,
  onChange,
  readOnly = !onChange,
  size = "sm",
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: totalStars }, (_, i) => i + 1);
  const rounded = Math.max(0, Math.min(totalStars, Math.floor(rating)));
  const { box, gap } = starSizes[size];

  if (readOnly) {
    return (
      <div
        className={[gap, "flex items-start", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={`${rounded} out of ${totalStars} stars`}
      >
        {stars.map((n) => (
          <Star key={n} filled={n <= rounded} size={box} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[gap, "flex items-start", className].filter(Boolean).join(" ")}
      role="radiogroup"
      aria-label="Rating"
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === rounded}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          onClick={() => onChange?.(n)}
          className="outline-none focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-focus-ring rounded-sm"
        >
          <Star filled={n <= rounded} size={box} />
        </button>
      ))}
    </div>
  );
}
