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

### Changed

- Updated `generateThemeCss` script to exclude primitive color tokens from CSS output, keeping generated theme.css clean and focused on semantic tokens.
- Updated Storybook `.storybook/index.css` to apply theme background and text colors to preview frame body.
- Refactored dark theme preset to use direct HSL values instead of CSS variable references for better build-time resolution.
- Enhanced theme type definitions to include all primitive color ramps (green, purple, gray) as available semantic tokens.
- Updated `themeToCustomProperties` utility to support optional token filtering.

### Fixed

- Updated pagination icons to use `Icon` component with `ChevronLeftIcon` and `ChevronRightIcon`.
- Refactored pagination logic to use `calculatePaginationState` utility function for cleaner code and better separation of concerns.
- Updated `usePagination` hook to return a more structured pagination state, including page numbers and navigation states.
- Improved responsive handling in `Icon` component by integrating `useResponsive` hook for dynamic styling based on breakpoints.
- Updated documentation to reflect new pagination logic and responsive icon handling.
- Cleaned up imports and re-exports in hooks and lib for better maintainability and clearer code structure.

### Fixed

- Fixed pagination state calculation to correctly handle edge cases when total pages are less than the maximum visible pages.
- Resolved issues with responsive icon sizing by ensuring proper use of `useResponsive` hook in the `Icon` component.

## [0.1.0] - 2024-06-01

### Added

- Initial release of `@basic-ui/core` package with foundational files and configuration for a React component library, including setup for TypeScript, testing, and build processes.
