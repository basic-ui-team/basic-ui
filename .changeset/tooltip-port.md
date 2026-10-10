---
"@basic-ui/core": minor
---

Add the `Tooltip` component (#77), ported from appiq onto the `useTooltip` headless hook (#72).

- All timing, hover/focus, and dismissal semantics from `useTooltip`; positioning from `useAnchorPositioning` (#70) via `usePopover`
- `delay`/`closeDelay` props; the panel stays open while hovered (WCAG 1.4.13); Escape dismissal configurable
- `role="tooltip"` + `aria-describedby` wiring from the hook; renders through a portal
- CVA variants ported to basic-ui tokens: sizes (`sm`/`md`/`lg`, responsive), semantic `color` surfaces, optional `bordered`
- `disabled` prop leaves the trigger untouched (no handlers, no aria wiring)
