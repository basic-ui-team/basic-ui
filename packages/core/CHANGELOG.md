# @basic-ui/core

## 0.3.0

### Minor Changes

- 7a75d22: \[core/Pagination] complete migration to universal box primitive component.

  \[core/Alert] Migrate to universal box primitive component.

  \[core/Alert] Migrate to universal box primitive component.

  \[tests] exclude dist and test utils from test runner to speed up test execution.

- 1f998f5: [core/Box] Refine box as the "mother primitve" component. Improved type safety and flexibility by leveraging TypeScript's advanced type features. This allows Box to be used as a polymorphic component, enabling it to render as different HTML elements or custom components while maintaining proper typing and prop forwarding. This enhancement ensures that Box can serve as a versatile foundation for building other components in the library, while also providing better developer experience and reducing potential runtime errors.

  [core/Image] Added a new Image component that serves as a wrapper around the native HTML <img> or <picture> elements. This component provides enhanced functionality such as automatic handling of responsive images, lazy loading, and improved accessibility features.

  [core/Card] Implemented a full Card system with the following components: Card, CardHeader, CardBody, CardFooter, CardImage, CardTitle, and CardDescription. This comprehensive set of components allows developers to easily create complex card layouts with consistent styling and structure, while also providing flexibility for customization. Each component is designed to be used together or independently, making it easier to build a wide variety of card-based UI elements.

  [core/Card] Support a Card.Unstyled component that removes visual card styling while still giving developers access to the card's structure and functionality. This allows for greater flexibility in designing custom card layouts without being constrained by default styles, while still benefiting from the underlying card components and their features.

  [core/Layout] Added/updated layout utilities and responsive-prop handling used across components.

  [core] Replaced many as any usages, tightened typings (displayName casts, prop types), fixed type-check errors, and improved handler typings.

- 8a26486: Added:
  [core/box] New Box component with polymorphic as prop, display prop and inherited layout props, and Storybook stories and tests.
  [core/layout] New Layout props with responsive support and tokenized spacing values, and helper functions splitLayoutProps and generateLayoutClassNames for handling layout-related props and class names in components.
  [core/text] Export Text component and props in component barrel file for easier imports.

  Changed:
  [core/components] Refactor components to use new Layout props and helper functions for consistent spacing and layout handling, and update Storybook stories and tests accordingly.
  [core/flex] Refactor Flex props to use display prop instead of inline bool prop, and update Storybook stories and tests to reflect this change.

### Patch Changes

- 1f998f5: [lint] Added lint scripts to all packages while simplifying the root configuration. This allows for consistent code quality checks across the entire monorepo and makes it easier for developers to run linting on their code before committing changes. By using ESLint with caching enabled, we can improve the performance of linting by only checking files that have changed since the last linting run, which helps to speed up the development workflow and maintain a clean codebase.

  [typescript] Enforced stronger typing across the codebase by enabling the noImplicitAny TypeScript compiler option and fix resulting errors.

  [accesibility] Brought jsx-a11y rules into package configs and fixed violations across the codebase. This improvement ensures that our components adhere to accessibility best practices, making them more inclusive and usable for all users, including those with disabilities.

- Updated dependencies [1f998f5]
  - @basic-ui/tokens@0.2.1
  - @basic-ui/icons@0.0.2

## 0.2.0

### Minor Changes

- ce32fac: [core/header] Add new Header component (polymorphic as prop) with responsive size, weight, color, align, truncate, and wrap variants; accessibility improvements (auto title / aria-label when truncated); includes Storybook stories and unit tests.

  [core/lib] Export BUILT_IN_HEADER_COLORS, isBuiltInHeaderColor, and BuiltInHeaderColor type to support header colors.

- f998f4d: [core/grid] Add Grid layout component with responsive, tokenized spacing and alignment props, auto column and row support, and template presets for common layouts (masonry, card list, sidebar, hero).
  [core/hooks] Add useBreakpoint and useResponsiveProps hooks for responsive prop handling, and deprecate useMediaQuery in favor of useBreakpoint for better SSR support and simpler API.
  [core/hooks] Refactor responsive prop handling to use useBreakpoint and simplify logic in previous useMediaQuery implementation.
  [core/flex] Refactor Flex prop types to use useResponsiveProps and add responsive support for all props, including gap and alignment.
  [core/docs] Update Storybook and docs to reflect new Grid component and responsive prop handling changes.
  [core/lib/accessibility] Add accessibility tests for getTruncateAccessibilityProps function and update documentation with usage examples.
- 5bb6101: [core/flex] Implemented a fully polymorphic, responsive, and customizable Flex component.

  [core/lib] Introduced the forwardRefWithAs helper (referenced in docs and used in components) to enable type-safe polymorphic components with proper ref forwarding and as prop support.

  [core/lib/accessibility] add getTruncateAccessibilityProps function for improved accessibility handling.

  [core/text] refactor Text component to use forwardRefWithAs and export TextOwnProps interface.

  [core/header] refactor Header component to use forwardRefWithAs and export HeaderOwnProps interface.

### Patch Changes

- Updated dependencies [ce32fac]
  - @basic-ui/tokens@0.2.0

## 0.1.0

### Minor Changes

- 2212108: [pagination] Deprecate and delete initial, old pagination component and related files.
  [pagination] Deprecate and delete old usePagination hook.
  [pagination] implement redesigned usePagination hook with new API and improved internal logic.
  [pagination] Implement new redesigned LinkPagination, using usePagination hook and common internal view renderer.
  [pagination] Implement new redesigned ButtonPagination, using usePagination hook and common internal view renderer.
  [pagination] Add new pagination stories and tests for new components.
  [test-utils] Add renderWithProvider, renderHookWithProvider and setupUser utils for testing components and hooks that require context providers or user interactions.
  [test-utils] Add createProviderBuilder utility for easily creating context providers for testing.
  [alert] update tests to use new renderWithProvider test util and remove redundant provider wrappers from individual tests.
  [common-props] clean up commonProps jsdoc comments and remove redundant descriptions.
- eac131a: Implement Polymorphic typing: Added a new types/props.ts file with utility types for polymorphic components, including CommonProps, PolymorphicRef, PropsWithAs, RestrictedPropsWithAs, and PolymorphicComponent, to standardize prop and ref handling across components.

  Updated Alert's prop types in alert.types.ts to use the new polymorphic types, restricting allowed elements to div, span, or p.

  Refactored Alert to accept an as prop, allowing it to render as a div, span, or p, with proper TypeScript typing and ref forwarding for each element type. This is achieved using new shared polymorphic types (PolymorphicRef, RestrictedPropsWithAs, etc.) defined in types/props.ts.

  Expanded Alert.test.tsx with tests for ref forwarding and rendering as all supported elements (div, span, p), and verified that native props and component props are handled correctly regardless of the rendered element.

  Updated JSDoc comments and usage examples in Alert.tsx to reflect the new polymorphic API and clarify usage patterns.

### Patch Changes

- 58c9cf9: Reimplement Alert component for better usability and cleaner API interface
- Updated dependencies [6484252]
  - @basic-ui/tokens@0.1.0
