import type { Meta, StoryObj } from "@storybook/react";
import { StepProgress } from "@foodie/ui";

const meta: Meta<typeof StepProgress> = {
  title: "Composite/StepProgress",
  component: StepProgress,
  argTypes: {
    currentStep: { control: { type: "range", min: 1, max: 5, step: 1 } },
  },
  args: {
    currentStep: 1,
  },
};

export default meta;
type Story = StoryObj<typeof StepProgress>;

export const Default: Story = {};

export const AllSteps: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3, 4, 5].map((step) => (
        <StepProgress key={step} currentStep={step} />
      ))}
    </div>
  ),
};
