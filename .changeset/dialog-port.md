---
"@basic-ui/core": minor
"@basic-ui/react-utilities": minor
---

Add the `Dialog` component (#75), ported from appiq onto the `useDialog` headless hook (M2).

- Modal/non-modal behavior via `useDialog`: focus trap, scroll lock, Escape, focus restore, `aria-modal` wiring
- Accessible-name guarantee: `title`, `aria-label`, or external `aria-labelledby`; description wired via `aria-describedby`
- `dismissOnOutside` for backdrop/outside dismissal (default on, opt-out supported); non-modal overlay wrapper is pointer-transparent so background content stays interactive
- Sizes (`sm`/`md`/`lg`) and `fullWidth` via CVA on basic-ui tokens
- `useDialog`: `hasDescription` now defaults to `false` (callers rendering a description opt in), and `dialogProps` types the optional `aria-describedby`
