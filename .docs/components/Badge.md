# Badge

Use `Badge` to attach a count or status dot to an element, such as a notification button or avatar.

```tsx
import { Badge, Button } from "@basic-ui/core";

<Badge content={3}>
  <Button aria-label="Notifications">Notifications</Button>
</Badge>;
```

## API

| Prop           | Type                                                    | Default       | Description |
| -------------- | ------------------------------------------------------- | ------------- | ----------- |
| `children`     | `React.ReactElement`                                    | Required      | The single element the badge is attached to. |
| `variant`      | `"count" \| "dot"`                                      | `"count"`     | Renders a count or label, or a compact status dot. |
| `content`      | `React.ReactNode`                                       | Required for `"count"` | Content displayed by a count badge. Not accepted with `variant="dot"`. |
| `max`          | `number`                                                | —             | For numeric content above this value, displays `max+` instead. |
| `color`        | `"default" \| PaletteColor`                             | `"default"`   | Sets the palette family. `"default"` uses slate. |
| `position`     | `"top-left" \| "top-right" \| "bottom-left" \| "bottom-right"` | `"top-right"` | Positions the badge relative to its attached element. |
| `ping`         | `boolean`                                               | `false`       | Adds a pulsing halo behind the badge. |
| `aria-label`   | `string`                                                | —             | Accessible name when the badge is exposed to assistive technology. |
| `aria-hidden`  | `boolean`                                               | Derived       | Explicitly controls whether the badge is hidden from assistive technology. By default it is decorative unless `aria-label` or `aria-live` is provided. |
| `aria-live`    | `"polite" \| "assertive" \| "off"`                      | —             | Opts an exposed badge into live-region behavior. |
| `className`    | `string`                                                | —             | Additional classes for the visible badge. |
| `style`        | `React.CSSProperties`                                   | —             | Inline styles for the visible badge. |

Standard span props are also accepted. The `ref` targets the visible badge indicator.

An exposed badge needs an `aria-label`; the component warns in development if it is exposed without one. `aria-hidden={true}` keeps it decorative even when a label or live-region setting is provided.

## Examples

### Capped notification count

When a numeric count exceeds `max`, the badge shows the maximum followed by `+`.

```tsx
<Badge content={100} max={99} color="red">
  <Button aria-label="Notifications">Notifications</Button>
</Badge>
```

### Status dot with ping

The dot variant does not display `content`. Set `ping` to add an animated halo; the visible dot remains stable.

```tsx
import { Badge, Box } from "@basic-ui/core";

<Badge variant="dot" color="green" position="bottom-right" ping>
  <Box className="h-7 w-7 rounded-full bg-surface-base" aria-label="Alex" />
</Badge>
```

### Exposed live count

Badges are decorative by default. Provide an accessible name when exposing one, and set `aria-live` when changes should be announced.

```tsx
<Badge
  content={3}
  aria-label="3 unread notifications"
  aria-live="polite"
>
  <Button aria-label="Notifications">Notifications</Button>
</Badge>
```

See the [Badge Storybook examples](../../packages/core/src/components/Badge/Badge.stories.tsx).
