# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Added `@testing-library/user-event` dependency for improved user interaction testing.
- Added this changelog file to track changes in the project.
- Added `Assistant.agent.md` file for documenting the assistant agent's capabilities and usage.
- Added primitive color ramps (green, purple, gray) to theme configuration for internal semantic color definitions.
- Added complete dark theme with semantic color overrides, shadows, and feedback variants triggered by `.dark` class.
- Added dark mode shadow styles with light reflection for enhanced visibility on dark surfaces.
- Added feedback colors (success, warning, error, info) with light and foreground variants for both light and dark modes.
- Added `filterPrimitiveTokens` function to exclude internal primitive colors from generated CSS output.
- Added Storybook preview frame background styling to apply theme colors dynamically on mode toggle.
- Added Pagination component stories with theme integration.
- Added accent color ramps to light theme for expanded color palette.
- Added comprehensive test suite for `themeToCustomProperties` utility with 7 focused QA tests covering single/multiple categories, numeric values, null handling, edge cases, and multi-word token keys.

### Changed

- Updated `generateThemeCss` script to exclude primitive color tokens from CSS output, keeping generated theme.css clean and focused on semantic tokens.
- Updated Storybook `.storybook/index.css` to apply theme background and text colors to preview frame body.
- Refactored dark theme preset to use direct HSL values instead of CSS variable references for better build-time resolution.
- Enhanced theme type definitions to include all primitive color ramps (green, purple, gray) as available semantic tokens.
- Updated theme token generation flow to support optional token filtering when producing CSS output.
- Refactored theme system to use Tailwind CSS v4 integration.
- Updated color variable naming conventions across light and dark themes for consistency and clarity.
- Updated semantic tokens (background, foreground, border, feedback colors) to use new naming conventions and direct Tailwind color references where applicable.
- Refactored theme utilities by removing `extractTokens` from public API and consolidating logic into `themeToCustomProperties` function for streamlined token processing and CSS variable generation.

### Fixed

- Updated pagination icons to use `Icon` component with `ChevronLeftIcon` and `ChevronRightIcon`.
- Refactored pagination logic to use `calculatePaginationState` utility function for cleaner code and better separation of concerns.
- Updated `usePagination` hook to return a more structured pagination state, including page numbers and navigation states.
- Improved responsive handling in `Icon` component by integrating `useResponsive` hook for dynamic styling based on breakpoints.
- Updated documentation to reflect new pagination logic and responsive icon handling.
- Cleaned up imports and re-exports in hooks and lib for better maintainability and clearer code structure.
- Fixed pagination state calculation to correctly handle edge cases when total pages are less than the maximum visible pages.
- Resolved issues with responsive icon sizing by ensuring proper use of `useResponsive` hook in the `Icon` component.
- Resolved var() reference resolution in theme generation script to handle both direct and prefixed token names.

## [0.1.0] - 2024-06-01

### Added

- Initial release of `@basic-ui/core` package with foundational files and configuration for a React component library, including setup for TypeScript, testing, and build processes.
