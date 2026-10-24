# Customize semantic colors

Change semantic colors when you want to re-skin page backgrounds, surfaces, text, or borders without changing the brand ramps or component color recipes.

## Override light and dark values

Add the light values in `@theme` and dark values in `.dark`, after the core stylesheet import:

```css
@import "@basic-ui/core/styles.css";

@theme {
  --color-surface-base: #f0f4f8;
  --color-fg-muted: #465365;
  --color-border-base: #cbd5e1;
}

.dark {
  --color-surface-base: #10161d;
  --color-fg-muted: #aab6c5;
  --color-border-base: #354151;
}
```

Do not put semantic overrides in a plain `:root` block; it would override the theme's dark values too. For the full cascade explanation, see [Customizing a theme](../customizing.md).

## Check the result

Review both modes in components that use these roles:

- Cards and page sections for surfaces.
- Dialogs and tooltips for elevated surfaces.
- Dividers and borders against each surface.
- Skeletons, disabled controls, and hover states.
- Text contrast, including muted text.