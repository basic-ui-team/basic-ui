# Text truncation & overflow detection — design notes

Summary
-------
This documents the temporary `truncateLabel` + `detectOverflow` implementation added to `Text` and proposes a more robust design for production.

Current (temporary) implementation
---------------------------------
- Props added: `truncateLabel?: string`, `detectOverflow?: boolean`.
- When `truncate` is true and no `title`/`aria-label` provided, component sets both to `truncateLabel ?? children`.
- If `detectOverflow` is true, the component measures overflow at runtime (ResizeObserver + resize listener) and only applies labels when overflow is detected.
- Tests use a small test-hook: `data-test-overflow` attribute to force overflow state in JSDOM.

Why this is temporary
---------------------
- Measuring overflow reliably in all browsers/layout scenarios is tricky (inline vs block, multi-line truncation, CSS line-clamp, font loading, containers, transforms).
- Current approach mixes behavior and measurement in the component; it works but is brittle and adds testing hooks (`data-test-overflow`) that should not be permanent.
- Runtime measurement adds complexity and cost (ResizeObserver, event listeners) that should be optional and carefully designed.

Goals for a robust design
-------------------------
- Clear, minimal public API that covers common needs (single-line truncation, multi-line `line-clamp`, and accessible labeling).
- Avoid surprising behavior: do not overwrite consumer-provided `title`/`aria-label`.
- Make overflow detection accurate and efficient (debounced, using ResizeObserver, caretaking font-load/layout changes).
- Keep server-side rendering safe: no DOM access during SSR.
- Make tests reliable without internal test hooks by using integration/e2e testing where necessary.

API proposals
-------------
1) Minimal (safe):
   - `truncate?: boolean | number` — boolean for single-line, number for max lines (when using CSS line-clamp plugin).
   - `truncateLabel?: string` — explicit label to expose when truncated (recommended for non-string children).
   - `detectOverflow?: 'none' | 'auto'` (default 'none') — opt-in runtime detection for clipping.

2) Advanced (explicit):
   - `onOverflow?: (isOverflowing: boolean) => void` — allows parent to react/measure externally.
   - `overflowMode?: 'measure' | 'clamp'` — choose measurement strategy.

Implementation notes
--------------------
- Measurement:
  - Prefer `ResizeObserver` on the element and its container(s). On changes, measure using `scrollWidth>clientWidth` for single-line; for multi-line use `scrollHeight>clientHeight` and compare to computed `line-height * maxLines` when `line-clamp` is used.
  - Use `requestAnimationFrame` after DOM changes (e.g., font load) to measure reliably. Debounce measurements (50–150ms) to avoid thrashing.
  - Respect transforms and virtual scrolling; if element is not in layout (display:none), avoid measuring.

- Performance:
  - Make detectOverflow opt-in. If enabled, start observers lazily (e.g., on first render or when element mounts) and disconnect when unmounted.
  - Avoid global window resize listeners; prefer `ResizeObserver`. Use a single RO per component (disconnect on cleanup).

- Accessibility:
  - Never overwrite `title`/`aria-label` when provided by the consumer.
  - Prefer `aria-label` over `title` for screen readers. Consider `aria-describedby` if the full content is long and there's a dedicated element with the full text.
  - When adding labels automatically, ensure they are localized and trimmed when appropriate.

Testing strategy
----------------
- Unit tests: assert that explicit props (`truncateLabel`, user `title`) behave as expected.
- Integration/e2e: use Playwright or Puppeteer to create a real layout capable of measuring overflow (no property redefinition). That removes the need for test hooks.
- If JSDOM-only fast tests are required, keep a clearly-documented, short-lived test hook (e.g., `data-test-overflow`) and mark in the code as "testing shim — remove before stabilization".

Migration / rollout plan
------------------------
1. Merge the temporary implementation behind an opt-in prop (`detectOverflow`) and keep the default behavior conservative.
2. Add the engineering note (this file) and open a follow-up RFC/PR describing the full implementation plan.
3. Implement robust measurement with `ResizeObserver`, `requestAnimationFrame`, and multi-line support in one PR.
4. Add Playwright integration tests that verify overflow detection in a browser environment.
5. Remove the `data-test-overflow` hook and any testing-only code once integration tests cover the behavior.

Reverting local changes
----------------------
If you plan to revert the temporary changes now (as mentioned), follow these steps:
- Revert the `Text` component, `text.types.ts`, and tests changes in the working branch (git revert or checkout the previous commit/file versions).
- Keep this file (`.docs/engineering/ideas/text-truncation-overflow.md`) so the design notes remain.

Next steps (suggested)
----------------------
- Decide API surface: keep `truncateLabel` + `detectOverflow` opt-in or implement `onOverflow` callback.
- Implement robust overflow detection in a follow-up branch with integration tests.
- Remove the testing shim and merge.

Notes
-----
This document is intentionally concise. If you want, I can expand it into a full RFC including API signatures, performance budgets, and example code snippets for measure logic.
