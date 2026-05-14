import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";
import { BriefcaseIcon } from "@basic-ui/icons";
import { useState } from "react";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Alert>;
export default meta;

type Story = StoryObj<typeof Alert>;

export const AllSeverities: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info">This is an info alert.</Alert>
      <Alert severity="success">This is a success alert.</Alert>
      <Alert severity="warning">This is a warning alert.</Alert>
      <Alert severity="error">This is an error alert.</Alert>
    </div>
  ),
};

export const Borderless: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" borderless>
        This is an info alert.
      </Alert>
      <Alert severity="success" borderless>
        This is a success alert.
      </Alert>
      <Alert severity="warning" borderless>
        This is a warning alert.
      </Alert>
      <Alert severity="error" borderless>
        This is an error alert.
      </Alert>
    </div>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" title="Info Alert">
        This is an info alert.
      </Alert>
      <Alert severity="success" title="Success Alert">
        This is a success alert.
      </Alert>
      <Alert severity="warning" title="Warning Alert">
        This is a warning alert.
      </Alert>
      <Alert severity="error" title="Error Alert">
        This is an error alert.
      </Alert>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Alert severity="info" title="Info Alert" icon={<BriefcaseIcon />}>
        This is an info alert.
      </Alert>
      <Alert severity="success" title="Success Alert" icon={<BriefcaseIcon />}>
        This is a success alert.
      </Alert>
      <Alert severity="warning" title="Warning Alert" icon={<BriefcaseIcon />}>
        This is a warning alert.
      </Alert>
      <Alert severity="error" title="Error Alert" icon={<BriefcaseIcon />}>
        This is an error alert.
      </Alert>
    </div>
  ),
};

export const Dismissible: Story = {
  args: {
    severity: "info",
    title: "Dismissible Alert",
    children: "This alert can be dismissed by the user.",
    onDismiss: () => alert("Alert dismissed!"),
  },
};

export const WithAction: Story = {
  args: {
    severity: "info",
    title: "Alert with Action",
    children: "This alert includes a custom action element.",
    action: <button className="text-sm text-blue-600 hover:underline">Take Action</button>,
  },
};

export const WithActionAndDismiss: Story = {
  args: {
    severity: "info",
    title: "Alert with Action and Dismiss",
    children: "This alert includes both a custom action and a dismiss button.",
    action: <button className="text-sm text-blue-600 hover:underline">Take Action</button>,
    onDismiss: () => alert("Alert dismissed!"),
  },
};

// using the onDimiss callback to remove the alert from the DOM instead of just hiding it, to demonstrate the isOpen prop
export const ControlledDismissal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="flex flex-col gap-md">
        <button
          onClick={() => setIsOpen(true)}
          className="self-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Show Alert
        </button>
        {isOpen && (
          <Alert
            severity="warning"
            title="Controlled Dismissal Alert"
            isOpen={isOpen}
            onDismiss={() => setIsOpen(false)}
          >
            This alert can be dismissed, which will remove it from the DOM. Click "Show Alert" to
            display it again.
          </Alert>
        )}
      </div>
    );
  },
};
