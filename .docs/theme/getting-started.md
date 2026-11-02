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

The core stylesheet includes the theme and component utilities, and registers its own source files with Tailwind. You do not need to add a separate import for `@basic-ui/tokens`.

## Make a first change

Override the semantic variables after the import. For example, set the primary pair and page colors on `:root`:

```css
@import "@basic-ui/core/styles.css";

:root {
  --background: #f7f8fa;
  --foreground: #182230;
  --primary: #3558a8;
  --primary-foreground: white;
  --border: #d7dce2;
}
```

These variables are the theme's CSS API. Components use the shared semantic colors; there are no palette ramps or JavaScript theme setup. For the other variables you can override, see [Customizing a theme](./customizing.md).

## Use dark mode

The `dark:` variant and the theme's dark colors follow a `.dark` class. Add it to the page or an ancestor of the components:

```html
<html class="dark">
  ...
</html>
```

The theme does not switch based on the operating system preference. Your app controls when to add or remove the class. Override the same variables under `.dark` to customize their dark-mode values:

```css
.dark {
  --background: #111827;
  --foreground: #f9fafb;
  --primary: #9ab6ff;
  --primary-foreground: #111827;
  --border: #374151;
}
```

See [Dark mode](./dark-mode.md) for more detail.

## Check the result

Run the app and check a page with basic-ui components. If your changes do not appear, check that Tailwind CSS v4 processes the stylesheet and that your overrides follow the import. If dark-mode changes do not appear, confirm that the `.dark` class is on the page or an ancestor and that the overrides are inside a `.dark` rule.

For the token layers, see [Theme concepts](./concepts.md). For the available token groups, see the [token reference](./reference/tokens.md).
