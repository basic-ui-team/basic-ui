---
"@basic-ui/tokens": minor
---

[tokens/themeConfig] Refactored theme config. Color themes are no written as nested objects generated directly from types.

[tokens] refactored themeToCustomProperties (Renamed to themeToCSSVariables) to handle nested color objects properly.

[token/themes] move and refactor preset themes into themes folder. Refactored to match new token config. Use tailwind oklch values for color ramps to ensure better colors and accessibility.

[tokens/scripts] refactored generate-theme-css to generate both css for exporting and token object for programmatic token use.
