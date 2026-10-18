import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { BREAKPOINT_ORDER } from "../../../react-utilities/src/hooks/useResponsive/constants";
import { tokens } from "../../../tokens/src/generated/tokens";
import {
  createResponsiveUtilitySource,
  isUtilitySourceCurrent,
  responsiveUtilities,
  responsiveUtilityFamilies,
} from "./responsive-utilities";

describe("shared responsive vocabulary", () => {
  it("supports reviewed fixed-pixel geometry independently of token spacing", () => {
    for (const value of [12, 14, 16, 20, 24, 32, 36, 44]) {
      expect(responsiveUtilityFamilies.pixelGeometry).toContain(`h-[${value}px]`);
      expect(responsiveUtilityFamilies.pixelGeometry).toContain(`w-[${value}px]`);
    }
    expect(responsiveUtilityFamilies.pixelGeometry).toContain("p-[2px]");
    for (const value of [16, 18, 24]) {
      expect(responsiveUtilityFamilies.pixelGeometry).toContain(`translate-x-[${value}px]`);
      expect(responsiveUtilityFamilies.pixelGeometry).toContain(`translate-y-[${value}px]`);
    }
  });

  it("covers the token spacing scale for each supported spacing property", () => {
    for (const prefix of [
      "p",
      "px",
      "py",
      "pt",
      "pr",
      "pb",
      "pl",
      "m",
      "mx",
      "my",
      "mt",
      "mr",
      "mb",
      "ml",
      "gap",
      "gap-x",
      "gap-y",
    ]) {
      expect(responsiveUtilityFamilies.spacing).toEqual(
        expect.arrayContaining(Object.keys(tokens.spacing).map((step) => `${prefix}-${step}`)),
      );
    }
  });

  it("supports complete border-width and grid-track ranges, not component selections", () => {
    for (let width = 0; width <= 9; width++) {
      expect(responsiveUtilityFamilies.borderWidth).toContain(`border-${width}`);
    }
    for (let tracks = 1; tracks <= 12; tracks++) {
      expect(responsiveUtilityFamilies.grid).toContain(`grid-cols-${tracks}`);
      expect(responsiveUtilityFamilies.grid).toContain(`grid-rows-${tracks}`);
    }
  });

  it("uses token names for typography and size-coupled rounding", () => {
    for (const name of Object.keys(tokens.fontSize)) {
      expect(responsiveUtilityFamilies.typography).toContain(`text-${name}`);
    }
    for (const name of Object.keys(tokens.radius)) {
      expect(responsiveUtilityFamilies.radius).toContain(`rounded-${name}`);
    }
  });

  it("contains only unique concrete utilities, without recipe keys or automatic modifiers", () => {
    expect(responsiveUtilities).toEqual([
      ...new Set(Object.values(responsiveUtilityFamilies).flat()),
    ]);
    expect(
      responsiveUtilities.every((utility) => utility.length > 0 && !/\s|:/.test(utility)),
    ).toBe(true);
    for (const excluded of [
      "sm",
      "md",
      "lg",
      "bg-primary-500",
      "font-bold",
      "shadow-s1",
      "animate-spin",
      "p-10",
    ]) {
      expect(responsiveUtilities).not.toContain(excluded);
    }
  });
});

describe("responsive utility source", () => {
  it("matches the generated stylesheet using only the shared vocabulary", () => {
    const source = createResponsiveUtilitySource(BREAKPOINT_ORDER, responsiveUtilities);
    const committed = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../generated/layout-utilities.generated.css",
      ),
      "utf8",
    );

    expect(source).toBe(committed.replace(/\r\n/g, "\n"));
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
    expect(() => createResponsiveUtilitySource(["base"], [`data-[label="it's"]:h-4`])).toThrow(
      "Cannot serialize a utility containing both quote types",
    );
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
