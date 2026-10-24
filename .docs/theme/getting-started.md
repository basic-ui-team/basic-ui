# Getting started with themes

The theme is CSS, compiled by your app's Tailwind CSS v4 build. Import the core stylesheet, then add your overrides after the import.

## Prerequisites

Use React 18 or later and Tailwind CSS v4. Your app must process the stylesheet through its Tailwind v4 integration; importing it through a plain CSS bundler will not generate utilities.

## Install

`@basic-ui/core` declares React, React DOM, and Tailwind CSS as peer dependencies. npm 7+ and pnpm 8+ install peer dependencies automatically:

```bash
npm install @basic-ui/core
```

```bash
pnpm add @basic-ui/core
```

With Yarn, list the peer dependencies explicitly:

```bash
yarn add @basic-ui/core react react-dom tailwindcss
```

You do not need to install `@basic-ui/tokens` separately when using `@basic-ui/core`. Core depends on tokens and imports its theme in the core stylesheet.

## Load the stylesheet

Add this to your app's CSS entry point:

```css
@import "@basic-ui/core/styles.css";
```

The core stylesheet includes the theme, palette, and component classes, and registers its own source files with Tailwind. You do not need to add a separate import for `@basic-ui/tokens`.

## Make a first change

Use an `@theme` block after the import to override semantic tokens or add a color:

```css
@import "@basic-ui/core/styles.css";

@theme {
  /* Override existing semantic tokens */
  --color-bg-base: #f7f8fa;
  --color-fg-base: #182230;
  --color-border-base: #d7dce2;

  /* Add a color utility, such as bg-brand-surface */
  --color-brand-surface: #eef2ff;
}
```

Keep the `@theme` block after the import. Do not use a plain `:root` block to override semantic tokens: it would take precedence over the theme's `.dark` values. For changing a palette ramp, see [Customizing a theme](./customizing.md).

## Use dark mode

The `dark:` variant and the theme's dark colors follow a `.dark` class. Add it to the page or an ancestor of the components:

```html
<html class="dark">
  ...
</html>
```

The theme does not switch based on the operating system preference. Your app controls when to add or remove the class. To customize dark semantic colors, add a `.dark` rule after the import:

```css
.dark {
  --color-bg-base: #111827;
  --color-fg-base: #f9fafb;
  --color-border-base: #374151;
}
```

See [Dark mode](./dark-mode.md) for more detail.

## Check the result

Run the app and check a page with basic-ui components. If your changes do not appear, check that Tailwind CSS v4 processes the stylesheet and that your overrides follow the import. If light-mode changes appear but dark mode looks wrong, move semantic overrides from `:root` to `@theme`. Confirm that `.dark` is on the page or an ancestor when checking dark mode.

For the token layers, see [Theme concepts](./concepts.md). For the available token groups, see the [token reference](./reference/tokens.md).
