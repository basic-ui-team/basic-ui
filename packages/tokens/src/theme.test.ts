import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "tailwindcss";
import { describe, expect, it } from "vitest";

/**
 * The authored theme contract, verified through the real Tailwind v4
 * compiler (RFC-0001):
 *
 *  1. The @theme inline bridge — utilities resolve consumer-owned
 *     variables directly, so overrides apply at any scope.
 *  2. Dark mode is a plain .dark override block with no JavaScript.
 *  3. Derived interactive states resolve color-mix against the mode-aware
 *     mix pole, with the plain token as fallback.
 *  4. Non-color namespaces resolve their theme variables.
 *  5. The shipped default pairs pass WCAG AA in both modes.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const theme = readFileSync(resolve(__dirname, "theme.css"), "utf8");

const SAFELIST = [
  "bg-background",
  "text-foreground",
  "bg-surface",
  "text-surface-foreground",
  "bg-overlay",
  "text-overlay-foreground",
  "bg-muted",
  "text-muted-foreground",
  "bg-primary",
  "text-primary-foreground",
  "bg-primary/50",
  "hover:bg-primary-hover",
  "active:bg-primary-active",
  "hover:bg-muted-hover",
  "bg-destructive",
  "text-destructive-foreground",
  "bg-success",
  "text-success-foreground",
  "bg-warning",
  "text-warning-foreground",
  "bg-info",
  "text-info-foreground",
  "ring-ring",
  "ring-offset-background",
  "border-border",
  "border-input",
  "rounded-md",
  "text-md",
  "duration-slow",
  "ease-spring",
  "leading-tight",
  "font-semibold",
  "font-heading",
  "z-modal",
  "opacity-disabled",
  "shadow-s1",
].join(" ");

async function compileTheme(consumerCss = "") {
  const require = createRequire(import.meta.url);
  const compiler = await compile(
    `@import "tailwindcss" source(none);\n${theme}\n@source inline("${SAFELIST}");\n${consumerCss}`,
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

describe("the @theme inline bridge", () => {
  it("emits utilities that resolve the consumer-owned variables directly", async () => {
    const css = await compileTheme();
    expect(css).toContain(".bg-primary {");
    expect(css).toContain("background-color: var(--primary)");
    expect(css).toContain(".text-primary-foreground {");
    expect(css).toContain("color: var(--primary-foreground)");
  });

  it("always emits the consumer-owned values as plain CSS", async () => {
    const css = await compileTheme();
    expect(css).toContain("--primary: oklch(0.25 0.02 150)");
    expect(css).toContain("--background: oklch(1 0 0)");
  });

  it("keeps opacity modifiers working through the bridge", async () => {
    const css = await compileTheme();
    expect(css).toContain(".bg-primary\\/50 {");
    expect(css).toContain("color-mix(in oklab, var(--primary) 50%, transparent)");
  });

  it("lets any scope re-own a token", async () => {
    const css = await compileTheme(
      ".theme-marketing { --primary: rebeccapurple; }",
    );
    expect(css).toContain(".theme-marketing {");
    expect(css).toContain("--primary: rebeccapurple");
    expect(css).toContain("background-color: var(--primary)");
  });
});

describe("dark mode without JavaScript", () => {
  it("re-declares the tokens under .dark", async () => {
    const css = await compileTheme();
    expect(css).toContain(".dark {");
    expect(css).toContain("--background: oklch(0.145 0 0)");
    expect(css).toContain("--primary: oklch(0.79 0.15 150)");
  });

  it("flips the mix pole with the theme", async () => {
    const css = await compileTheme();
    expect(css).toContain("--mix-pole: #000");
    expect(css).toContain("--mix-pole: #fff");
  });
});

describe("derived interactive states", () => {
  it("derives hover and active from the token and the mix pole", async () => {
    const css = await compileTheme();
    expect(css).toContain(".hover\\:bg-primary-hover");
    expect(css).toContain(
      "background-color: color-mix(in oklab, var(--primary) 85%, var(--mix-pole))",
    );
    expect(css).toContain(
      "background-color: color-mix(in oklab, var(--primary) 75%, var(--mix-pole))",
    );
    expect(css).toContain(
      "background-color: color-mix(in oklab, var(--muted) 88%, var(--mix-pole))",
    );
  });

  it("degrades to the plain token where color-mix is unsupported", async () => {
    const css = await compileTheme();
    expect(css).toContain("@supports (color: color-mix(in lab, red, red))");
  });
});

describe("non-color tokens", () => {
  it("generates utilities that resolve theme variables", async () => {
    const css = await compileTheme();
    expect(css).toContain(".rounded-md {");
    expect(css).toContain("border-radius: var(--radius-md)");
    expect(css).toContain(".text-md {");
    expect(css).toContain("font-size: var(--text-md)");
    expect(css).toContain(".duration-slow {");
    expect(css).toContain("transition-duration: var(--duration-slow)");
    expect(css).toContain(".ease-spring {");
    expect(css).toContain("transition-timing-function: var(--ease-spring)");
    expect(css).toContain(".leading-tight {");
    expect(css).toContain("line-height: var(--leading-tight)");
    expect(css).toContain(".font-semibold {");
    expect(css).toContain("font-weight: var(--font-weight-semibold)");
    expect(css).toContain(".font-heading {");
    expect(css).toContain("font-family: var(--font-heading)");
    expect(css).toContain(".z-modal {");
    expect(css).toContain("z-index: var(--z-index-modal)");
    expect(css).toContain(".opacity-disabled {");
    expect(css).toContain("opacity: var(--opacity-disabled)");
    expect(css).toContain(".shadow-s1 {");
    expect(css).toContain("--tw-shadow: var(--shadow-s1)");
  });
});

describe("WCAG AA on the shipped default pairs", () => {
  // oklch -> sRGB (Björn Ottosson's OKLab math).
  function oklabToSrgb(L: number, a: number, b: number): [number, number, number] {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;
    const lr = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const mr = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const sr = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
    const gamma = (v: number) =>
      v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    return [gamma(lr), gamma(mr), gamma(sr)].map((v) =>
      Math.min(1, Math.max(0, v)),
    ) as [number, number, number];
  }

  function oklchToLab(oklch: string): [number, number, number] {
    const m = /^oklch\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)$/.exec(oklch.trim());
    if (!m) throw new Error(`bad oklch literal: ${oklch}`);
    const hr = (Number(m[3]) * Math.PI) / 180;
    return [Number(m[1]), Number(m[2]) * Math.cos(hr), Number(m[2]) * Math.sin(hr)];
  }

  function luminance(oklch: string): number {
    const [r, g, b] = oklabToSrgb(...oklchToLab(oklch));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // What color-mix(in oklab, X 85%, pole) actually computes: linear
  // interpolation of OKLab components.
  function oklabMix(a: string, b: string, weightA: number): string {
    const la = oklchToLab(a);
    const lb = oklchToLab(b);
    return `oklch(${la.map((v, i) => v * weightA + lb[i] * (1 - weightA)).join(" ")})`;
  }

  function contrast(a: string, b: string): number {
    const la = luminance(a);
    const lb = luminance(b);
    const [hi, lo] = la > lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  }

  // Mirrors theme/semantic.css and theme/dark.css; asserted against the
  // compiled output so the table cannot silently diverge.
  const pairs = {
    light: [
      ["--foreground", "oklch(0.145 0 0)", "--background", "oklch(1 0 0)"],
      ["--surface-foreground", "oklch(0.205 0 0)", "--surface", "oklch(0.968 0.002 247.839)"],
      ["--overlay-foreground", "oklch(0.985 0 0)", "--overlay", "oklch(0.269 0 0)"],
      ["--muted-foreground", "oklch(0.3 0.014 259.4)", "--background", "oklch(1 0 0)"],
      ["--primary-foreground", "oklch(0.985 0 0)", "--primary", "oklch(0.25 0.02 150)"],
      ["--success-foreground", "oklch(0.985 0 0)", "--success", "oklch(0.3 0.12 150)"],
      ["--warning-foreground", "oklch(0.19 0 0)", "--warning", "oklch(0.66 0.15 70)"],
      ["--destructive-foreground", "oklch(0.985 0 0)", "--destructive", "oklch(0.35 0.19 25)"],
      ["--info-foreground", "oklch(0.985 0 0)", "--info", "oklch(0.3 0.14 240)"],
    ],
    dark: [
      ["--foreground", "oklch(0.985 0 0)", "--background", "oklch(0.145 0 0)"],
      ["--surface-foreground", "oklch(0.985 0 0)", "--surface", "oklch(0.205 0 0)"],
      ["--overlay-foreground", "oklch(0.985 0 0)", "--overlay", "oklch(0.269 0 0)"],
      ["--muted-foreground", "oklch(0.704 0 0)", "--background", "oklch(0.145 0 0)"],
      ["--primary-foreground", "oklch(0.205 0 0)", "--primary", "oklch(0.79 0.15 150)"],
      ["--success-foreground", "oklch(0.985 0 0)", "--success", "oklch(0.3 0.12 150)"],
      ["--warning-foreground", "oklch(0.19 0 0)", "--warning", "oklch(0.66 0.15 70)"],
      ["--destructive-foreground", "oklch(0.985 0 0)", "--destructive", "oklch(0.35 0.19 25)"],
      ["--info-foreground", "oklch(0.985 0 0)", "--info", "oklch(0.3 0.14 240)"],
    ],
  } as const;

  it("ships default pairs that pass AA (4.5:1) in both modes", async () => {
    const css = await compileTheme();
    const ratios: string[] = [];
    for (const [mode, table] of Object.entries(pairs)) {
      for (const [fgName, fg, bgName, bg] of table) {
        expect(css).toContain(`${fgName}: ${fg}`);
        expect(css).toContain(`${bgName}: ${bg}`);
        const ratio = contrast(fg, bg);
        ratios.push(`${mode} ${fgName}/${bgName}: ${ratio.toFixed(2)}`);
        expect(ratio, `${mode} ${fgName} on ${bgName}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    console.info(`AA ratios:\n${ratios.join("\n")}`);
  });

  it("keeps the focus ring perceivable (3:1) against the page in both modes", () => {
    expect(contrast("oklch(0.4 0.1 150)", "oklch(1 0 0)")).toBeGreaterThanOrEqual(3);
    expect(contrast("oklch(0.65 0.08 150)", "oklch(0.145 0 0)")).toBeGreaterThanOrEqual(3);
  });

  it("keeps the foreground pair above AA on derived hover/active surfaces", () => {
    const cases = [
      // light: primary darkens toward black; white foreground
      ["oklch(0.985 0 0)", "oklch(0.25 0.02 150)", "oklch(0 0 0)"],
      // dark: primary lightens toward white; dark foreground
      ["oklch(0.205 0 0)", "oklch(0.79 0.15 150)", "oklch(1 0 0)"],
    ] as const;
    for (const [fg, base, pole] of cases) {
      for (const weight of [0.85, 0.75]) {
        const hovered = oklabMix(base, pole, weight);
        const ratio = contrast(fg, hovered);
        expect(ratio, `${fg} on ${hovered} (${weight})`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
