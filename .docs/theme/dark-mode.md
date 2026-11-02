# Dark mode

Dark mode is supported out of the box via tailwind's class-based approach. The `dark:` variant applies styles when the `.dark` class is present on an ancestor element. Add the class to `<html>` or any ancestor of the components to enable dark mode:

```html
<html class="dark">
  ...
</html>
```

Dark mode does not automatically follow the operating system preference. Your app decides when to add or remove the class and whether to persist that choice.

## Connect your theme switch

The class is the whole theming mechanism; state management and persistence belong to your app. For example, once your app has decided whether dark mode is active:

```js
document.documentElement.classList.toggle("dark", isDark);
```

You can connect this to React state, a saved preference, or another theme setting. Storybook uses the same class-based approach through `withThemeByClassName`.

## Override dark colors

The default dark theme changes the semantic variables and shadows.

Add a `.dark` rule after the core stylesheet import to change dark semantic values. This selector has the same specificity as the library's rule, so your later declarations take effect:

```css
.dark {
  --surface: #10161d;
  --muted-foreground: #aab6c5;
  --border: #354151;
  --shadow-s1: 0 1px 2px 0 rgb(255 255 255 / 0.12);
}
```

The `--shadow-s1` through `--shadow-s5` values are ordinary CSS custom properties and can be overridden the same way. The default dark shadows use white-based values to create light-tinted elevation.

Set default semantic values on `:root` and dark values under `.dark`. Since the variables are ordinary CSS custom properties, you can also scope them to a selector. See [Customizing a theme](./customizing.md) for examples.

## Check both modes

When adjusting colors, check:

- Base, muted, and disabled text against their backgrounds.
- Hover and active states on interactive components.
- Focus-visible rings, especially on `Button`.
- Skeleton contrast.
- Borders against both light and dark surfaces.

Check these states in both modes, not just the resting appearance.
