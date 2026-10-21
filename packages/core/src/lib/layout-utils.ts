import LayoutProps from "./layout.types";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";

export const LAYOUT_PROP_NAMES = [
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
  "gapX",
  "gapY",
  "h",
  "hMin",
  "hMax",
  "w",
  "wMin",
  "wMax",
  "display",
  "position",
  "overflow",
  "overflowX",
  "overflowY",
] as const satisfies readonly (keyof LayoutProps)[];

const layoutPropKeySet = new Set<string>(LAYOUT_PROP_NAMES);

export type LayoutPropName = (typeof LAYOUT_PROP_NAMES)[number];

/**
 * Utility prefix for each layout prop. Spacing and axis props concatenate
 * `${prefix}-${value}`; `display` and `position` values are complete utility
 * names (an empty prefix emits the value alone). The empty-string encoding
 * keeps the table total so `satisfies` flags a missing prop at compile time.
 */
const layoutUtilityPrefixes = {
  p: "p",
  px: "px",
  py: "py",
  pt: "pt",
  pr: "pr",
  pb: "pb",
  pl: "pl",
  m: "m",
  mx: "mx",
  my: "my",
  mt: "mt",
  mr: "mr",
  mb: "mb",
  ml: "ml",
  gap: "gap",
  gapX: "gap-x",
  gapY: "gap-y",
  h: "h",
  hMin: "min-h",
  hMax: "max-h",
  w: "w",
  wMin: "min-w",
  wMax: "max-w",
  display: "",
  position: "",
  overflow: "overflow",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
} as const satisfies Record<LayoutPropName, string>;

/**
 * Map a layout prop value to its utility class by concatenation. Classes are
 * constructed at runtime, so every producible candidate must be registered in
 * the generated `@source inline(...)` safelist — `responsive-utilities.css.test`
 * compiles the shipped stylesheet with no source scanning and asserts CSS for
 * every value this function can emit.
 */
export function resolveLayoutClass(prop: LayoutPropName, value: string | number): string {
  const suffix = prop === "display" && value === "none" ? "hidden" : value;
  const prefix = layoutUtilityPrefixes[prop];
  return prefix ? `${prefix}-${suffix}` : `${suffix}`;
}

export const generateLayoutClassNames = (
  layout: LayoutProps,
): { layoutClassNameString: string } => {
  return {
    layoutClassNameString: cn(
      LAYOUT_PROP_NAMES.map((prop) =>
        getResponsiveClassNames(layout[prop], (value) => resolveLayoutClass(prop, value)),
      ),
    ),
  };
};

export function splitLayoutProps<T extends Record<string, unknown> = Record<string, unknown>>(
  props?: T,
): { layout: Partial<LayoutProps>; rest: Omit<T, keyof LayoutProps> } {
  const layout: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  if (!props) return { layout, rest: rest as Omit<T, keyof LayoutProps> };

  for (const [key, value] of Object.entries(props)) {
    if (layoutPropKeySet.has(key)) {
      layout[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return { layout, rest: rest as Omit<T, keyof LayoutProps> };
}
