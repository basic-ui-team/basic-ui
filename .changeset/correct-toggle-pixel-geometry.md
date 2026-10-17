---
"@basic-ui/core": patch
---

Correct Toggle geometry that mixed nonlinear token spacing with Tailwind's
default numeric scale. Tracks now use explicit 32x16, 36x20, and 44x24px sizes,
12/14/16px thumbs, and 16/18/24px checked travel with 2px horizontal insets.
Thumbs remain vertically centered; medium and large sizes retain extra vertical
space. Both states use the same responsive size decision.

Add a finite reviewed fixed-pixel geometry vocabulary, independent of component
recipes, so these literal utilities are available through the public stylesheet.
