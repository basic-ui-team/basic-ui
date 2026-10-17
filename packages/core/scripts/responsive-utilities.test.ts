import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { BREAKPOINT_ORDER } from "../../react-utilities/src/hooks/useResponsive/constants";
import { flexVariantsConfig } from "../src/components/Flex/flex.variants";
import { layoutVariantsConfig } from "../src/lib/layout/layout.variants";
import {
  collectResponsiveUtilities,
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
} from "./responsive-utilities";

describe("responsive utility collection", () => {
  it("collects base, variant, and compound classes without emitting conditions or defaults", () => {
    const utilities = collectResponsiveUtilities([
      {
        base: "inline-flex",
        variants: { size: { sm: "h-4 w-8", md: "h-5 w-9" } },
        compoundVariants: [
          { size: "sm", checked: true, className: "[&_[data-slot=thumb]]:translate-x-4" },
          { size: "md", checked: true, class: "[&_[data-slot=thumb]]:translate-x-4.5" },
        ],
        defaultVariants: { size: "sm" },
      },
    ]);

    expect(utilities).toEqual([
      "inline-flex",
      "h-4",
      "w-8",
      "h-5",
      "w-9",
      "[&_[data-slot=thumb]]:translate-x-4",
      "[&_[data-slot=thumb]]:translate-x-4.5",
    ]);
  });

  it("deduplicates within and across sources without merging alternatives or selectors", () => {
    const sources = [
      { variants: { size: { sm: " h-4  w-4\nh-4 ", md: "h-5" } } },
      { variants: { size: { sm: "h-4 w-4", md: "[&_[data-slot=thumb]]:h-4" } } },
    ];

    expect(collectResponsiveUtilities(sources)).toEqual([
      "h-4",
      "w-4",
      "h-5",
      "[&_[data-slot=thumb]]:h-4",
    ]);
    expect(collectResponsiveUtilities(sources)).toEqual(collectResponsiveUtilities(sources));
  });

  it("omits empty class strings", () => {
    expect(
      collectResponsiveUtilities([{ base: "", variants: { size: { unset: "", sm: " \n " } } }]),
    ).toEqual([]);
  });

  it.each([
    { source: null, error: "Responsive source 1.variants" },
    { source: {}, error: "Responsive source 1.variants" },
    { source: { variants: [] }, error: "Responsive source 1.variants" },
    { source: { variants: { size: null } }, error: "variants.size must be a variant map" },
    { source: { variants: { size: { sm: 4 } } }, error: "variants.size.sm must be a class string" },
    { source: { base: ["h-4"], variants: {} }, error: "base must be a class string" },
    { source: { variants: {}, compoundVariants: {} }, error: "compoundVariants must be an array" },
    {
      source: { variants: {}, compoundVariants: [{ size: "sm" }] },
      error: "compoundVariants[0] must declare class or className",
    },
    {
      source: { variants: {}, compoundVariants: [{ className: null }] },
      error: "compoundVariants[0].className must be a class string",
    },
  ])("rejects malformed sources: $error", ({ source, error }) => {
    expect(() => collectResponsiveUtilities([source])).toThrow(error);
  });
});

describe("responsive utility source", () => {
  it("preserves the complete registered layout/Flex source and candidate count", () => {
    const utilities = collectResponsiveUtilities([layoutVariantsConfig, flexVariantsConfig]);
    const source = createResponsiveUtilitySource(BREAKPOINT_ORDER, utilities);
    const committed = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../src/generated/layout-utilities.generated.css",
      ),
      "utf8",
    );

    expect(utilities).toHaveLength(227);
    expect(utilities.length * BREAKPOINT_ORDER.length).toBe(1_362);
    expect(source).toBe(committed.replace(/\r\n/g, "\n"));
    expect(Buffer.byteLength(source)).toBe(1_758);
  });

  it("emits only the supplied breakpoint forms and exact unique candidates", () => {
    const source = createResponsiveUtilitySource(["base", "md", "2xl"], ["h-4", "w-4", "h-4"]);

    expect(source).toContain('@source inline("{,md:,2xl:}{h-4,w-4}");');
    expect(source).not.toContain("sm:");
    expect(source).toBe(
      createResponsiveUtilitySource(["base", "md", "2xl"], ["h-4", "w-4", "h-4"]),
    );
  });

  it("quotes the inline source without changing utility contents", () => {
    const utility = 'data-[state="checked"]:h-4';
    const source = createResponsiveUtilitySource(["base", "md"], ["content-['saved']", utility]);

    expect(source).toContain(`@source inline("{,md:}{content-['saved']}");`);
    expect(source).toContain(`@source inline('{,md:}{${utility}}');`);
  });

  it("rejects mixed quotes rather than silently changing the utility", () => {
    expect(() =>
      createResponsiveUtilitySource(["base"], [`data-[label="it's"]:h-4`]),
    ).toThrow("Cannot serialize a utility containing both quote types");
  });
});

describe("responsive utility freshness", () => {
  const temporaryDirectories: string[] = [];

  afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
      rmSync(directory, { recursive: true });
    }
  });

  function temporaryOutput() {
    const directory = mkdtempSync(join(tmpdir(), "basic-ui-responsive-"));
    temporaryDirectories.push(directory);
    return join(directory, "utilities.css");
  }

  it("rejects missing output without creating it", () => {
    expect(isUtilitySourceCurrent(temporaryOutput(), "expected\n")).toBe(false);
  });

  it("rejects stale output without overwriting it", () => {
    const output = temporaryOutput();
    writeFileSync(output, "stale\n");

    expect(isUtilitySourceCurrent(output, "expected\n")).toBe(false);
    expect(readFileSync(output, "utf8")).toBe("stale\n");
  });

  it.each(["\n", "\r\n"])("accepts current output with %j line endings", (newline) => {
    const output = temporaryOutput();
    writeFileSync(output, ["first", "second", ""].join(newline));

    expect(isUtilitySourceCurrent(output, "first\nsecond\n")).toBe(true);
  });
});
