export function getTruncateAccessibilityProps(
  children: React.ReactNode,
  resolvedTruncate: boolean,
  restProps: Record<string, unknown>,
): Record<string, string | undefined> {
  const accessibilityProps: Record<string, string | undefined> = {};

  const hasTitle = restProps.title !== undefined;
  const hasAriaLabel = restProps["aria-label"] !== undefined;

  if (resolvedTruncate && !hasTitle && !hasAriaLabel && typeof children === "string") {
    accessibilityProps.title = children;
    accessibilityProps["aria-label"] = children;
  }
  return accessibilityProps;
}
