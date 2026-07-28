"use client";

import { Button, StarRating, Typography } from "@foodie/ui";

/**
 * Matches Figma Step 4 — How did you like it? (node 8:89): a 40px-star
 * interactive rating (size="lg", added to `StarRating` in Phase 6 — see
 * component comment) and a reaction caption. Figma only shows the default
 * 5-star "😍 Love it!" state, so the other four reaction labels are a small
 * local addition to make the control feel real when rating is changed.
 */
const REACTIONS: Record<number, string> = {
  1: "😕 Not for me",
  2: "😐 It was OK",
  3: "🙂 Pretty good",
  4: "😋 Really good!",
  5: "😍 Love it!",
};

export type Step4RatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
  onNext: () => void;
};

export function Step4Rating({ rating, onRatingChange, onNext }: Step4RatingProps) {
  return (
    <>
      <Typography variant="heading-xl">How did you like it?</Typography>

      <StarRating size="lg" rating={rating} onChange={onRatingChange} />

      <Typography variant="heading-m">{REACTIONS[rating] ?? REACTIONS[5]}</Typography>

      <Button color="pink" className="w-full" onClick={onNext}>
        Next →
      </Button>
    </>
  );
}
