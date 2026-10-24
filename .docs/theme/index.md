# Theming

Change basic-ui's look with CSS custom properties. The theme uses Tailwind CSS v4; there is no JavaScript theme setup. Overrides are plain CSS custom property declarations, processed by your app's Tailwind v4 build.

Most changes fall into one of two places:

- **Palette tokens** define color ramps such as `primary` and `accent`. Change a ramp to update uses of those colors across the library.
- **Semantic tokens** name common roles such as background, foreground, surface, and border. Override these when you want to change how the interface is presented, rather than replace a color ramp.

Dark mode uses a `.dark` class and overrides the semantic colors and shadows. You can adapt those overrides to your app's theme switch.

## Get started

Start with [Getting started](./getting-started.md) to load the stylesheet and make a first override.

## Find what you need

- [Theme concepts](./concepts.md) explains palette tokens, semantic tokens, and component color recipes.
- [Customizing a theme](./customizing.md) covers overrides and scoping them to part of an app.
- [Dark mode](./dark-mode.md) describes the `.dark` class and dark-theme overrides.
- [Change the brand colors](./recipes/brand-colors.md) walks through replacing palette ramps.
- [Customize semantic colors](./recipes/semantic-colors.md) shows how to change backgrounds, text, surfaces, and borders.
- [Token reference](./reference/tokens.md) lists the theme's stylesheet exports and token groups.