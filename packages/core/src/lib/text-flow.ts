import {
  BREAKPOINT_ORDER,
  cn,
  getResponsiveClassNames,
  type Breakpoint,
  type ResponsiveValue,
} from "@basic-ui/react-utilities";

export type OverflowType = "visible" | "hidden" | "auto" | "scroll";

/** Overflow controls shared by every text-flow consumer (Text, Header, Card sections). */
export interface TextFlowOverflowProps {
  overflow?: ResponsiveValue<OverflowType>;
  overflowX?: ResponsiveValue<OverflowType>;
  overflowY?: ResponsiveValue<OverflowType>;
}

export const textWrapClasses = {
  nowrap: "text-nowrap",
  wrap: "text-wrap",
  balance: "text-balance",
  pretty: "text-pretty",
} as const;

function overflowClasses(
  overflow: ResponsiveValue<OverflowType> | undefined,
  overflowX: ResponsiveValue<OverflowType> | undefined,
  overflowY: ResponsiveValue<OverflowType> | undefined,
): string {
  return cn(
    getResponsiveClassNames(overflow, (value) => `overflow-${value}`),
    getResponsiveClassNames(overflowX, (value) => `overflow-x-${value}`),
    getResponsiveClassNames(overflowY, (value) => `overflow-y-${value}`),
  );
}

function valueAt<Value extends string | boolean>(
  value: ResponsiveValue<Value> | undefined,
  breakpoint: Breakpoint,
): Value | undefined {
  return typeof value === "object"
    ? value[breakpoint]
    : breakpoint === "base" ? value : undefined;
}

export function getTextFlowClasses({
  truncate,
  wrap,
  overflow,
  overflowX,
  overflowY,
}: {
  truncate: ResponsiveValue<boolean>;
  wrap: ResponsiveValue<keyof typeof textWrapClasses>;
  overflow?: ResponsiveValue<OverflowType>;
  overflowX?: ResponsiveValue<OverflowType>;
  overflowY?: ResponsiveValue<OverflowType>;
}) {
  const hasTruncation = typeof truncate === "boolean"
    ? truncate
    : Object.values(truncate).includes(true);

  if (!hasTruncation) {
    return {
      hasTruncation,
      className: cn(
        getResponsiveClassNames(wrap, (value) => textWrapClasses[value]),
        overflowClasses(overflow, overflowX, overflowY),
      ),
    };
  }

  let currentTruncate = false;
  let currentWrap: keyof typeof textWrapClasses = "wrap";
  let currentX: OverflowType = "visible";
  let currentY: OverflowType = "visible";

  // Truncation owns wrapping and overflow while active; keep their latest values for restoration.
  const classesByBreakpoint: { base: string } & Partial<Record<Breakpoint, string>> = { base: "" };
  for (const breakpoint of BREAKPOINT_ORDER) {
    const nextTruncate = valueAt(truncate, breakpoint);
    const nextWrap = valueAt(wrap, breakpoint);
    const nextOverflow = valueAt(overflow, breakpoint);
    const nextX = valueAt(overflowX, breakpoint);
    const nextY = valueAt(overflowY, breakpoint);
    if ([nextTruncate, nextWrap, nextOverflow, nextX, nextY].every((value) => value === undefined)) {
      continue;
    }
    currentTruncate = nextTruncate ?? currentTruncate;
    currentWrap = nextWrap ?? currentWrap;
    if (nextOverflow !== undefined) {
      currentX = currentY = nextOverflow;
    }
    if (nextX !== undefined) currentX = nextX;
    if (nextY !== undefined) currentY = nextY;

    classesByBreakpoint[breakpoint] = currentTruncate
      ? "overflow-hidden text-ellipsis whitespace-nowrap"
      : cn(
          currentX === currentY
            ? `overflow-${currentX}`
            : `overflow-x-${currentX} overflow-y-${currentY}`,
          "text-clip",
          currentWrap === "nowrap" ? "whitespace-nowrap" : "whitespace-normal",
          textWrapClasses[currentWrap],
        );
  }

  return {
    hasTruncation,
    className: getResponsiveClassNames(classesByBreakpoint, (value) => value),
  };
}
