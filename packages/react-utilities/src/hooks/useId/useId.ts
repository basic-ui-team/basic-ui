import { useId as useReactId } from "react";

let ssrIdCounter = 0;

/**
 * SSR-safe prefixed id.
 *
 * Delegates to React's own useId (which is stable across re-renders and
 * collision-free during SSR hydration) and prepends a human-readable prefix.
 * Falls back to a module counter when React's useId is unavailable.
 *
 * @example
 * const id = useId("label"); // "label-:r1:"
 */
export function useId(prefix?: string): string {
  const reactId = useReactId();
  const id = reactId ?? `fallback-${++ssrIdCounter}`;
  return prefix ? `${prefix}-${id}` : id;
}

export type UseAriaIdsResult = {
  /** The id of the element this label describes (e.g. the input). */
  id: string;
  /** The id of the label element. */
  labelId: string;
  /** The id of the description/help-text element, if provided. */
  descriptionId: string;
  /** The id of the error element, if provided. */
  errorId: string;
  /** Props to spread on the label element. */
  labelProps: { id: string; htmlFor: string };
  /**
   * Props to spread on the field element. Wires aria-labelledby and,
   * conditionally, aria-describedby and aria-invalid.
   */
  fieldProps: {
    id: string;
    "aria-labelledby": string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  };
};

/**
 * Generate and wire the ids a labelled field needs: label, description
 * (help text), and error. Returns spread-ready props for the label and the
 * field element so components never hand-write aria wiring.
 *
 * @example
 * const { labelProps, fieldProps } = useAriaIds({ description: true, error: hasError });
 */
export function useAriaIds(options?: {
  prefix?: string;
  description?: boolean;
  error?: boolean;
}): UseAriaIdsResult {
  const prefix = options?.prefix ?? "field";
  const wantsDescription = options?.description ?? false;
  const hasError = options?.error ?? false;

  const id = useId(prefix);
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const describedBy =
    [wantsDescription ? descriptionId : undefined, hasError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return {
    id,
    labelId,
    descriptionId,
    errorId,
    labelProps: { id: labelId, htmlFor: id },
    fieldProps: {
      id,
      "aria-labelledby": labelId,
      ...(describedBy ? { "aria-describedby": describedBy } : {}),
      ...(hasError ? { "aria-invalid": true } : {}),
    },
  };
}
