import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Flex } from "../Flex";
import { Text } from "../Text";
import { useState } from "react";
import { Box } from "../Box";
import { Divider } from "../Divider";

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => <Spinner />,
};

export const AllSizes: Story = {
  render: () => (
    <Flex gap={5} align="center" className="h-40">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </Flex>
  ),
};

export const AllColors: Story = {
  render: () => (
    <Flex gap={4} wrap="wrap" align="start" className="h-full">
      {sizes.map((size) => (
        <Flex
          key={size}
          direction="column"
          gap={3}
          align="center"
          justify="center"
          className="h-full"
        >
          <Spinner size={size} color="default" />
          <Spinner size={size} color="muted" />
          <Spinner size={size} color="primary" />
          <Spinner size={size} color="secondary" />
          <Spinner size={size} color="success" />
          <Spinner size={size} color="error" />
          <Spinner size={size} color="warning" />
          <Spinner size={size} color="info" />
        </Flex>
      ))}
    </Flex>
  ),
};

export const Visibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <Flex direction="column" gap={3} align="start">
        <button
          onClick={() => setVisible(!visible)}
          className="px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 cursor-pointer"
        >
          Toggle Spinner
        </button>
        {visible && <Spinner color="primary" />}
      </Flex>
    );
  },
};

export const WithCustomAriaLabel: Story = {
  render: () => (
    <Flex gap={4} direction="column" align="start">
      <Box>
        <Text>Default label "Loading"</Text>
        <Spinner />
      </Box>
      <Box>
        <Text>Custom label "Processing data"</Text>
        <Spinner ariaLabel="Processing data" />
      </Box>
      <Box>
        <Text>Custom label "Saving"</Text>
        <Spinner ariaLabel="Saving" />
      </Box>
    </Flex>
  ),
};

export const PolymorphicElement: Story = {
  render: () => (
    <Flex gap={4} direction="column" align="start">
      <Box>
        <Text>As div (default)</Text>
        <Spinner />
      </Box>
      <Box>
        <Text>As span</Text>
        <Spinner as="span" color="secondary" />
      </Box>
    </Flex>
  ),
};

export const SizeAndColorCombinations: Story = {
  render: () => (
    <Flex gap={4} wrap="wrap">
      <Spinner size="sm" color="primary" />
      <Spinner size="md" color="secondary" />
      <Spinner size="lg" color="success" />
      <Spinner size="md" color="error" />
      <Spinner size="lg" color="warning" />
      <Spinner size="md" color="info" />
      <Spinner size="sm" color="muted" />
      <Spinner size="xl" color="primary" />
    </Flex>
  ),
};

export const WithSpacing: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Box>
        <Text>Spinner with margin</Text>
        <Box className="border border-border-base w-max">
          <Spinner color="primary" m={3} />
        </Box>
      </Box>
      <Divider />
      <Box>
        <Text>Spinner with horizontal margin</Text>
        <Box className="border border-border-base w-max">
          <Spinner color="secondary" mx={3} />
        </Box>
      </Box>
      <Divider />
      <Box>
        <Text>Spinner with vertical margin</Text>
        <Box className="border border-border-base w-max">
          <Spinner color="success" my={3} />
        </Box>
      </Box>
      <Divider />
    </Flex>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Text size="sm" weight="normal">
        Small spinner inline with text
      </Text>
      <Flex gap={2} align="center">
        <Spinner size="sm" color="primary" />
        <Text as="span">Loading data...</Text>
      </Flex>

      <Text size="sm" weight="normal" mt={4}>
        Medium spinner with larger text
      </Text>
      <Flex gap={3} align="center">
        <Spinner size="md" color="secondary" />
        <Text as="span" size="lg">
          Processing your request...
        </Text>
      </Flex>
    </Flex>
  ),
};
