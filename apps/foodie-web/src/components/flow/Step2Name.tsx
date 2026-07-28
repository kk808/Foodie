"use client";

import { Button, TextField, Typography } from "@foodie/ui";

/**
 * Matches Figma Step 2 — What's it called? (node 8:56): the photo captured
 * in Step 1 previewed in a 160px-tall rounded box (node 8:67 — Figma uses a
 * literal 10px radius here, not a token value), a name text field, and a
 * "Next →" button that's disabled (50% opacity, per node 8:70) until a name
 * is entered.
 */
export type Step2NameProps = {
  photo: string | null;
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
};

export function Step2Name({ photo, name, onNameChange, onNext }: Step2NameProps) {
  return (
    <>
      <Typography variant="heading-xl" className="text-center">
        What&rsquo;s it called?
      </Typography>

      <div className="h-[160px] w-full overflow-hidden rounded-[10px] bg-bg-surface">
        {/* `img`, not `next/image`: a Phase 6 `FileReader` data URL, not a
            static/remote asset — Next's image optimizer has nothing to do
            here. (`eslint-config-next`'s `no-img-element` isn't wired into
            this app's lint config yet either — see TODO.md.) */}
        {photo ? (
          <img src={photo} alt="Your food" className="h-full w-full object-cover" />
        ) : null}
      </div>

      <TextField
        placeholder="e.g., Sushi, Pizza, Chocolate Cake..."
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        aria-label="What's it called?"
      />

      <Button color="teal" className="w-full" disabled={name.trim().length === 0} onClick={onNext}>
        Next →
      </Button>
    </>
  );
}
