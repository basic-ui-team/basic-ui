---
"@basic-ui/core": minor
---

Migrate Grid and Divider presentation to static responsive CSS.

- Grid presets override both column and row counts; `templatePreset="none"`
  restores the latest counts, or implicit tracks when counts are absent.
- Correct Grid axis gap utilities to `gap-x-*` and `gap-y-*`.
- Divider direction, appearance, and color are scalar. Thickness and inset
  remain responsive; vertical insets apply on the vertical axis.
- Support the finite existing Grid template vocabulary independently of recipes.
