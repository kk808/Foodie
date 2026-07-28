"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FlowHeader } from "@foodie/ui";
import { ScreenShell } from "@/components/ScreenShell";
import { Step1SnapPhoto } from "@/components/flow/Step1SnapPhoto";
import { Step2Name } from "@/components/flow/Step2Name";
import { Step3Location } from "@/components/flow/Step3Location";
import { Step4Rating } from "@/components/flow/Step4Rating";
import { Step5Notes } from "@/components/flow/Step5Notes";

/**
 * The "+ Try Something New" flow (Screens page, nodes 7:36/8:56/8:72/8:89/
 * 9:67) — Phase 6. One route holding all 5 steps as local client state
 * rather than 5 separate Next.js routes: nothing here needs to be
 * deep-linkable or shareable mid-flow, and a single `FoodEntry` draft object
 * threading through by index is simpler than 5 pages passing state via the
 * URL or a shared store.
 *
 * The close (✕) button in `FlowHeader` exits the flow back to Home,
 * discarding the in-progress entry — Figma has no "confirm discard" step,
 * so this doesn't invent one.
 *
 * Vertical gap between the header and the step content differs by step in
 * Figma (see `ScreenShell`'s `gapPx` note) — Steps 2 and 5 are 20px, the
 * rest are 24px.
 */
type FoodEntry = {
  photo: string | null;
  name: string;
  location: string;
  rating: number;
  notes: string;
};

const INITIAL_ENTRY: FoodEntry = {
  photo: null,
  name: "",
  location: "",
  rating: 5,
  notes: "",
};

const GAP_PX_BY_STEP: Record<number, number> = {
  1: 24,
  2: 20,
  3: 24,
  4: 24,
  5: 20,
};

export default function LogFlowPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [entry, setEntry] = useState<FoodEntry>(INITIAL_ENTRY);

  function handleClose() {
    router.push("/");
  }

  function handleSave() {
    // No backend yet (Phase 6 scope is the flow + local state, not
    // persistence) — logged for now so the captured entry is visible
    // somewhere until Home is wired to real data.
    console.log("Saved food entry", entry);
    router.push("/");
  }

  return (
    <ScreenShell variant="flow" gapPx={GAP_PX_BY_STEP[step]}>
      <FlowHeader step={step} onClose={handleClose} />

      {step === 1 && (
        <Step1SnapPhoto
          onPhotoSelected={(photo) => {
            setEntry((prev) => ({ ...prev, photo }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Step2Name
          photo={entry.photo}
          name={entry.name}
          onNameChange={(name) => setEntry((prev) => ({ ...prev, name }))}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3Location
          location={entry.location}
          onLocationChange={(location) => setEntry((prev) => ({ ...prev, location }))}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Step4Rating
          rating={entry.rating}
          onRatingChange={(rating) => setEntry((prev) => ({ ...prev, rating }))}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && (
        <Step5Notes
          notes={entry.notes}
          onNotesChange={(notes) => setEntry((prev) => ({ ...prev, notes }))}
          onSave={handleSave}
        />
      )}
    </ScreenShell>
  );
}
