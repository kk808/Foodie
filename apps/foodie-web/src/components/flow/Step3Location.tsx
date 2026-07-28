"use client";

import { Button, TextField, Typography } from "@foodie/ui";

/**
 * Matches Figma Step 3 — Where did you eat it? (node 8:72). Optional field —
 * the button is always enabled ("skip if you want" per node 8:84), no
 * validation gate like Step 2's name field.
 */
export type Step3LocationProps = {
  location: string;
  onLocationChange: (location: string) => void;
  onNext: () => void;
};

export function Step3Location({ location, onLocationChange, onNext }: Step3LocationProps) {
  return (
    <>
      <Typography variant="heading-xl">Where did you eat it?</Typography>

      <span className="text-[40px]" aria-hidden="true">
        🌍
      </span>

      <Typography variant="label-caption" color="secondary">
        (optional—skip if you want!)
      </Typography>

      <TextField
        placeholder="e.g., Home, Restaurant, Japan..."
        value={location}
        onChange={(event) => onLocationChange(event.target.value)}
        aria-label="Where did you eat it?"
      />

      <Button color="green" className="w-full" onClick={onNext}>
        Next →
      </Button>
    </>
  );
}
