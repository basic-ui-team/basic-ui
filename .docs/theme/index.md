# Theming

Change basic-ui's look with CSS custom properties. The theme uses Tailwind CSS v4; there is no JavaScript theme setup. Overrides are plain CSS custom property declarations, processed by your app's Tailwind v4 build.

The theme exposes semantic variables for backgrounds, foregrounds, surfaces, borders, status colors, and the primary color. Components share these variables, so you can change the library's appearance by overriding them directly.

Dark mode uses a `.dark` class with its own variable values. You can adapt those values to your app's theme switch.

## Get started

Start with [Getting started](./getting-started.md) to load the stylesheet and make a first override.

## Find what you need

- [Theme concepts](./concepts.md) explains the semantic variables and Tailwind utility bridge.
- [Customizing a theme](./customizing.md) covers overrides and scoping them to part of an app.
- [Dark mode](./dark-mode.md) describes the `.dark` class and dark-theme overrides.
- [Change the primary color](./recipes/brand-colors.md) shows how to customize the shared primary color.
- [Customize semantic colors](./recipes/semantic-colors.md) shows how to change backgrounds, text, surfaces, and borders.
- [Token reference](./reference/tokens.md) lists the theme's stylesheet exports and token groups.