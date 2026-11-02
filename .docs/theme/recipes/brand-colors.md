# Change the primary color

Components share the `primary` semantic color. Override `--primary` and `--primary-foreground` to change the brand color and the text or icon color paired with it.

## Override the primary pair

Add your values after the core stylesheet import:

```css
@import "@basic-ui/core/styles.css";

:root {
  --primary: oklch(0.55 0.2 250);
  --primary-foreground: white;
}

.dark {
  --primary: oklch(0.78 0.13 250);
  --primary-foreground: oklch(0.2 0.03 250);
}
```

The `.dark` override is optional, but it lets you choose a primary color that works better against dark surfaces. There are no palette ramps or component `color` props to configure.

## Check the result

Check the primary color and its foreground in both modes:

- Buttons in solid, ghost, outline, and link variants.
- Text and icons on primary-colored surfaces.
- Focus rings and hover/active states.
- Contrast between the primary color and its foreground.