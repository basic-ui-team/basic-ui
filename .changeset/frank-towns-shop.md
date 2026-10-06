---
"@basic-ui/react-utilities": minor
---

Add `usePopover` (#71): the headless non-modal overlay primitive for popovers,
dropdown menus, and select popups.

- Composes the existing hooks: `useDisclosure` (open state), `useAnchorPositioning`
  (viewport-clamped anchor placement), and `useOverlay` (stacked dismissal) —
  hooks composing hooks, proving out the headless strategy from #69
- Non-modal by design: scroll never locks, no focus trap, no `aria-hidden` on
  siblings — unlike the modal `useDialog`/`useOverlay` path
- Stacked dismissal shared with modals: Escape and outside pointerdown dismiss
  only the topmost overlay, so a popover above an open dialog dismisses first
- `anchorProps`/`popoverProps` wire `aria-expanded`, `aria-controls`,
  `aria-haspopup` (configurable — `"menu"` for dropdowns, `"listbox"` for
  selects), and the popover's `id`/`role`
- `dismissOnOutside` (tooltip-style persistence when `false`) and
  `dismissOnEscape` opt-outs
- Replaces the ~430 LOC of hand-rolled popover/dropdown dismissal that appiq
  implements three times over

`useOverlay` additions:

- New `dismissOnEscape` option, defaulting to `true`
- New optional `anchorRef` for outside-dismissal containment — pointerdown on
  the anchor no longer dismisses an open popover, fixing the trigger-click
  close/reopen flicker
