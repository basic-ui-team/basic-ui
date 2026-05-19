// Barrel export for lib files
export { cn } from "./cn/cn";
export {
  BUILT_IN_TEXT_COLORS,
  isBuiltInTextColor,
  BUILT_IN_HEADER_COLORS,
  isBuiltInHeaderColor,
} from "./textColors";
export type { BuiltInTextColor, BuiltInHeaderColor } from "./textColors";
export { normalizeProps } from "./normalizeProps";
// normalizeProps is a runtime helper; no types exported here
