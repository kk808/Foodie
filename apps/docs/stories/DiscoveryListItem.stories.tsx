import type { Meta, StoryObj } from "@storybook/react";
import { DiscoveryListItem } from "@foodie/ui";

const meta: Meta<typeof DiscoveryListItem> = {
  title: "Pattern/DiscoveryListItem",
  component: DiscoveryListItem,
  argTypes: {
    iconColor: { control: "select", options: ["orange", "pink", "yellow", "green"] },
    rating: { control: { type: "range", min: 0, max: 5, step: 1 } },
  },
  args: {
    name: "Tonkotsu Ramen",
    rating: 4,
    date: "21 Jul",
    iconColor: "orange",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DiscoveryListItem>;

export const Default: Story = {};

export const List: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <DiscoveryListItem name="Tonkotsu Ramen" rating={5} date="21 Jul" iconColor="orange" />
      <DiscoveryListItem name="Margherita Pizza" rating={4} date="18 Jul" iconColor="pink" />
      <DiscoveryListItem name="Pad Thai" rating={3} date="12 Jul" iconColor="yellow" />
    </div>
  ),
};
