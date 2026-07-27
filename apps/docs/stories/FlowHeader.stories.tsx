import type { Meta, StoryObj } from "@storybook/react";
import { FlowHeader } from "@foodie/ui";

const meta: Meta<typeof FlowHeader> = {
  title: "Composite/FlowHeader",
  component: FlowHeader,
  argTypes: {
    step: { control: { type: "range", min: 1, max: 5, step: 1 } },
  },
  args: {
    step: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 350 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FlowHeader>;

export const Default: Story = {};

export const StepThree: Story = {
  args: { step: 3 },
};

export const WithClose: Story = {
  args: { step: 2, onClose: () => alert("closed") },
};
