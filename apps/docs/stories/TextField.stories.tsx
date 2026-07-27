import type { Meta, StoryObj } from "@storybook/react";
import { TextField } from "@foodie/ui";

const meta: Meta<typeof TextField> = {
  title: "Primitives/TextField",
  component: TextField,
  argTypes: {
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Placeholder text...",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TextField>;

// Focused state is native `:focus` — click into the field to see it (2px
// border-brand-primary vs the 1px border-subtle default per Figma node 5:67/5:69).
export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

// Scaffolded but unstyled — see TODO.md: no error/invalid color token exists
// in the Figma file yet, so this only sets aria-invalid/data-error for now.
export const ErrorScaffold: Story = {
  args: { error: true },
};
