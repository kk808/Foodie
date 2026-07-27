import type { Meta, StoryObj } from "@storybook/react";
import { FoundationsPage } from "./FoundationsPage";

/**
 * Foundations — color primitives + semantic tokens, spacing, and radius,
 * rendered live from `@foodie/tokens` generated output (build plan §5).
 * Mirrors the Figma Foundations page (node 1:52).
 */
const meta: Meta<typeof FoundationsPage> = {
  title: "Foundations/Overview",
  component: FoundationsPage,
};

export default meta;
type Story = StoryObj<typeof FoundationsPage>;

export const Overview: Story = {};
