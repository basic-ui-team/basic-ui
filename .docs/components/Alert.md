Displays persistent inline feedback with optional title and dismissal without interrupting the users use of the app.

```Tsx
import { Alert } from "basic-ui/core"
<Alert title="Warning" description="This is a warning alert" severity="warning">
```

## Api Reference
The alert component  gives users information without obstructing their use of the app. It can be used to display informational or actionable prompts to the user. 


| **Prop**    | Type                                                                    | Default |
| ----------- | ----------------------------------------------------------------------- | ------- |
| severity    | "success" \| "error" \| "warning" \| "info"                             | "info"  |
| borderless  | boolean                                                                 |         |
| icon        | ReactNode \| false                                                      |         |
| iconMap     | Partial<Record<"success" \| "error" \| "warning" \| "info", ReactNode>> |         |
| title       | ReactNode                                                               |         |
| action      | ReactNode                                                               |         |
| onDismiss   | () => void                                                              |         |
| isOpen      | boolean                                                                 |         |

## Examples

  

### Severity

Use the `severity` prop to indicate the type of alert. This changes the color and icon to match the context.

  

```tsx

<Alert severity="info">This is an info alert.</Alert>

<Alert severity="success">This is a success alert.</Alert>

<Alert severity="warning">This is a warning alert.</Alert>

<Alert severity="error">This is an error alert.</Alert>

```

  

### Borderless

Set the `borderless` prop to remove the border from the alert for a more minimal appearance.

  

```tsx

<Alert severity="info" borderless>This is an info alert.</Alert>

<Alert severity="success" borderless>This is a success alert.</Alert>

<Alert severity="warning" borderless>This is a warning alert.</Alert>

<Alert severity="error" borderless>This is an error alert.</Alert>

```

  

### With Custom Icon

Override the default icon by passing a custom icon to the `icon` prop.

  

```tsx

const CustomCheckIcon = <span data-testid="custom-check">✓</span>;

<Alert severity="success" icon={CustomCheckIcon}>Test</Alert>

```

  

### With Custom Icon mapped to specific severity

Use the `iconMap` prop to provide custom icons for specific severities.

  

```tsx

const CustomCheckIcon = <span data-testid="custom-check">✓</span>;

<Alert severity="success" iconMap={{ success: CustomCheckIcon }}>Test</Alert>

```

  

### With Title

Add a title to the alert using the `title` prop.

  

```tsx

<Alert severity="info" title="Info Alert">This is an info alert.</Alert>

```

  

### Action

Add an action element (such as a button) to the alert using the `action` prop.

  

```tsx

<Alert severity="error" title="Missing Fields"

  action={

    <Button onClick={onUndoClick} size="sm">

      FIX

    </Button>

  }

>

  This is an alert with a button component as its action

</Alert>

```

  

### Controlled Visibility: `isOpen` and Dismissal

Use the `isOpen` prop to control the visibility of the alert. Combine with `onDismiss` to allow the alert to be dismissed by the user.

  

```tsx

const [open, setOpen] = useState(true);

  

<Alert

  severity="info"

  isOpen={open}

  onDismiss={() => setOpen(false)}

>

  This alert can be dismissed.

</Alert>

```

---

For more details, see the source code and stories in the repository. [Alert](https://github.com/basic-ui-team/basic-ui/tree/main/packages/core/src/components/Alert)
