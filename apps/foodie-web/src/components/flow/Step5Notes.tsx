"use client";

import { Button, Typography } from "@foodie/ui";

/**
 * Matches Figma Step 5 — Any thoughts? (node 9:67): an optional notes box
 * and the flow's final "Save to Collection ✓" button. The notes box (node
 * 9:80) is a plain Frame with a yellow border, not an "Input Field"
 * instance — so unlike Steps 2/3, it isn't `@foodie/ui`'s `TextField`, and
 * it's a multi-line textarea rather than a single-line input. Styled
 * locally here rather than added to `@foodie/ui` since Figma treats it as
 * bespoke to this one screen, not a reusable design-system input variant.
 */
export type Step5NotesProps = {
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
};

export function Step5Notes({ notes, onNotesChange, onSave }: Step5NotesProps) {
  return (
    <>
      <Typography variant="heading-xl">Any thoughts?</Typography>

      <span className="text-[32px]" aria-hidden="true">
        💭
      </span>

      <Typography variant="label-caption" color="secondary">
        (optional—you can skip!)
      </Typography>

      <textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="e.g., 'So yummy!' or 'Want to try again at a different restaurant!'"
        aria-label="Any thoughts?"
        rows={3}
        className={[
          "h-[90px] w-full resize-none rounded-md border-2 border-solid border-accent-yellow bg-bg-surface",
          "px-lg py-[14px] text-[15px] font-normal leading-[22px] text-text-secondary",
          "placeholder:text-text-secondary",
          "outline-none focus:border-accent-yellow-hover",
        ].join(" ")}
      />

      <Button color="yellow" className="w-full" onClick={onSave}>
        Save to Collection ✓
      </Button>
    </>
  );
}
