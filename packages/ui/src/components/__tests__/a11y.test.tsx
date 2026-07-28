import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

import { Button } from "../Button";
import { TextField } from "../TextField";
import { Typography } from "../Typography";
import { StatTile } from "../StatTile";
import { StarRating } from "../StarRating";
import { StepProgress } from "../StepProgress";
import { DiscoveryListItem } from "../DiscoveryListItem";
import { FlowHeader } from "../FlowHeader";

/**
 * Phase 7 (accessibility hardening): automated `axe-core` checks per
 * component/state, run through the existing vitest suite so a11y
 * regressions show up in `pnpm test` like any other failure, not only in
 * Storybook's interactive a11y panel (`@storybook/addon-a11y`, `apps/docs`).
 *
 * `color-contrast` is disabled everywhere here: these components render in
 * jsdom with Tailwind utility *classes* but no compiled Tailwind stylesheet
 * loaded, so there's no real `background-color`/`color` for axe to read —
 * it would be checking against unstyled jsdom defaults, not the actual
 * design. Real contrast is verified separately against the token hex
 * values themselves (see TODO.md's "Color contrast findings" note), which
 * is the accurate place to check it since these components are built
 * entirely from tokens.
 *
 * `region`/`landmark-one-main`/`page-has-heading-one`/`html-has-lang` are
 * document-level rules that don't make sense for a component rendered in
 * isolation (no `<main>`, no single page heading, RTL's host `<div>` isn't
 * a full page) — disabled for the same reason every component-level axe
 * setup disables them.
 */
const axeOptions = {
  rules: {
    "color-contrast": { enabled: false },
    region: { enabled: false },
    "landmark-one-main": { enabled: false },
    "page-has-heading-one": { enabled: false },
    "html-has-lang": { enabled: false },
  },
};

describe("accessibility", () => {
  it("Button has no violations (default, disabled, each color)", async () => {
    const { container } = render(
      <div>
        <Button color="teal">Save</Button>
        <Button color="orange">Save</Button>
        <Button color="pink">Save</Button>
        <Button color="yellow">Save</Button>
        <Button color="green">Save</Button>
        <Button disabled>Save</Button>
      </div>
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("TextField has no violations (default, with a label, error state)", async () => {
    const { container } = render(
      <div>
        <label htmlFor="name">Name</label>
        <TextField id="name" placeholder="e.g., Sushi" />
        <TextField aria-label="Location" error />
      </div>
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("Typography has no violations across variants", async () => {
    const { container } = render(
      <div>
        <Typography variant="heading-xl">Heading XL</Typography>
        <Typography variant="heading-l">Heading L</Typography>
        <Typography variant="heading-m">Heading M</Typography>
        <Typography variant="body-regular">Body regular</Typography>
        <Typography variant="body-medium">Body medium</Typography>
        <Typography variant="label-caption">Label caption</Typography>
      </div>
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("StatTile has no violations", async () => {
    const { container } = render(
      <StatTile color="teal" value="47" label="Foods Tried" />
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("StarRating has no violations (read-only and interactive)", async () => {
    const { container } = render(
      <div>
        <StarRating rating={4} />
        <StarRating rating={3} onChange={() => {}} />
        <StarRating rating={5} size="lg" onChange={() => {}} />
      </div>
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("StepProgress has no violations", async () => {
    const { container } = render(<StepProgress currentStep={2} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("DiscoveryListItem has no violations", async () => {
    const { container } = render(
      <DiscoveryListItem name="Sushi" rating={5} date="21 Jul" />
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("FlowHeader has no violations", async () => {
    const { container } = render(<FlowHeader step={2} onClose={() => {}} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
