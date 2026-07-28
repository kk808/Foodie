"use client";

import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Button, Typography } from "@foodie/ui";

/**
 * Matches Figma Step 1 — Snap Your Food (node 7:36): a dashed drop-zone
 * (bg-bg-surface, 2px dashed border-brand-primary, rounded-lg/16px) plus a
 * single "Choose Photo" button. Figma has no separate "photo selected"
 * state for this frame — picking a file advances straight to Step 2, where
 * the preview actually shows up (node 8:67).
 *
 * There's no real upload backend, so the file is read into a data URL via
 * `FileReader` and held in the flow's local state (`page.tsx`) — good
 * enough to preview in Step 2, not meant to persist anywhere.
 */
export type Step1SnapPhotoProps = {
  onPhotoSelected: (dataUrl: string) => void;
};

export function Step1SnapPhoto({ onPhotoSelected }: Step1SnapPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPhotoSelected(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <>
      <Typography variant="heading-xl">📸 Snap Your Food</Typography>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={[
          "flex h-[190px] w-full flex-col items-center justify-center gap-md",
          "rounded-lg border-2 border-dashed border-brand-primary bg-bg-surface",
          "outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-focus-ring",
        ].join(" ")}
      >
        <span className="text-[36px]" aria-hidden="true">
          📷
        </span>
        <Typography variant="heading-m">Take or upload a photo</Typography>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button color="orange" onClick={() => fileInputRef.current?.click()}>
        Choose Photo
      </Button>
    </>
  );
}
