import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "./Flex";
import { Text } from "../Text/Text";

const meta: Meta<typeof Flex> = {
  title: "Components/Flex",
  component: Flex,
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;
export default meta;

type Story = StoryObj<typeof Flex>;

export const Row: Story = {
  render: () => (
    <Flex gap="md" align="center" className="w-full ">
      <Text as="span" className="border p-sm rounded">
        Column 1
      </Text>
      <Text as="span" className="border p-sm rounded">
        Column 2
      </Text>
      <Text as="span" className="border p-sm rounded">
        Column 3
      </Text>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Text as="span" className="border p-sm rounded">
        Row 1
      </Text>
      <Text as="span" className="border p-sm rounded">
        Row 2
      </Text>
      <Text as="span" className="border p-sm rounded">
        Row 3
      </Text>
    </Flex>
  ),
};

export const GapAndPadding: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Flex gap="sm" layout={{ padding: "sm" }}>
        <Text as="span" className="border p-sm rounded flex-1">
          Small gap
        </Text>
        <Text as="span" className="border p-sm rounded flex-1">
          Small gap
        </Text>
      </Flex>

      <Flex gap="lg" layout={{ padding: "lg" }}>
        <Text as="span" className="border p-sm rounded flex-1">
          Large gap
        </Text>
        <Text as="span" className="border p-sm rounded flex-1">
          Large gap
        </Text>
      </Flex>
    </div>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Text as="span" size="2xl">
        This is some text with an inline flex container:
      </Text>
      <Flex inline gap="sm" layout={{ padding: "sm" }}>
        <Text as="span" className="border p-sm rounded">
          Inline 1
        </Text>
        <Text as="span" className="border p-sm rounded">
          Inline 2
        </Text>
      </Flex>
    </div>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <div className="flex flex-col gap-sm">
      <Text as="span" size="lg">
        This is a nav element using Flex with polymorphic "as" prop:
      </Text>
      <Flex as="nav" gap="md" aria-label="Main navigation">
        <Text as="span"><a href="#">Home</a></Text>
        <Text as="span"><a href="#">Docs</a></Text>
      </Flex>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-md w-full">
      <Text as="span" size="md">Resize the preview viewport to see layout change</Text>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: "sm", md: "md" }}>
        <Text className="border rounded p-sm flex-1">A</Text>
        <Text className="border rounded p-sm flex-1">B</Text>
        <Text className="border rounded p-sm flex-1">C</Text>
      </Flex>
    </div>
  ),
};

export const Align: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text>Align variants</Text>
      <Flex align="start" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm h-8">Start A</Text>
        <Text className="border p-sm h-16">Start B (tall)</Text>
        <Text className="border p-sm h-12">Start C</Text>
      </Flex>

      <Flex align="center" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm h-8">Center A</Text>
        <Text className="border p-sm h-16">Center B (tall)</Text>
        <Text className="border p-sm h-12">Center C</Text>
      </Flex>

      <Flex align="end" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm h-8">End A</Text>
        <Text className="border p-sm h-16">End B (tall)</Text>
        <Text className="border p-sm h-12">End C</Text>
      </Flex>

      <Flex align="stretch" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Stretch A</Text>
        <Text className="border p-sm">Stretch B</Text>
        <Text className="border p-sm">Stretch C</Text>
      </Flex>
    </div>
  ),
};

export const Justify: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text>Justify variants</Text>

      <Flex justify="start" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Start 1</Text>
        <Text className="border p-sm">Start 2</Text>
        <Text className="border p-sm">Start 3</Text>
      </Flex>

      <Flex justify="center" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Center 1</Text>
        <Text className="border p-sm">Center 2</Text>
        <Text className="border p-sm">Center 3</Text>
      </Flex>

      <Flex justify="end" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">End 1</Text>
        <Text className="border p-sm">End 2</Text>
        <Text className="border p-sm">End 3</Text>
      </Flex>

      <Flex justify="between" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Between 1</Text>
        <Text className="border p-sm">Between 2</Text>
        <Text className="border p-sm">Between 3</Text>
      </Flex>

      <Flex justify="around" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Around 1</Text>
        <Text className="border p-sm">Around 2</Text>
        <Text className="border p-sm">Around 3</Text>
      </Flex>

      <Flex justify="evenly" gap="md" className="border border-border-base p-sm">
        <Text className="border p-sm">Evenly 1</Text>
        <Text className="border p-sm">Evenly 2</Text>
        <Text className="border p-sm">Evenly 3</Text>
      </Flex>
    </div>
  ),
};
