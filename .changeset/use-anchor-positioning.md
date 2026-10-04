---
"@basic-ui/react-utilities": minor
---

Add `useAnchorPositioning` (#70): the shared positioning layer for portalled popups (popovers, dropdowns, tooltips, select popups).

- Viewport-based coordinates (`position: fixed`) from the anchor's `getBoundingClientRect()`
- `side` (top/bottom/left/right) + `align` (start/center/end) placement, with `sideOffset` and `viewportPadding`
- If the requested side does not fit, flips to the mirrored side when possible, otherwise to the roomiest fitting perpendicular side; both axes are clamped into the viewport
- Recomputes on captured scroll and window resize, so overflow-ancestor scrolls keep the popup glued to its anchor
- Retries on animation frames until the portalled popup attaches
