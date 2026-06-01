import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Flex } from "../Flex";
import { useState } from "react";

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
    <Flex gap="xl" align="center" className="h-40">
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
    <Flex gap="lg" wrap="wrap" align="start" className="h-full">
        {sizes.map((size) => (
          <Flex key={size} direction="column" gap="md" align="center" justify="center" className="h-full">
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
      <Flex direction="column" gap="md" align="start">
        <button
          onClick={() => setVisible(!visible)}
          className="px-md py-sm bg-primary-500 text-white rounded hover:bg-primary-600 cursor-pointer"
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
    <Flex gap="lg" direction="column" align="start">
      <div>
        <div className="text-sm font-medium mb-sm">Default label "Loading"</div>
        <Spinner />
      </div>
      <div>
        <div className="text-sm font-medium mb-sm">Custom label "Processing data"</div>
        <Spinner ariaLabel="Processing data" />
      </div>
      <div>
        <div className="text-sm font-medium mb-sm">Custom label "Saving"</div>
        <Spinner ariaLabel="Saving" />
      </div>
    </Flex>
  ),
};

export const PolymorphicElement: Story = {
  render: () => (
    <Flex gap="lg" direction="column" align="start">
      <div>
        <div className="text-sm font-medium mb-sm">As div (default)</div>
        <Spinner />
      </div>
      <div>
        <div className="text-sm font-medium mb-sm">As span</div>
        <Spinner as="span" color="secondary" />
      </div>
    </Flex>
  ),
};

export const SizeAndColorCombinations: Story = {
  render: () => (
    <Flex gap="lg" wrap="wrap" >
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
    <Flex direction="column" gap="md">
      <div>
        <div className="text-sm font-medium mb-sm">With margin bottom</div>
        <Spinner color="primary" mb="lg" />
        <div className="bg-gray-100 p-md">Content below spinner</div>
      </div>
      <div>
        <div className="text-sm font-medium mb-sm">With margin</div>
        <Spinner color="secondary" m="lg" />
      </div>
    </Flex>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <div className="text-sm font-medium">Small spinner inline with text</div>
      <Flex gap="sm" align="center">
        <Spinner size="sm" color="primary" />
        <span>Loading data...</span>
      </Flex>

      <div className="text-sm font-medium mt-lg">Medium spinner with larger text</div>
      <Flex gap="md" align="center">
        <Spinner size="md" color="secondary" />
        <span className="text-lg">Processing your request...</span>
      </Flex>
    </Flex>
  ),
};
