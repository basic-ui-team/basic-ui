# @basic-ui/react-utilities

## 0.2.0

### Minor Changes

- aaedf17: Add the `Dialog` component (#75), ported from appiq onto the `useDialog` headless hook (M2).

  - Modal/non-modal behavior via `useDialog`: focus trap, scroll lock, Escape, focus restore, `aria-modal` wiring
  - Accessible-name guarantee: `title`, `aria-label`, or external `aria-labelledby`; description wired via `aria-describedby`
  - `dismissOnOutside` for backdrop/outside dismissal (default on, opt-out supported); non-modal overlay wrapper is pointer-transparent so background content stays interactive
  - Sizes (`sm`/`md`/`lg`) and `fullWidth` via CVA on basic-ui tokens
  - `useDialog`: `hasDescription` now defaults to `false` (callers rendering a description opt in), and `dialogProps` types the optional `aria-describedby`

- e63b2dd: Add `usePopover` (#71): the headless non-modal overlay primitive for popovers,
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

- 7250ed1: Add Milestone 1 of the headless primitives layer (#55).

  - `useControllableState` — the controlled/uncontrolled value pattern, used by every stateful primitive
  - `useDisclosure` — open/close/toggle state, built on `useControllableState`
  - `useId` — SSR-safe prefixed ids (delegates to React's `useId`)
  - `useAriaIds` — label/description/error id generation with spread-ready `labelProps`/`fieldProps` aria wiring
  - `useOutsideEvent` — outside-pointerdown and Escape dismissal for overlays

- 983382a: Add Milestone 2 of the headless primitives layer (#55): overlay behavior.

  - `Portal` — render children outside the React tree position (SSR-safe, custom container, `disabled` escape hatch); the base of every overlay
  - `useFocusTrap` — focus containment per the WAI-ARIA APG dialog pattern: activation moves focus in, Tab/Shift+Tab cycle, deactivation restores focus and removes `aria-hidden` marks; retries a frame later when portal content hasn't attached yet
  - `useOverlay` — overlay stack where only the topmost overlay dismisses on Escape/outside-pointerdown, plus a reference-counted scroll lock with scrollbar-gutter compensation (nested modals lock once, restore once)
  - `useDialog` — wires disclosure + overlay + focus trap + aria ids into the headless modal dialog pattern, returning spread-ready `dialogProps`/`titleProps`

- 78678dd: Add Milestone 3 of the headless primitives layer (#55): the select spike.

  - `useSelect` — headless single-select implementing the WAI-ARIA APG "Combobox (Select-Only)" pattern: a `role="combobox"` trigger with a portalled `role="listbox"` popup whose active option is conveyed through `aria-activedescendant` while DOM focus stays on the combobox
  - Full APG keyboard interface: Down/Up/Enter/Space open (first/last/no-move respectively), Home/End/PageUp/PageDown navigation without wrapping, Enter/Space/Tab commit, Escape closes retaining the value, and typeahead (multi-letter match with 500ms reset, same-letter cycling)
  - Mouse behavior per the APG reference: click toggles, option click selects and refocuses the combobox, pointerdown outside commits the active option and closes
  - Controlled/uncontrolled in both the selected value and the open state, built on `useControllableState` and `useDisclosure`; disabled options are skipped by keyboard navigation and unselectable
  - Simple `getBoundingClientRect` anchor positioning for the popup — collision handling deliberately deferred to the ADR (M4)

- 54034d3: Add `@basic-ui/react-utilities` package and extract shared React utilities from core.

  - New `@basic-ui/react-utilities` package with `cn`, `normalizeProps`, `getTruncateAccessibilityProps`, `forwardRefWithAs` and polymorphic prop types (`CommonProps`, `PropsWithAs`, `RestrictedPropsWithAs`, `PolymorphicRef`), plus the responsive hooks (`useBreakpoint`, `useResponsiveProps`, `ResponsiveValue` type, `BREAKPOINTS`)
  - `@basic-ui/core` depends on it via `workspace:*` and imports from it directly; the utilities are no longer re-exported from `@basic-ui/core`
  - **BREAKING**: `cn`, `forwardRefWithAs`, `normalizeProps`, `getTruncateAccessibilityProps`, `useBreakpoint`, `useResponsiveProps`, and the polymorphic prop types moved to `@basic-ui/react-utilities` — import them from there instead of `@basic-ui/core`

- 91321d4: Add `useAnchorPositioning` (#70): the shared positioning layer for portalled popups (popovers, dropdowns, tooltips, select popups).

  - Viewport-based coordinates (`position: fixed`) from the anchor's `getBoundingClientRect()`
  - `side` (top/bottom/left/right) + `align` (start/center/end) placement, with `sideOffset` and `viewportPadding`
  - If the requested side does not fit, flips to the mirrored side when possible, otherwise to the roomiest fitting perpendicular side; both axes are clamped into the viewport
  - Recomputes on captured scroll and window resize, so overflow-ancestor scrolls keep the popup glued to its anchor
  - Retries on animation frames until the portalled popup attaches

- 792add3: Add `useTooltip` (#72): headless hover/focus tooltip semantics on top of `usePopover`, per the WAI-ARIA APG "Tooltip" pattern.

  - Opens on pointerenter/focus after `delay` (default 400ms), closes on pointerleave/blur after `closeDelay` (default 200ms); Escape-closable via the overlay stack
  - Timer state lives in refs, never state — no re-render per delay tick
  - Stays open while the pointer is over the tooltip itself (enter clears pending close)
  - `role="tooltip"` with id wiring; trigger labelled via `aria-describedby`
  - `side`/`align`/`sideOffset`/`viewportPadding` forwarded to `usePopover`; `dismissOnOutside` fixed to `false` (tooltip persistence), `dismissOnEscape` on
  - Controlled/uncontrolled open per the library convention (`open`/`defaultOpen`/`onOpenChange`)
  - dismissOnEscape: true by default (Escape closes tooltip), configurable via props
  - Tracks hover and focus state separately — tooltip stays open when either is active, closes only when both pointer and focus are inactive
