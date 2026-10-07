---
"@basic-ui/core": minor
---

Add the `Toggle` (switch) component (#80), ported from appiq onto the headless M1 hooks.

- State via `useControllableState` (controlled `value`/`onChange` + uncontrolled `defaultValue`)
- id/aria wiring via `useAriaIds` so it composes with Field conventions (#56)
- `role="switch"` with `aria-checked`; Space/Enter activation via the native button base
- Sizes (`sm`/`md`/`lg`) and intent colors via CVA on basic-ui tokens
