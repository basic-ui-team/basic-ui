---
"@basic-ui/core": minor
---

Remove `unset` from layout props. Omit a prop to emit no declaration; use a
concrete value to override an earlier breakpoint: `0` for spacing, `"auto"`
for dimensions, and `"visible"` for overflow.

Maximum dimensions now accept `"none"` instead of the unsupported `"auto"`.
For example, `wMax={{ base: "screen", md: "none" }}` removes the constraint
at `md`. Export `MaxSizingType` for the distinct maximum-dimension contract.
