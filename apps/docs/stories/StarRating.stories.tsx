import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StarRating } from "@foodie/ui";

const meta: Meta<typeof StarRating> = {
  title: "Composite/StarRating",
  component: StarRating,
  argTypes: {
    rating: { control: { type: "range", min: 0, max: 5, step: 1 } },
  },
  args: {
    rating: 3,
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

// Read-only (default when no onChange is passed) — mirrors Figma's Rating 0–5 variants.
export const ReadOnly: Story = {};

export const AllRatings: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {[0, 1, 2, 3, 4, 5].map((rating) => (
        <StarRating key={rating} rating={rating} />
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: function Render() {
    const [rating, setRating] = useState(3);
    return <StarRating rating={rating} onChange={setRating} />;
  },
};
