import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";
import { Box } from "../Box";
import { Flex } from "../Flex";
import { Text } from "../Text";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    color: {
      control: "select",
      options: ["primary", "secondary", "error", "success", "warning", "info"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    defaultValue: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="md" align="start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Flex key={size} gap="sm" align="center">
          <Toggle size={size} defaultValue />
          <Text as="span" size="sm">{size}</Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Colors: Story = {
  render: () => (
    <Flex direction="column" gap="md" align="start">
      <Flex gap="sm" align="center">
        <Toggle color="primary" defaultValue />
        <Text as="span" size="sm">primary</Text>
      </Flex>
      <Flex gap="sm" align="center">
        <Toggle color="secondary" defaultValue />
        <Text as="span" size="sm">secondary</Text>
      </Flex>
      <Flex gap="sm" align="center">
        <Toggle color="success" defaultValue />
        <Text as="span" size="sm">success</Text>
      </Flex>
      <Flex gap="sm" align="center">
        <Toggle color="warning" defaultValue />
        <Text as="span" size="sm">warning</Text>
      </Flex>
      <Flex gap="sm" align="center">
        <Toggle color="error" defaultValue />
        <Text as="span" size="sm">error</Text>
      </Flex>
      <Flex gap="sm" align="center">
        <Toggle color="info" defaultValue />
        <Text as="span" size="sm">info</Text>
      </Flex>
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex gap="lg" align="center">
      <Toggle disabled />
      <Toggle disabled defaultValue />
    </Flex>
  ),
};

function ControlledDemo() {
  const [notifications, setNotifications] = useState(true);
  return (
    <Flex direction="column" gap="md" align="start">
      <Flex gap="sm" align="center">
        <Toggle
          value={notifications}
          onChange={setNotifications}
          aria-labelledby="controlled-toggle-label"
        />
        <Text as="span" id="controlled-toggle-label" weight="medium">
          Email notifications {notifications ? "on" : "off"}
        </Text>
      </Flex>
      <Box as="code" className="text-sm">
        value: {String(notifications)}
      </Box>
    </Flex>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
