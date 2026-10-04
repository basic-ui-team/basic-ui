---
"@basic-ui/react-utilities": minor
---

Add Milestone 3 of the headless primitives layer (#55): the select spike.

- `useSelect` — headless single-select implementing the WAI-ARIA APG "Combobox (Select-Only)" pattern: a `role="combobox"` trigger with a portalled `role="listbox"` popup whose active option is conveyed through `aria-activedescendant` while DOM focus stays on the combobox
- Full APG keyboard interface: Down/Up/Enter/Space open (first/last/no-move respectively), Home/End/PageUp/PageDown navigation without wrapping, Enter/Space/Tab commit, Escape closes retaining the value, and typeahead (multi-letter match with 500ms reset, same-letter cycling)
- Mouse behavior per the APG reference: click toggles, option click selects and refocuses the combobox, pointerdown outside commits the active option and closes
- Controlled/uncontrolled in both the selected value and the open state, built on `useControllableState` and `useDisclosure`; disabled options are skipped by keyboard navigation and unselectable
- Simple `getBoundingClientRect` anchor positioning for the popup — collision handling deliberately deferred to the ADR (M4)
