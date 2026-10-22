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

export const Basic: Story = {
  render: () => (
    <Alert severity="info" title="A new version is available." className="max-w-full" />
  ),
};

export const Description: Story = {
  render: () => (
    <Alert
      severity="success"
      title="Changes saved"
      className="max-w-full"
    >
      Your changes are now live and visible to everyone on your team.
    </Alert>
  ),
};

export const Severity: Story = {
  render: () => (
    <Flex direction="column" className="gap-3 max-w-full">
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
    <Flex direction="column" className="gap-3 max-w-full">
      <Alert severity="info" variant="subtle" title="Subtle">
        A lightly tinted surface.
      </Alert>
      <Alert severity="info" variant="filled" title="Filled">
        A solid family-colored surface.
      </Alert>
      <Alert severity="info" variant="outline" title="Outline">
        A transparent surface with a family-colored border.
      </Alert>
    </Flex>
  ),
};

export const Color: Story = {
  render: () => (
    <Flex direction="column" className="gap-3 max-w-full">
      {(["teal", "violet", "rose"] as const).map((color) => (
        <Alert key={color} severity="info" color={color} title={color}>
          The severity keeps the role and icon; the family sets the colors.
        </Alert>
      ))}
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

export const WithCloseButton: Story = {
  render: () => (
    <Alert
      severity="warning"
      title="Trial expiring"
      dismissible
      className="max-w-full"
    >
      Your trial expires in three days. Upgrade to keep your workspace.
    </Alert>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Flex direction="column" className="gap-3 max-w-full">
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
