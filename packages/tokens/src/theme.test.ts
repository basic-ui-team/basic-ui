import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
// The complete stylesheet consumers ship: the authored theme entry plus the
// generated vendored palette (the semantic layer references the neutral ramp
// through it).
const theme = readFileSync(resolve(__dirname, "theme.css"), "utf8");
const paletteStatic = readFileSync(
  resolve(__dirname, "generated/styles/palette-static.css"),
  "utf8",
);

const SAFELIST = [
  "bg-bg-base",
  "bg-bg-muted",
  "bg-bg-muted/50",
  "text-fg-muted",
  "text-md",
  "rounded-md",
  "duration-slow",
  "ease-spring",
  "dark:text-fg-muted",
  "ring-offset-bg-base",
  "shadow-s1",
  "z-modal",
  "opacity-disabled",
  "leading-tight",
  "font-semibold",
  "font-heading",
].join(" ");

async function compileTheme(consumerCss = "") {
  const require = createRequire(import.meta.url);
  const compiler = await compile(
    `@import "tailwindcss" source(none);\n${theme}\n${paletteStatic}\n@source inline("${SAFELIST}");\n${consumerCss}`,
    {
      base: __dirname,
      loadStylesheet: async (id: string, base: string) => {
        const path = id.startsWith(".")
          ? resolve(base, id)
          : require.resolve(
              id === "tailwindcss" ? "tailwindcss/index.css" : id,
              { paths: [base, __dirname] },
            );
        return { path, base: dirname(path), content: readFileSync(path, "utf8") };
      },
    },
  );

  expect(compiler.root).toBe("none");
  return compiler.build([]);
}

describe("semantic utilities keep var() indirection", () => {
  it("emits semantic utilities that resolve custom properties, never literals", async () => {
    const css = await compileTheme();
    expect(css).toContain(".bg-bg-muted {");
    expect(css).toContain("background-color: var(--color-bg-muted)");
    expect(css).toContain(".text-fg-muted {");
    expect(css).toContain("color: var(--color-fg-muted)");
  });

  it("preserves semantic-to-palette var() chains in the emitted theme", async () => {
    const css = await compileTheme();
    expect(css).toContain("--color-bg-muted: var(--color-neutral-50)");
    expect(css).not.toContain("--color-bg-muted: oklch(");
    // The neutral ramp is vendored through palette-static.css; the chain must
    // resolve end to end in the shipped combo.
    expect(css).toMatch(/--color-neutral-50: oklch\(/);
  });

  it("emits unreferenced palette and semantic variables statically", async () => {
    const css = await compileTheme();
    // Nothing in the safelist references these; static emission must keep
    // them available for runtime use (color recipes, app CSS).
    expect(css).toContain("--color-accent-950:");
    expect(css).toContain("--color-surface-inverted:");
    // Control: the same declaration in a plain (non-static) @theme is
    // tree-shaken when no utility references it.
    const control = await compileTheme(
      '@theme { --color-control-unused: #123456; }\n@theme static { --color-control-static: #654321; }',
    );
    expect(control).not.toContain("--color-control-unused");
    expect(control).toContain("--color-control-static: #654321");
  });

  it("supports opacity modifiers through indirection via color-mix", async () => {
    const css = await compileTheme();
    expect(css).toContain(".bg-bg-muted\\/50 {");
    expect(css).toContain("color-mix(in oklab, var(--color-bg-muted) 50%, transparent)");
  });

  it("generates non-color utilities that resolve theme variables", async () => {
    const css = await compileTheme();
    expect(css).toContain(".rounded-md {");
    expect(css).toContain("border-radius: var(--radius-md)");
    expect(css).toContain(".text-md {");
    expect(css).toContain("font-size: var(--text-md)");
    expect(css).toContain(".ease-spring {");
    expect(css).toContain("transition-timing-function: var(--ease-spring)");
    expect(css).toContain(".leading-tight {");
    expect(css).toContain("line-height: var(--leading-tight)");
    expect(css).toContain(".font-semibold {");
    expect(css).toContain("font-weight: var(--font-weight-semibold)");
    expect(css).toContain(".font-heading {");
    expect(css).toContain("font-family: var(--font-heading)");
  });
});

describe("utility shims for names Tailwind cannot re-theme at runtime", () => {
  it("registers named durations resolving theme variables", async () => {
    const css = await compileTheme();
    expect(css).toContain(".duration-slow {");
    expect(css).toContain("transition-duration: var(--duration-slow)");
  });

  it("registers named stacking layers resolving theme variables", async () => {
    const css = await compileTheme();
    expect(css).toContain(".z-modal {");
    expect(css).toContain("z-index: var(--z-index-modal)");
  });

  it("registers named state opacities resolving theme variables", async () => {
    const css = await compileTheme();
    expect(css).toContain(".opacity-disabled {");
    expect(css).toContain("opacity: var(--opacity-disabled)");
  });

  it("overrides the native shadow utility with a runtime-resolvable shim", async () => {
    const css = await compileTheme();
    expect(css).toContain(".shadow-s1 {");
    expect(css).toContain("--tw-shadow: var(--shadow-s1)");
    // The native utility inlines the theme value, which would make the dark
    // shadow overrides dead CSS.
    expect(css).not.toContain("var(--tw-shadow-color, rgb(0 0 0 / 0.05))");
    // Tailwind's composed box-shadow (rings, inset shadows) is preserved.
    expect(css).toContain("var(--tw-inset-shadow)");
  });
});

describe("dark mode without JavaScript", () => {
  it("emits the authored .dark override block with indirection intact", async () => {
    const css = await compileTheme();
    expect(css).toContain(".dark {");
    expect(css).toContain("--color-bg-muted: var(--color-neutral-900)");
    expect(css).toContain("--color-fg-skeleton: var(--color-neutral-700)");
  });

  it("overrides shadows in dark mode through the shim-resolved variables", async () => {
    const css = await compileTheme();
    expect(css).toContain("--shadow-s1: 0 1px 2px 0 hsl(0 0% 100% / 0.1)");
  });

  it("compiles dark: variants against the class-based custom variant", async () => {
    const css = await compileTheme();
    expect(css).toContain(".dark\\:text-fg-muted");
    expect(css).toContain(":where(.dark, .dark *)");
  });
});

describe("consumer re-theming is pure cascade", () => {
  it("follows a consumer @theme palette override with no rebuild and no JS", async () => {
    const css = await compileTheme(
      "@theme { --color-neutral-50: oklch(0.9 0.01 200); }",
    );
    // The override is emitted in the same cascade layer...
    expect(css).toContain("--color-neutral-50: oklch(0.9 0.01 200)");
    // ...the semantic chain still points at the palette variable...
    expect(css).toContain("--color-bg-muted: var(--color-neutral-50)");
    // ...and utilities still resolve the semantic variable. At runtime,
    // bg-muted therefore resolves the overridden neutral-50.
    expect(css).toContain("background-color: var(--color-bg-muted)");
  });

  it("follows a plain :root override of a brand palette color", async () => {
    const css = await compileTheme(
      ":root { --color-primary-500: rebeccapurple; }",
    );
    expect(css).toContain("--color-primary-500: rebeccapurple");
    expect(css).toContain("--color-bg-muted: var(--color-neutral-50)");
  });
});
