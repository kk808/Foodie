import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@foodie/ui";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  argTypes: {
    color: {
      control: "select",
      options: ["teal", "orange", "pink", "yellow", "green"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    color: "teal",
    disabled: false,
    children: "Button Label",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Mirrors the Figma variant matrix: Color x State (Default/Hover/Focus/Disabled).
// Hover/Focus are real browser states here, not separate stories — try
// tabbing to the button to see the focus-ring, or hovering it.
export const Default: Story = {};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {(["teal", "orange", "pink", "yellow", "green"] as const).map((color) => (
        <Button key={color} color={color}>
          {color}
        </Button>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
