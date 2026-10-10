import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { Box } from "../Box";
import { Flex } from "../Flex";
import { Text } from "../Text";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    color: {
      control: "select",
      options: ["default", "inverted", "primary", "success", "warning", "error", "info"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    bordered: { control: "boolean" },
    disabled: { control: "boolean" },
    delay: { control: "number" },
    closeDelay: { control: "number" },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    label: "A short helpful hint",
    children: <button>Hover or focus me</button>,
  },
};

export const Delayed: Story = {
  args: {
    label: "This tooltip waits 800ms before appearing",
    delay: 800,
    closeDelay: 400,
    children: <button>Delayed tooltip</button>,
  },
};

export const WithDisabledTrigger: Story = {
  args: {
    label: "You will never see this",
    disabled: true,
    children: <button disabled>Disabled trigger</button>,
  },
};

export const Sides: Story = {
  render: () => (
    <Flex direction="column" gap="lg" align="center">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side} label={`Tooltip on the ${side}`} side={side}>
          <button>{side}</button>
        </Tooltip>
      ))}
    </Flex>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex direction="column" gap="lg" align="start">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Tooltip key={size} label={`A ${size} tooltip`} size={size}>
          <button>{size}</button>
        </Tooltip>
      ))}
    </Flex>
  ),
};

export const Colors: Story = {
  render: () => (
    <Flex direction="column" gap="lg" align="start">
      {(["default", "inverted", "primary", "success", "warning", "error", "info"] as const).map(
        (color) => (
          <Tooltip key={color} label={`A ${color} tooltip`} color={color} bordered>
            <button>{color}</button>
          </Tooltip>
        ),
      )}
    </Flex>
  ),
};

export const AccessibleTrigger: Story = {
  render: () => (
    <Box>
      <Tooltip label="Save your changes to the server">
        <button>Save</button>
      </Tooltip>
    </Box>
  ),
};

export const LongContent: Story = {
  args: {
    label:
      "A longer tooltip message that wraps across multiple lines because tooltips should remain readable at a comfortable measure.",
    size: "lg",
    children: <button>Long message</button>,
  },
};

export const TextTrigger: Story = {
  render: () => (
    <Text>
      Hover over this{" "}
      <Tooltip label="Inline text triggers work too" size="sm">
        <span className="underline decoration-dotted cursor-help">dotted term</span>
      </Tooltip>{" "}
      for a definition.
    </Text>
  ),
};
