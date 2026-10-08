---
"@basic-ui/react-utilities": minor
---

Add `useTooltip` (#72): headless hover/focus tooltip semantics on top of `usePopover`, per the WAI-ARIA APG "Tooltip" pattern.

- Opens on pointerenter/focus after `delay` (default 400ms), closes on pointerleave/blur after `closeDelay` (default 200ms); Escape-closable via the overlay stack
- Timer state lives in refs, never state — no re-render per delay tick
- Stays open while the pointer is over the tooltip itself (enter clears pending close)
- `role="tooltip"` with id wiring; trigger labelled via `aria-describedby`
- `side`/`align`/`sideOffset`/`viewportPadding` forwarded to `usePopover`; `dismissOnOutside` fixed to `false` (tooltip persistence), `dismissOnEscape` on
- Controlled/uncontrolled open per the library convention (`open`/`defaultOpen`/`onOpenChange`)
