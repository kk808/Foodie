/**
 * Matches the Figma Star Rating component (Components page, node 5:49):
 * 5 stars, 18x18px, 4px gap, Rating 0–5. Figma exports the star as an image
 * asset (two variants: filled/empty) hosted on a temporary Figma URL — not
 * something to embed long-term, so this renders the star as inline SVG
 * instead, toggling fill via the `rating/star` token vs. `border/subtle`.
 */

type StarProps = {
  filled: boolean;
};

function Star({ filled }: StarProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      width="18"
      height="18"
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
  className?: string;
};

export function StarRating({
  rating,
  totalStars = 5,
  onChange,
  readOnly = !onChange,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: totalStars }, (_, i) => i + 1);
  const rounded = Math.max(0, Math.min(totalStars, Math.floor(rating)));

  if (readOnly) {
    return (
      <div
        className={["flex gap-1 items-start", className].filter(Boolean).join(" ")}
        role="img"
        aria-label={`${rounded} out of ${totalStars} stars`}
      >
        {stars.map((n) => (
          <Star key={n} filled={n <= rounded} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={["flex gap-1 items-start", className].filter(Boolean).join(" ")}
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
          <Star filled={n <= rounded} />
        </button>
      ))}
    </div>
  );
}
