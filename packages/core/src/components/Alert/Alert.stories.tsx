import type { Meta, StoryObj } from "@storybook/react-vite";
import { BriefcaseIcon } from "@basic-ui/icons";
import { useState } from "react";
import { Alert } from "./Alert";
import { Button } from "../Button";
import { Flex } from "../Flex";

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

const messages = {
  info: "A new version is available.",
  success: "Your profile was updated.",
  warning: "Your trial expires in three days.",
  error: "We could not save your changes.",
} as const;

export const Severities: Story = {
  render: () => (
    <Flex direction="column" gap={3} className="max-w-full">
      {(Object.keys(messages) as Array<keyof typeof messages>).map((severity) => (
        <Alert key={severity} severity={severity} title={severity}>
          {messages[severity]}
        </Alert>
      ))}
    </Flex>
  ),
};

export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap={3} className="max-w-full">
      <Alert severity="info" variant="subtle" title="Subtle">
        A tinted surface with a semantic border.
      </Alert>
      <Alert severity="info" variant="outline" title="Outline">
        A base surface with a stronger semantic border.
      </Alert>
    </Flex>
  ),
};

export const WithCustomIcon: Story = {
  render: () => (
    <Alert
      className="max-w-full"
      severity="info"
      title="Workspace updated"
      icon={<BriefcaseIcon />}
    >
      Your workspace settings have been applied.
    </Alert>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert
      className="max-w-full"
      severity="warning"
      title="Payment method expires soon"
      action={
        <Button variant="link" color="amber" size="sm">
          Update
        </Button>
      }
    >
      Update it now to avoid an interrupted subscription.
    </Alert>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Flex direction="column" gap={3} className="max-w-full">
        <Button variant="outline" color="primary" size="sm" onClick={() => setOpen(true)}>
          Show alert
        </Button>
        <Alert
          open={open}
          onOpenChange={setOpen}
          dismissible
          severity="success"
          title="Changes saved"
        >
          Your changes are now live.
        </Alert>
      </Flex>
    );
  },
};
