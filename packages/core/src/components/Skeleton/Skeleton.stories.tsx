import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";
import { Flex } from "../Flex";
import { Box } from "../Box";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "rectangular", "circular"],
      description: "The skeleton variant to display",
    },
    animated: {
      control: "boolean",
      description: "Whether the skeleton should be animated",
    },
    w: {
      control: "text",
      description: "Width of the skeleton (e.g., 'full', 'auto')",
    },
    h: {
      control: "text",
      description: "Height of the skeleton (e.g., 'auto')",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: "text",
    animated: false,
  },
};

export const TextAnimated: Story = {
  args: {
    variant: "text",
    animated: true,
  },
};

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    animated: false,
  },
};

export const RectangularAnimated: Story = {
  args: {
    variant: "rectangular",
    animated: true,
  },
};

export const Circular: Story = {
  args: {
    variant: "circular",
    animated: false,
  },
};

export const CircularAnimated: Story = {
  args: {
    variant: "circular",
    animated: true,
  },
};

export const CustomSize: Story = {
  args: {
    variant: "rectangular",
    animated: false,
    className: "w-64 h-32",
  },
};

export const LargeCircular: Story = {
  args: {
    variant: "circular",
    animated: false,
    className: "w-20 h-20",
  },
};

export const FullWidth: Story = {
  args: {
    variant: "rectangular",
    animated: true,
    w: "full",
  },
};

export const LoadingList: Story = {
  render: () => (
    <Flex direction="column" gap="sm" className="w-80">
      <Skeleton variant="text" animated />
      <Skeleton variant="text" animated />
      <Box pt="sm">
        <Skeleton variant="rectangular" animated h="full" className="h-40 w-full" />
      </Box>
    </Flex>
  ),
};

export const UserCard: Story = {
  render: () => (
    <Box className="border border-border-base rounded-lg p-4 w-80">
      <Flex align="center" gap="sm" pb="sm" w="full">
        <Skeleton variant="circular" animated className="h-12 w-12" />
        <Flex direction="column" gap="sm" align="end" w="full">
          <Skeleton variant="text" animated w="full" className="w-48" />
          <Skeleton variant="text" animated w="full" className="w-24" />
        </Flex>
      </Flex>
      <Skeleton variant="rectangular" animated w="full" h="full" className="h-24" />
    </Box>
  ),
};
