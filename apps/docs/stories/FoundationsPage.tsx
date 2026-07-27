import { theme } from "@foodie/tokens/tailwind-theme";

/** Flattens a nested color object into { path: "brand.primary", value: "#hex" } entries. */
function flattenColors(
  node: unknown,
  prefix: string[] = []
): { path: string; value: string }[] {
  if (typeof node === "string") {
    return [{ path: prefix.join("."), value: node }];
  }
  if (node && typeof node === "object") {
    return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
      flattenColors(value, [...prefix, key])
    );
  }
  return [];
}

const colorSwatches = flattenColors(theme.colors);

/**
 * Renders the Foundations page (color primitives + semantic tokens, spacing,
 * radius) live from `@foodie/tokens` generated output — not hand-copied
 * values, per build plan §5. If a token changes upstream in Figma and gets
 * re-synced, this page updates automatically on the next build.
 */
export function FoundationsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, fontFamily: "sans-serif" }}>
      <section>
        <h2>Color</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {colorSwatches.map(({ path, value }) => (
            <div key={path} style={{ width: 120 }}>
              <div
                style={{
                  height: 72,
                  borderRadius: 10,
                  background: value,
                  border: "1px solid #eceae6",
                }}
              />
              <p style={{ fontSize: 11, margin: "6px 0 0", wordBreak: "break-word" }}>
                {path} <br />
                <code>{value}</code>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Spacing</h2>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
          {Object.entries(theme.spacing).map(([key, value]) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: value,
                  height: 24,
                  background: theme.colors.brand.primary,
                  borderRadius: 4,
                  margin: "0 auto",
                }}
              />
              <p style={{ fontSize: 10, margin: "4px 0 0" }}>
                {key} ({value})
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Radius</h2>
        <div style={{ display: "flex", gap: 16 }}>
          {Object.entries(theme.borderRadius).map(([key, value]) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: theme.colors.accent.orange,
                  borderRadius: value,
                }}
              />
              <p style={{ fontSize: 10, margin: "4px 0 0" }}>
                {key} ({value})
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
