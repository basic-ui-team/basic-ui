---
"@basic-ui/core": minor
---

Added:
[core/box] New Box component with polymorphic as prop, display prop and inherited layout props, and Storybook stories and tests.
[core/layout] New Layout props with responsive support and tokenized spacing values, and helper functions splitLayoutProps and generateLayoutClassNames for handling layout-related props and class names in components.
[core/text] Export Text component and props in component barrel file for easier imports.

Changed:
[core/components] Refactor components to use new Layout props and helper functions for consistent spacing and layout handling, and update Storybook stories and tests accordingly.
[core/flex] Refactor Flex props to use display prop instead of inline bool prop, and update Storybook stories and tests to reflect this change.
