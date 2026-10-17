import {
  BREAKPOINT_ORDER,
  cn,
  getResponsiveClassNames,
  type Breakpoint,
  type ResponsiveValue,
} from "@basic-ui/react-utilities";
import { generateLayoutClassNames, type LayoutProps, type OverflowType } from "@core/lib";
import type { CardTitleOwnProps } from "./card.types";
import { cardTextWrapClasses } from "./card.variants";

function valueAt<Value extends string | boolean>(
  value: ResponsiveValue<Value> | undefined,
  breakpoint: Breakpoint,
): Value | undefined {
  return typeof value === "object"
    ? value[breakpoint]
    : breakpoint === "base" ? value : undefined;
}

export function getCardTextFlowClasses({
  truncate,
  wrap,
  overflow,
  overflowX,
  overflowY,
}: Required<Pick<CardTitleOwnProps, "truncate" | "wrap">> &
  Pick<LayoutProps, "overflow" | "overflowX" | "overflowY">) {
  const hasTruncation = typeof truncate === "boolean"
    ? truncate
    : Object.values(truncate).includes(true);

  if (!hasTruncation) {
    return {
      hasTruncation,
      className: cn(
        getResponsiveClassNames(wrap, (value) => cardTextWrapClasses[value]),
        generateLayoutClassNames({ overflow, overflowX, overflowY }).layoutClassNameString,
      ),
    };
  }

  let currentTruncate = false;
  let currentWrap: keyof typeof cardTextWrapClasses = "wrap";
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
      currentX = currentY = nextOverflow === "unset" ? "visible" : nextOverflow;
    }
    if (nextX !== undefined) currentX = nextX === "unset" ? "visible" : nextX;
    if (nextY !== undefined) currentY = nextY === "unset" ? "visible" : nextY;

    classesByBreakpoint[breakpoint] = currentTruncate
      ? "overflow-hidden text-ellipsis whitespace-nowrap"
      : cn(
          currentX === currentY
            ? `overflow-${currentX}`
            : `overflow-x-${currentX} overflow-y-${currentY}`,
          "text-clip",
          currentWrap === "nowrap" ? "whitespace-nowrap" : "whitespace-normal",
          cardTextWrapClasses[currentWrap],
        );
  }

  return {
    hasTruncation,
    className: getResponsiveClassNames(classesByBreakpoint, (value) => value),
  };
}
