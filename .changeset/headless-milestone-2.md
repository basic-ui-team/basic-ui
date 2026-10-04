---
"@basic-ui/react-utilities": minor
---

Add Milestone 2 of the headless primitives layer (#55): overlay behavior.

- `Portal` — render children outside the React tree position (SSR-safe, custom container, `disabled` escape hatch); the base of every overlay
- `useFocusTrap` — focus containment per the WAI-ARIA APG dialog pattern: activation moves focus in, Tab/Shift+Tab cycle, deactivation restores focus and removes `aria-hidden` marks; retries a frame later when portal content hasn't attached yet
- `useOverlay` — overlay stack where only the topmost overlay dismisses on Escape/outside-pointerdown, plus a reference-counted scroll lock with scrollbar-gutter compensation (nested modals lock once, restore once)
- `useDialog` — wires disclosure + overlay + focus trap + aria ids into the headless modal dialog pattern, returning spread-ready `dialogProps`/`titleProps`
