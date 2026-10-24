# Change the brand colors

Replace the `primary`, `secondary`, and `accent` ramps to change the brand colors used by both utilities and component `color` props, such as `<Button color="primary" />`.

## Override the ramps

Add your values after the core stylesheet import in an `@theme static` block:

```css
@import "@basic-ui/core/styles.css";

@theme static {
  --color-primary-500: oklch(0.66 0.19 250);
  --color-primary-600: oklch(0.55 0.17 250);
  --color-accent-500: oklch(0.75 0.16 80);
}
```

This partial override is enough to change those shades; other shades retain their defaults. For a consistent component palette, define the full 50–950 ramp for each brand color you change. See [Customizing a theme](../customizing.md) for a complete ramp example.

You do not need separate dark-mode ramps. The palette is mode-independent; component color recipes select darker shades for dark mode.

## Check the result

Test the updated colors in both modes:

- `Button` with `color="primary"` in solid, ghost, outline, and link variants.
- Focus rings on colorized buttons.
- `Toggle`, `Spinner`, and `Icon` with brand colors.
- Direct utilities such as `bg-primary-600` and `text-accent-500`.