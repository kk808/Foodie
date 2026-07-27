import { cva } from "class-variance-authority";

/**
 * Matches the Figma Stat Tile component (Components page, node 5:11):
 * 3 colors (teal/orange/pink), 104x76px, value + label stacked and centered.
 */
const tile = cva(
  [
    "inline-flex flex-col items-center justify-center gap-[2px]",
    "h-[76px] w-[104px] p-md",
    "rounded-lg text-text-inverse",
  ].join(" "),
  {
    variants: {
      color: {
        teal: "bg-brand-primary",
        orange: "bg-accent-orange",
        pink: "bg-accent-pink",
      },
    },
    defaultVariants: {
      color: "teal",
    },
  }
);

export type StatTileColor = "teal" | "orange" | "pink";

export type StatTileProps = {
  color?: StatTileColor;
  value: string;
  label: string;
  className?: string;
};

export function StatTile({ color, value, label, className }: StatTileProps) {
  return (
    <div className={tile({ color, className })}>
      <p className="text-[24px] font-extrabold leading-[30px]">{value}</p>
      <p className="text-[12px] font-normal leading-[16px]">{label}</p>
    </div>
  );
}
