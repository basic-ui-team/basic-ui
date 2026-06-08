---
"@basic-ui/core": minor
---

[core/badge] Added Badge component which allows the user to display a small status icon at the corner of any element. The badge can display a small dot icon, a number or a custom icon. The badge can be used to indicate the status of an element, such as whether it is active, inactive, or has new content.

[core/lib] Improved the `normalizeProps` utility to better handle camelCase-to-dashed HTML attribute conversion, including support for `aria-hidden` and `aria-live`, and added dev-time warnings for unrecognized attributes to help catch potential issues during development.

[core/skeleton] Added Skeleton component which allows the user to display a placeholder while content is loading. The skeleton can be used to indicate that content is loading and to improve the user experience by providing a visual cue that something is happening. The skeleton can be used in various shapes and sizes, such as text, circular, and rectangular. The skeleton can also be animated to provide a more dynamic loading experience.

[core/layout] Update layout to return a named object of resolved layout props and apply them to the core box element. Users will stil be able to use className and style props to override the default styles, but the layout system will now be more flexible and easier to use. This change allows for better separation of concerns between layout and styling, and makes it easier to create custom layouts without having to worry about the underlying implementation details.
