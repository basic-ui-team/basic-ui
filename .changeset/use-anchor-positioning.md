---
"@basic-ui/react-utilities": minor
---

Add `useAnchorPositioning` (#70): the shared positioning layer for portalled popups (popovers, dropdowns, tooltips, select popups).

- Viewport-based coordinates (`position: fixed`) from the anchor's `getBoundingClientRect()`
- `side` (top/bottom/left/right) + `align` (start/center/end) placement, with `sideOffset` and `viewportPadding`
- Both axes clamped into the viewport — deliberately no flip; adopting a collision engine (floating-ui) is an explicit ADR decision
- Recomputes on captured scroll and window resize, so overflow-ancestor scrolls keep the popup glued to its anchor
- Retries on animation frames until the portalled popup attaches
