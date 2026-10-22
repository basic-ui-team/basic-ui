import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box";
import { Flex } from "../Flex/Flex";
import { Text } from "../Text/Text";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  tags: ["autodocs"],
} satisfies Meta<typeof Box>;
export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box className="rounded-lg border border-border-base bg-surface-base p-3 text-fg-base">
      <Text as="span">A transparent, polymorphic layout primitive.</Text>
    </Box>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <Box as="article" className="p-4 max-w-xl rounded-lg border border-border-base bg-surface-base">
      <Box as="header" className="mb-3">
        <Box as="h2" className="text-lg font-semibold">
          Release notes
        </Box>
        <Text as="p" color="muted">
          Box retains native semantics while supplying layout props.
        </Text>
      </Box>
      <Box as="section" aria-labelledby="changes-heading">
        <Box as="h3" id="changes-heading" className="font-semibold">
          Changes
        </Box>
        <Box as="ul" className="mt-2 pl-4 list-disc">
          <Box as="li">Use an element appropriate to the content.</Box>
          <Box as="li">Add layout without an extra wrapper.</Box>
        </Box>
      </Box>
    </Box>
  ),
};

export const Display: Story = {
  render: () => (
    <Box className="p-3 rounded-lg border border-border-base bg-surface-base">
      <Box className="block p-2 rounded bg-surface-hover">
        Block
      </Box>
      <Box className="inline-block mt-2 p-2 rounded bg-surface-hover">
        Inline-block
      </Box>
      <Box className="inline ml-2 p-2 rounded bg-surface-hover">
        Inline
      </Box>
    </Box>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Box className="p-3 rounded-lg border border-border-base bg-surface-base">
      <Box className="p-3 rounded bg-surface-hover">
        <Text as="span">p=3</Text>
      </Box>
      <Box className="mt-3 px-4 py-2 rounded bg-surface-hover">
        <Text as="span">mt=3, px=4, py=2</Text>
      </Box>
      <Box className="mt-3 pt-2 pr-4 pb-3 pl-1 rounded bg-surface-hover">
        <Text as="span">Independent side spacing</Text>
      </Box>
    </Box>
  ),
};

export const Sizing: Story = {
  render: () => (
    <Flex direction="column" className="gap-3 max-w-xl">
      <Box className="w-full p-3 rounded-lg border border-border-base bg-surface-base">
        <Text as="span">w=&quot;full&quot;</Text>
      </Box>
      <Box className="w-fit p-3 rounded-lg border border-border-base bg-surface-base">
        <Text as="span">w=&quot;fit&quot;</Text>
      </Box>
      <Box className="min-w-full p-3 rounded-lg border border-border-base bg-surface-base">
        <Text as="span">wMin=&quot;full&quot;</Text>
      </Box>
    </Flex>
  ),
};

export const PositionAndOverflow: Story = {
  render: () => (
    <Flex direction="column" className="gap-3 max-w-xl">
      <Box className="relative p-4 rounded-lg border border-border-base bg-surface-base">
        <Text as="span">A positioned ancestor</Text>
        <Box
          className="absolute right-2 top-2 rounded bg-sky-100 px-2 py-1 text-sky-800"
        >
          Pinned
        </Box>
      </Box>
      <Box className="overflow-x-auto p-3 rounded-lg border border-border-base bg-surface-base">
        <Box className="w-max whitespace-nowrap">
          Horizontal overflow remains scrollable when content exceeds its container.
        </Box>
      </Box>
    </Flex>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box
      className="block md:inline-block p-2 md:p-4 rounded-lg border border-border-base bg-surface-base"
    >
      <Text as="span">
        Resize the preview: this emits stable <code>p-2 md:p-4 block md:inline-block</code>{" "}
        classes for CSS to resolve.
      </Text>
    </Box>
  ),
};
