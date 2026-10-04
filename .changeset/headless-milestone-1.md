---
"@basic-ui/react-utilities": minor
---

Add Milestone 1 of the headless primitives layer (#55).

- `useControllableState` — the controlled/uncontrolled value pattern, used by every stateful primitive
- `useDisclosure` — open/close/toggle state, built on `useControllableState`
- `useId` — SSR-safe prefixed ids (delegates to React's `useId`)
- `useAriaIds` — label/description/error id generation with spread-ready `labelProps`/`fieldProps` aria wiring
- `useOutsideEvent` — outside-pointerdown and Escape dismissal for overlays
