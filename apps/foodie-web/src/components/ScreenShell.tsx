import type { HTMLAttributes, ReactNode } from "react";

/**
 * Matches the Figma Screens page (node 1:54): every screen (Home, Step 1-5)
 * is a 390px-wide mobile frame with `bg-bg-canvas` and 20px side padding.
 * What varies per screen is the vertical rhythm:
 * - Home (node 6:9): `pt-[60px]`, `gap-[20px]`, `items-start`
 * - Flow steps (e.g. node 7:36): `pt-[50px]`, `gap-[24px]` (`gap-xl`), `items-center`
 *
 * Home's 20px gap has no matching spacing token (the scale jumps from
 * `lg` 16px to `xl` 24px), so it's a literal `gap-[20px]` rather than
 * silently rounding to the nearest token — caught when actually wiring this
 * into the Home page in Phase 5 (was wrongly `gap-lg` before that).
 *
 * This lives in `foodie-web`, not `@foodie/ui` — it's the app's page-frame
 * shell (viewport width, route-level background), not a reusable
 * design-system primitive another app would want. `FlowHeader` stays in
 * `@foodie/ui` because it's a genuine composed UI pattern (close button +
 * progress bar + label); this is just "how wide is a screen and how much
 * does it pad," which is an app concern.
 */
export type ScreenShellVariant = "home" | "flow";

const variantClasses: Record<ScreenShellVariant, string> = {
  home: "pt-[60px] gap-[20px] items-start",
  flow: "pt-[50px] gap-xl items-center",
};

export type ScreenShellProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: ScreenShellVariant;
};

export function ScreenShell({
  children,
  variant = "flow",
  className,
  ...props
}: ScreenShellProps) {
  return (
    <div
      className={[
        "mx-auto flex w-full max-w-[390px] flex-col px-[20px]",
        "bg-bg-canvas",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
