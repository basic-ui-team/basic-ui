# Alert

Displays inline feedback for the user with optional title, icon, action, and dismissal. Alerts are non-modal and do not interrupt user tasks.

```tsx
import { Alert } from "@basic-ui/core";

<Alert severity="warning" title="Something went wrong">
  Please check the form and try again.
</Alert>;
```

## Overview

Use `Alert` for contextual messages such as success, error, warning, or informational notices. The component supports controlled visibility (`isOpen` + `onDismiss`) and an `action` slot for buttons or links.

## Examples

### Basic

```tsx
<Alert severity="info">This is an informational message.</Alert>
```

### With title and action

```tsx
<Alert severity="error" title="Failed to save" action={<Button size="sm">Retry</Button>}>
  Something went wrong while saving your changes.
</Alert>
```

### Dismissible (controlled)

```tsx
const [open, setOpen] = useState(true);

<Alert severity="info" isOpen={open} onDismiss={() => setOpen(false)}>
  This alert can be dismissed by the user.
</Alert>;
```

### Custom icons

```tsx
const CustomIcon = <span aria-hidden>★</span>;
<Alert severity="success" icon={CustomIcon}>Custom icon</Alert>

// or map icons per severity
<Alert iconMap={{ success: CustomIcon }}>Mapped icon</Alert>
```

## API

| Prop         | Type                                          | Default   | Description                                                        |
| ------------ | --------------------------------------------- | --------- | ------------------------------------------------------------------ | --------------------------- | --- | ------------------------------------------------------------ |
| `severity`   | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'`  | Visual intent, controls colors and default icon.                   |
| `title`      | `React.ReactNode`                             | —         | Optional heading displayed at the start of the alert.              |
| `children`   | `React.ReactNode`                             | —         | Main message content.                                              |
| `action`     | `React.ReactNode`                             | —         | Action slot (button/link) displayed inline.                        |
| `icon`       | `React.ReactNode \| false`                    | —         | Override the default icon; pass `false` to hide it.                |
| `iconMap`    | `Partial<Record<'info'                        | 'success' | 'warning'                                                          | 'error', React.ReactNode>>` | —   | Provide icons keyed by severity. `icon` overrides `iconMap`. |
| `borderless` | `boolean`                                     | `false`   | Remove border for a minimal appearance.                            |
| `isOpen`     | `boolean`                                     | —         | Controlled visibility. When omitted, the alert is always rendered. |
| `onDismiss`  | `() => void`                                  | —         | Called when the user dismisses the alert (if dismissible).         |

## Accessibility

- The alert content includes `role="status"` for non-urgent informational messages and may use `role="alert"` for assertive messages depending on severity — check implementation for details.
- Active focus behavior: when dismissible, ensure focus is managed by the consumer after dismissal if needed.
- Icons should include meaningful text via `aria-hidden` combined with the message content; avoid conveying critical information solely through color or icon.

## Stories & Source

- Storybook examples: `Alert/Basic`, `Alert/WithAction`, `Alert/Dismissible` (if present).
- Source: https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/Alert
