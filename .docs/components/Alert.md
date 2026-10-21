# Alert

Use `Alert` to show persistent, non-modal feedback such as a save confirmation or an issue that needs attention.

```tsx
import { Alert } from "@basic-ui/core";

<Alert severity="success" title="Changes saved">
  Your changes are now live.
</Alert>;
```

## API

| Prop           | Type                                          | Default                        | Description                                                                           |
| -------------- | --------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| `severity`     | `"success" \| "error" \| "warning" \| "info"` | `"info"`                       | Sets the alert's meaning, default icon, and default color family.                     |
| `variant`      | `"subtle" \| "filled" \| "outline"`           | `"filled"`                     | Sets the alert's visual style.                                                        |
| `color`        | `PaletteColor`                                | Derived from `severity`        | Overrides the color family without changing the severity or its accessibility role.   |
| `title`        | `React.ReactNode`                             | —                              | Optional title shown above the message.                                               |
| `children`     | `React.ReactNode`                             | —                              | The alert message.                                                                    |
| `icon`         | `React.ReactNode \| false`                    | Icon for the selected severity | Replaces the default icon; pass `false` to hide the icon.                             |
| `action`       | `React.ReactNode`                             | —                              | Optional action, such as a button or link.                                            |
| `dismissible`  | `boolean`                                     | `false`                        | Shows a close button that dismisses the alert.                                        |
| `open`         | `boolean`                                     | —                              | Controls whether the alert is rendered. Use with `onOpenChange` for controlled state. |
| `defaultOpen`  | `boolean`                                     | `true`                         | Initial visibility when `open` is not provided.                                       |
| `onOpenChange` | `(open: boolean) => void`                     | —                              | Called when the alert requests a visibility change.                                   |
| `as`           | `"div" \| "section"`                          | `"div"`                        | Sets the root element.                                                                |
| `className`    | `string`                                      | —                              | Additional classes for the root element.                                              |
| `id`           | `string`                                      | —                              | HTML `id` for the root element.                                                       |
| `style`        | `React.CSSProperties`                         | —                              | Inline styles for the root element.                                                   |

`PaletteColor` is a palette family such as `"teal"`, `"violet"`, `"primary"`, or `"secondary"`. Standard HTML attributes and event handlers for the selected root element are also accepted.

When `open` is omitted, the alert manages its own visibility, starting from `defaultOpen`. When `open` is provided, update it in response to `onOpenChange` to dismiss or show the alert.

## Examples

### Severity

Severity selects a default icon and color family. Error and warning alerts use `role="alert"`; info and success alerts use `role="status"`.

```tsx
<Alert severity="info" title="New version available">
  Refresh to get the latest features.
</Alert>

<Alert severity="error" title="Could not save changes">
  Check your connection and try again.
</Alert>
```

### Variants and color

Choose a visual variant independently of the message severity. A custom color changes the palette while preserving severity semantics.

```tsx
<Alert severity="warning" variant="outline" color="amber" title="Trial expiring">
  Your trial expires in three days.
</Alert>
```

### Custom icon and action

Use `icon` to provide a custom icon, or pass `false` to omit it. The `action` slot can contain an interactive control.

```tsx
import { Alert, Button } from "@basic-ui/core";
import { BriefcaseIcon } from "@basic-ui/icons";

<Alert
  severity="info"
  title="Workspace updated"
  icon={<BriefcaseIcon />}
  action={<Button size="sm">View workspace</Button>}
>
  Your workspace settings have been applied.
</Alert>;
```

### Dismissible alert

Use `dismissible` to show an accessible close button. This example uses uncontrolled visibility.

```tsx
<Alert severity="warning" title="Payment method expires soon" dismissible>
  Update your payment method to avoid an interrupted subscription.
</Alert>
```

For controlled visibility, keep the `open` value in application state and update it with `onOpenChange`:

```tsx
import { useState } from "react";
import { Alert, Button } from "@basic-ui/core";

function SaveNotice() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show alert</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        dismissible
        severity="success"
        title="Changes saved"
      >
        Your changes are now live.
      </Alert>
    </>
  );
}
```

See the [Alert Storybook examples](../../packages/core/src/components/Alert/Alert.stories.tsx).
