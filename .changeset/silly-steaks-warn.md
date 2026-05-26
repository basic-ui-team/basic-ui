---
"@basic-ui/core": minor
---

[core/grid] Add Grid layout component with responsive, tokenized spacing and alignment props, auto column and row support, and template presets for common layouts (masonry, card list, sidebar, hero).
[core/hooks] Add useBreakpoint and useResponsiveProps hooks for responsive prop handling, and deprecate useMediaQuery in favor of useBreakpoint for better SSR support and simpler API.
[core/hooks] Refactor responsive prop handling to use useBreakpoint and simplify logic in previous useMediaQuery implementation.
[core/flex] Refactor Flex prop types to use useResponsiveProps and add responsive support for all props, including gap and alignment.
[core/docs] Update Storybook and docs to reflect new Grid component and responsive prop handling changes.
[core/lib/accessibility] Add accessibility tests for getTruncateAccessibilityProps function and update documentation with usage examples.
