import LayoutProps from "./layout.types";
import { cn, getResponsiveClassNames } from "@basic-ui/react-utilities";
import layoutVariants from "./layout.variants";

export const LAYOUT_PROP_NAMES = [
  "p", "px", "py", "pt", "pr", "pb", "pl",
  "m", "mx", "my", "mt", "mr", "mb", "ml",
  "gap",
  "h", "hMin", "hMax", "w", "wMin", "wMax",
  "display", "position", "overflow", "overflowX", "overflowY",
] as const satisfies readonly (keyof LayoutProps)[];

const layoutPropKeySet = new Set<string>(LAYOUT_PROP_NAMES);

export const generateLayoutClassNames = (
  layout: LayoutProps,
): { layoutClassNameString: string } => {
  return {
    layoutClassNameString: cn(
      LAYOUT_PROP_NAMES.map((prop) =>
        getResponsiveClassNames(layout[prop], (value) =>
          layoutVariants({ [prop]: value }),
        ),
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
