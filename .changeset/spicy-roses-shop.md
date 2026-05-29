---
"@basic-ui/core": minor
---

[core/Box] Refine box as the "mother primitve" component. Improved type safety and flexibility by leveraging TypeScript's advanced type features. This allows Box to be used as a polymorphic component, enabling it to render as different HTML elements or custom components while maintaining proper typing and prop forwarding. This enhancement ensures that Box can serve as a versatile foundation for building other components in the library, while also providing better developer experience and reducing potential runtime errors.

[core/Image] Added a new Image component that serves as a wrapper around the native HTML <img> or <picture> elements. This component provides enhanced functionality such as automatic handling of responsive images, lazy loading, and improved accessibility features.

[core/Card] Implemented a full Card system with the following components: Card, CardHeader, CardBody, CardFooter, CardImage, CardTitle, and CardDescription. This comprehensive set of components allows developers to easily create complex card layouts with consistent styling and structure, while also providing flexibility for customization. Each component is designed to be used together or independently, making it easier to build a wide variety of card-based UI elements.

[core/Card] Support a Card.Unstyled component that removes visual card styling while still giving developers access to the card's structure and functionality. This allows for greater flexibility in designing custom card layouts without being constrained by default styles, while still benefiting from the underlying card components and their features.

[core/Layout] Added/updated layout utilities and responsive-prop handling used across components.

[core] Replaced many as any usages, tightened typings (displayName casts, prop types), fixed type-check errors, and improved handler typings.