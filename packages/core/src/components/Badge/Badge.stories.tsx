import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Box } from "../Box";
import { Flex } from "../Flex";
import { Text } from "../Text";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    content: {
      control: "text",
      description: "The content to be displayed within the badge",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "error", "info"],
      description: "The color of the badge",
    },
    variant: {
      control: "select",
      options: ["standard", "dot"],
      description: "The variant of the badge",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "The size of the badge",
    },
    shape: {
      control: "select",
      options: ["rounded", "square", "circular"],
      description: "The shape of the badge",
    },
    position: {
      control: "select",
      options: ["top-left", "top-right", "bottom-left", "bottom-right"],
      description: "The position of the badge relative to its parent",
    },
    ping: {
      control: "boolean",
      description: "Whether the badge should have a pulsing animation",
    },
    visible: {
      control: "boolean",
      description: "Whether the badge is visible",
    },
    max: {
      control: "number",
      description: "Maximum value to display. If exceeded, shows 'max+'",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

/**
 * Default badge with minimal configuration
 */
export const Default: Story = {
  args: {
    content: "5",
    children: (
      <Flex
        justify="center"
        align="center"
        className="w-12 h-12 bg-primary-700 rounded-sm text-fg-base"
      >
        <Text>Icon</Text>
      </Flex>
    ),
  },
};

/**
 * Badge with custom content
 */
export const WithCustomContent: Story = {
  render: () => (
    <Box className="relative w-12 h-12">
      <Badge content="New" position="top-right">
        <Flex
          justify="center"
          align="center"
          className="w-12 h-12 bg-secondary-700 rounded-sm text-fg-base"
        >
          <Text>Item</Text>
        </Flex>
      </Badge>
    </Box>
  ),
};

/**
 * All available color variants
 */
export const AllColors: Story = {
  render: () => (
    <Flex gap="lg" wrap="wrap">
      {(["primary", "secondary", "success", "warning", "error", "info"] as const).map((color) => (
        <Box key={color} className="relative w-12 h-12">
          <Badge content={color.charAt(0).toUpperCase()} color={color}>
            <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
              <Text className="text-xs">Badge</Text>
            </Box>
          </Badge>
        </Box>
      ))}
    </Flex>
  ),
};

/**
 * Standard vs Dot variants
 */
export const Variants: Story = {
  render: () => (
    <Flex gap="lg">
      <Box className="relative w-12 h-12">
        <Badge content="9" variant="standard" color="primary">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">Standard</Text>
          </Box>
        </Badge>
      </Box>
      <Box className="relative w-12 h-12">
        <Badge content="" variant="dot" color="primary">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">Dot</Text>
          </Box>
        </Badge>
      </Box>
    </Flex>
  ),
};

/**
 * All available sizes
 */
export const AllSizes: Story = {
  render: () => (
    <Flex gap="lg" align="start" p="md">
      {(["small", "medium", "large"] as const).map((size) => (
        <Box key={size} className="relative w-12 h-12">
          <Badge content={size.charAt(0).toUpperCase()} size={size} color="primary">
            <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
              <Text className="text-xs">{size.charAt(0).toUpperCase() + size.slice(1)}</Text>
            </Box>
          </Badge>
        </Box>
      ))}
    </Flex>
  ),
};

/**
 * All available shapes
 */
export const AllShapes: Story = {
  render: () => (
    <Flex gap="lg" align="start" p="md">
      {(["rounded", "square", "circular"] as const).map((shape) => (
        <Box key={shape} className="relative w-12 h-12">
          <Badge content="5" shape={shape} color="primary">
            <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
              <Text className="text-xs">{shape.charAt(0).toUpperCase() + shape.slice(1)}</Text>
            </Box>
          </Badge>
        </Box>
      ))}
    </Flex>
  ),
};

/**
 * All available positions
 */
export const AllPositions: Story = {
  render: () => (
    <Flex gap="lg" wrap="wrap">
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((position) => (
        <Box key={position} className="relative w-12 h-12">
          <Badge content="5" position={position} color="primary">
            <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
              <Text className="text-xs">
                {position.charAt(0).toUpperCase() + position.slice(1).replace("-", " ")}
              </Text>
            </Box>
          </Badge>
        </Box>
      ))}
    </Flex>
  ),
};

/**
 * Badge with max value overflow
 */
export const WithMaxValue: Story = {
  render: () => (
    <Flex gap="lg">
      <Box className="relative w-12 h-12">
        <Badge content={5} max={10} color="primary">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">5/10</Text>
          </Box>
        </Badge>
      </Box>
      <Box className="relative w-12 h-12">
        <Badge content={99} max={10} color="error">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">99/10</Text>
          </Box>
        </Badge>
      </Box>
    </Flex>
  ),
};

/**
 * Badge with pulsing animation
 */
export const WithPing: Story = {
  args: {
    color: "success",
    variant: "dot",
    ping: true,
    children: (
      <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
        <Text className="text-xs">Ping</Text>
      </Box>
    ),
  },
};

/**
 * Badge visibility toggle
 */
export const Visibility: Story = {
  render: () => (
    <Flex gap="lg">
      <Box className="relative w-12 h-12">
        <Badge content="5" visible={true} color="primary">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">Visible</Text>
          </Box>
        </Badge>
      </Box>
      <Box className="relative w-12 h-12">
        <Badge content="5" visible={false} color="error">
          <Box className="w-12 h-12 bg-surface-base rounded-lg flex items-center justify-center">
            <Text className="text-xs">Hidden</Text>
          </Box>
        </Badge>
      </Box>
    </Flex>
  ),
};

/**
 * Interactive badge with controls
 */
export const Interactive: Story = {
  args: {
    content: "5",
    color: "warning",
    variant: "standard",
    size: "medium",
    shape: "rounded",
    position: "top-right",
    ping: false,
    visible: true,
  },
  render: (args) => (
    <Box className="relative w-20 h-20">
      <Badge {...args}>
        <Box className="w-20 h-20 bg-bg-success rounded-xl flex items-center justify-center border border-primary-200">
          <Text className="text-sm font-semibold">Content</Text>
        </Box>
      </Badge>
    </Box>
  ),
};

/**
 * Badge on notification bell icon
 */
export const NotificationExample: Story = {
  render: () => (
    <Box className="relative w-10 h-10">
      <Badge content="3" color="error" position="top-right">
        <Box className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
          🔔
        </Box>
      </Badge>
    </Box>
  ),
};

/**
 * Badge with status indicator
 */
export const StatusIndicator: Story = {
  render: () => (
    <Box className="relative w-16 h-16">
      <Badge content="" variant="dot" color="success" position="bottom-right">
        <Box className="w-16 h-16 bg-linear-to-br from-gray-200 to-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
          <Text className="text-2xl">👤</Text>
        </Box>
      </Badge>
    </Box>
  ),
};
