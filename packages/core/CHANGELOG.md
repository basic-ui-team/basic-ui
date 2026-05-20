# @basic-ui/core

## 0.2.0

### Minor Changes

- ce32fac: [core/header] Add new Header component (polymorphic as prop) with responsive size, weight, color, align, truncate, and wrap variants; accessibility improvements (auto title / aria-label when truncated); includes Storybook stories and unit tests.

  [core/lib] Export BUILT_IN_HEADER_COLORS, isBuiltInHeaderColor, and BuiltInHeaderColor type to support header colors.

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
