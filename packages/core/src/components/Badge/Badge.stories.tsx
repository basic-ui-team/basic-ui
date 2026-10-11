import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Box } from "../Box";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Icon } from "../Icon";
import { BellIcon } from "@basic-ui/icons";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

const notificationButton = (
  <Button aria-label="Notifications" variant="outline">
    Notifications
  </Button>
);

export const NotificationCount: Story = {
  render: () => (
    <Badge content={3} color="error">
      {notificationButton}
    </Badge>
  ),
};

export const CountOverflow: Story = {
  render: () => (
    <Badge content={100} max={99} color="error">
      {notificationButton}
    </Badge>
  ),
};

export const StatusDot: Story = {
  render: () => (
    <Badge variant="dot" color="success" position="bottom-right">
      <Box className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-base">
        <Icon icon="A" size="sm" />
      </Box>
    </Badge>
  ),
};

export const PingingStatus: Story = {
  render: () => (
    <Badge variant="dot" color="success" position="bottom-right" ping>
      <Box className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-base">
        <Icon icon="A" size="sm" />
      </Box>
    </Badge>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <Flex gap={4}>
      {(["info", "success", "warning", "error"] as const).map((color) => (
        <Badge key={color} content={color.slice(0, 1).toUpperCase()} color={color}>
          <Box className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-base">
            <Icon icon={<BellIcon />} size="sm" />
          </Box>
        </Badge>
      ))}
    </Flex>
  ),
};

export const Positions: Story = {
  render: () => (
    <Flex justify="evenly" align="center" wrap="wrap">
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((position) => (
        <Badge key={position} content="3" color="info" position={position}>
          <Box className="flex p-4 items-center justify-center rounded-lg bg-surface-base text-md">
            {position.replace("-", " ")}
          </Box>
        </Badge>
      ))}
    </Flex>
  ),
};
