# Customize semantic colors

Change semantic variables to adjust page backgrounds, surfaces, text, borders, and the primary color used across components.

## Override light and dark values

Set the default values on `:root` and override them under `.dark`:

```css
@import "@basic-ui/core/styles.css";

:root {
  --surface: #f0f4f8;
  --surface-foreground: #263445;
  --muted-foreground: #465365;
  --border: #cbd5e1;
}

.dark {
  --surface: #10161d;
  --surface-foreground: #eef2f7;
  --muted-foreground: #aab6c5;
  --border: #354151;
}
```

These variables are consumed through the theme's inline Tailwind bridge, so the component utilities follow the values at their scope. For the full list and more examples, see [Customizing a theme](../customizing.md).

## Check the result

Review both modes in components that use these roles:

- Cards and page sections for surfaces.
- Dialogs and tooltips for elevated surfaces.
- Dividers and borders against each surface.
- Skeletons, disabled controls, and hover states.
- Text contrast, including muted text.