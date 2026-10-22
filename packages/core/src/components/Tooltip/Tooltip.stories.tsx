import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpCircleIcon } from "@basic-ui/icons";
import { Tooltip } from "./Tooltip";
import { Box } from "../Box";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Icon } from "../Icon";
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
    children: <Button>Hover or focus me</Button>,
  },
};

export const Delayed: Story = {
  args: {
    label: "This tooltip waits 800ms before appearing",
    delay: 800,
    closeDelay: 400,
    children: <Button>Delayed tooltip</Button>,
  },
};

export const WithDisabledTrigger: Story = {
  args: {
    label: "You will never see this",
    disabled: true,
    children: <Button disabled>Disabled trigger</Button>,
  },
};

export const Sides: Story = {
  render: () => (
    <Flex direction="column" className="gap-5 mt-6">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Flex key={side} className="gap-4" justify="evenly" align="center">
          {(["start", "center", "end"] as const).map((align) => (
            <Tooltip
              key={`${side}-${align}`}
              label={`Tip`}
              side={side}
              align={align}
            >
              <Button>
                {side} / {align}
              </Button>
            </Tooltip>
          ))}
        </Flex>
      ))}
    </Flex>
  ),
};

export const AccessibleTrigger: Story = {
  render: () => (
    <Box className="flex justify-center">
      <Tooltip label="Save your changes to the server">
        <Button>Save</Button>
      </Tooltip>
    </Box>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Tooltip label="More information about this feature">
      <Button aria-label="More information" variant="ghost">
        <Icon icon={<HelpCircleIcon />} size="lg" />
      </Button>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  args: {
    label:
      "A longer tooltip message that wraps across multiple lines because tooltips should remain readable at a comfortable measure.",
    children: <Button>Long message</Button>,
  },
};

export const TextTrigger: Story = {
  render: () => (
    <Text>
      Hover over this{" "}
      <Tooltip label="Inline text triggers work too">
        <span className="underline decoration-dotted cursor-help">dotted term</span>
      </Tooltip>{" "}
      for a definition.
    </Text>
  ),
};
