import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./Toggle";
import { PALETTE_FAMILIES } from "../../lib/colorRecipes/colorRecipes";
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
      options: [...PALETTE_FAMILIES],
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
    <Flex direction="row" className="gap-3" align="start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Flex key={size} className="gap-2" align="center">
          <Toggle size={size} defaultValue />
          <Text as="span" size="sm">
            {size}
          </Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Colors: Story = {
  render: () => (
    <Flex direction="row" className="gap-3" align="start" wrap="wrap">
      {PALETTE_FAMILIES.map((color) => (
        <Flex key={color} className="gap-2" align="center">
          <Toggle color={color} defaultValue />
          <Text as="span" size="sm">
            {color}
          </Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Flex className="gap-4" align="center">
      <Toggle disabled />
      <Toggle disabled defaultValue />
    </Flex>
  ),
};

function ControlledDemo() {
  const [notifications, setNotifications] = useState(true);
  return (
    <Flex direction="column" className="gap-3" align="start">
      <Flex className="gap-2" align="center">
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
