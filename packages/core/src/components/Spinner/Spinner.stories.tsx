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
    <Flex align="center" className="gap-5 h-40">
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
    <Flex direction="column" wrap="wrap" align="start" className="gap-4 h-full">
      {(["default", "muted"] as const).map((color) => (
        <Flex direction="row" className="gap-6" align="center" key={color}>
          {sizes.map((size) => (
            <Spinner key={size} size={size} color={color} />
          ))}
          <Text color={color === "muted" ? "muted" : "default"}>{color}</Text>
        </Flex>
      ))}
    </Flex>
  ),
};

export const Visibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    return (
      <Flex direction="column" className="gap-3" align="start">
        <button
          onClick={() => setVisible(!visible)}
          className="px-3 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 cursor-pointer"
        >
          Toggle Spinner
        </button>
        {visible && <Spinner />}
      </Flex>
    );
  },
};

export const WithCustomAriaLabel: Story = {
  render: () => (
    <Flex className="gap-4" direction="column" align="start">
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
    <Flex className="gap-4" direction="column" align="start">
      <Box>
        <Text>As div (default)</Text>
        <Spinner />
      </Box>
      <Box>
        <Text>As span</Text>
        <Spinner as="span" />
      </Box>
    </Flex>
  ),
};

export const SizeAndColorCombinations: Story = {
  render: () => (
    <Flex className="gap-4" wrap="wrap">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="md" />
      <Spinner size="sm" />
      <Spinner size="xl" />
    </Flex>
  ),
};

export const WithSpacing: Story = {
  render: () => (
    <Flex direction="column" className="gap-3">
      <Box>
        <Text>Spinner with margin</Text>
        <Box className="border border-border w-max">
          <Spinner className="m-3" />
        </Box>
      </Box>
      <Divider />
      <Box>
        <Text>Spinner with horizontal margin</Text>
        <Box className="border border-border w-max">
          <Spinner className="mx-3" />
        </Box>
      </Box>
      <Divider />
      <Box>
        <Text>Spinner with vertical margin</Text>
        <Box className="border border-border w-max">
          <Spinner className="my-3" />
        </Box>
      </Box>
      <Divider />
    </Flex>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <Flex direction="column" className="gap-3">
      <Text size="sm" weight="normal">
        Small spinner inline with text
      </Text>
      <Flex className="gap-2" align="center">
        <Spinner size="sm" />
        <Text as="span">Loading data...</Text>
      </Flex>

      <Text size="sm" weight="normal" className="mt-4">
        Medium spinner with larger text
      </Text>
      <Flex className="gap-3" align="center">
        <Spinner size="md" />
        <Text as="span" size="lg">
          Processing your request...
        </Text>
      </Flex>
    </Flex>
  ),
};
