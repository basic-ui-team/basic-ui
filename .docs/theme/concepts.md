# Theme concepts

The theme is CSS, compiled by the Tailwind CSS v4 setup in your app. It has three layers:

```text
palette (raw color ramps)
  -> semantic tokens (interface roles)
    -> component styles
```

The semantic tokens refer to palette variables with `var()`. They are references, not copies, so changing a palette value updates the components that use it in both light and dark mode.

## Palette tokens

The theme defines the `primary`, `secondary`, and `accent` brand ramps, each with shades from 50 to 950, along with `white` and `black`. Standard Tailwind color families—including `neutral`—are included from the installed Tailwind theme.

Palette values are emitted statically. Components can use a `color` prop to look up a family and shade at runtime, so those variables need to be present even when your app has no matching literal utility class.

Changing a palette shade also changes any semantic token that refers to it. For example, the default semantic grays use the neutral ramp, so changing neutral shades re-tints gray surfaces, borders, and text in both modes.

## Semantic tokens

Semantic tokens describe the role a color plays, rather than its hue:

- `bg`: page and background colors
- `fg`: text colors
- `surface`: component surfaces
- `border`: borders

Each group has state values such as `base`, `muted`, `hover`, `active`, `disabled`, and `inverted`; `fg` also has `skeleton`. Components use these semantic tokens for their standard surfaces and text. They do not rely on raw palette shades for those styles.

## Component color recipes

Some components, including `Button`, `Icon`, `Spinner`, and `Toggle`, also accept a `color` prop. It selects a palette family; the component's recipe then sets CSS variables for its base, hover, active, focus, and dark values. Fixed utility classes read those variables.

The supported families are the standard Tailwind color families and the three authored ramps: `primary`, `secondary`, and `accent`. Palette shades are chosen at runtime, but the class names are fixed. Tailwind cannot generate utility classes from class names assembled dynamically in JavaScript.

## Tailwind utilities and token emission

Tailwind utilities generated from theme namespaces resolve their values through CSS variables. That lets a consumer override a token without rebuilding utilities. A few namespaces need special handling: the theme supplies `@utility` shims for named duration, z-index, opacity, and shadow utilities.

Tailwind removes unused variables from a regular `@theme` block. `@theme static` keeps its variables in the output even when no utility refers to them. The library uses static emission for its own tokens because component recipes and application CSS can read variables at runtime.

For your own tokens, use a regular `@theme` block when they are used by utilities. Use `@theme static` when they must also be available through `var(...)` in plain CSS or runtime lookups.