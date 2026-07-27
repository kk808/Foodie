import type { Meta, StoryObj } from "@storybook/react";
import { StatTile } from "@foodie/ui";

const meta: Meta<typeof StatTile> = {
  title: "Composite/StatTile",
  component: StatTile,
  argTypes: {
    color: { control: "select", options: ["teal", "orange", "pink"] },
  },
  args: {
    color: "teal",
    value: "47",
    label: "Foods Tried",
  },
};

export default meta;
type Story = StoryObj<typeof StatTile>;

export const Default: Story = {};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <StatTile color="teal" value="47" label="Foods Tried" />
      <StatTile color="orange" value="12" label="This Month" />
      <StatTile color="pink" value="Ramen" label="Fave Food" />
    </div>
  ),
};
