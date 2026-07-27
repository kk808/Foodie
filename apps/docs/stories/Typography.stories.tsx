import type { Meta, StoryObj } from "@storybook/react";
import { Typography, type TypographyVariant } from "@foodie/ui";

const variants: TypographyVariant[] = [
  "heading-xl",
  "heading-l",
  "heading-m",
  "body-regular",
  "body-medium",
  "label-caption",
  "button-label",
];

const meta: Meta<typeof Typography> = {
  title: "Primitives/Typography",
  component: Typography,
  argTypes: {
    variant: { control: "select", options: variants },
    color: { control: "select", options: ["primary", "secondary", "inverse"] },
  },
  args: {
    variant: "body-regular",
    children: "Aa Bb Cc 123",
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {};

// Mirrors the Foundations page's Typography specimen (node 1:143) — all 7
// text styles rendered live from the same variant map the component uses.
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {variants.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant} — Aa Bb Cc 123
        </Typography>
      ))}
    </div>
  ),
};
