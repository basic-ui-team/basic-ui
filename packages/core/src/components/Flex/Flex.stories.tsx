import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "./Flex";
import { Text } from "../Text/Text";
import { Card } from "../Card";
import { Header } from "../Header";

const meta: Meta<typeof Flex> = {
  title: "Components/Flex",
  component: Flex,
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;
export default meta;

type Story = StoryObj<typeof Flex>;

const PlaceholderItem = ({ label = "Item", className }: { label?: string; className?: string }) => (
  <Card variant="outlined" className={className}>
    <Card.Header>
      <Card.Title>{label}</Card.Title>
    </Card.Header>
  </Card>
);

export const Row: Story = {
  render: () => (
    <Flex align="center" className="gap-3 w-full">
      <PlaceholderItem label="Column 1" />
      <PlaceholderItem label="Column 2" />
      <PlaceholderItem label="Column 3" />
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" className="gap-3">
      <PlaceholderItem label="Row 1" />
      <PlaceholderItem label="Row 2" />
      <PlaceholderItem label="Row 3" />
    </Flex>
  ),
};

export const GapAndPadding: Story = {
  render: () => (
    <Flex direction="column" className="w-full gap-3">
      <Flex className="gap-2 p-2">
        <PlaceholderItem label="Small gap 1 and padding" className="flex-1" />
        <PlaceholderItem label="Small gap 2 and padding" className="flex-1" />
      </Flex>

      <Flex className="gap-4 p-4">
        <PlaceholderItem label="Large gap 1 and padding" className="flex-1" />
        <PlaceholderItem label="Large gap 2 and padding" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <Flex align="center" className="gap-3">
      <Text as="span" size="2xl">
        This is some text with an inline flex container:
      </Text>
      <Flex className="inline-flex gap-2 p-2">
        <PlaceholderItem label="Inline 1" className="flex-1" />
        <PlaceholderItem label="Inline 2" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Flex direction="column" className="gap-2">
      <Header size="h4">Polymorphic example</Header>
      <Text as="span" size="lg">
        This is a nav element using Flex with polymorphic "as" prop:
      </Text>
      <Flex as="nav" className="gap-3" aria-label="Main navigation">
        <Text as="span" className="border border-transparent border-b-border-base">
          <a href="#">Home</a>
        </Text>
        <Text as="span" className="border border-transparent border-b-border-base">
          <a href="#">Docs</a>
        </Text>
      </Flex>
    </Flex>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Flex direction="column" className="w-full gap-3">
      <Header size="h4">Responsive example</Header>
      <Text as="span" size="md">
        Resize the preview viewport to see layout change
      </Text>
      <Flex direction={{ base: "column", md: "row" }} className="gap-2 md:gap-3">
        <PlaceholderItem label="1" className="flex-1" />
        <PlaceholderItem label="2" className="flex-1" />
        <PlaceholderItem label="3" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const Align: Story = {
  render: () => (
    <Flex direction="column" className="gap-3">
      <Header size="h4">Align variants</Header>
      <Flex align="start" className="gap-3 border border-border-base p-2">
        <Text className="border p-2 h-8">Start A</Text>
        <Text className="border p-2 h-16">Start B (tall)</Text>
        <Text className="border p-2 h-12">Start C</Text>
      </Flex>

      <Flex align="center" className="gap-3 border border-border-base p-2">
        <Text className="border p-2 h-8">Center A</Text>
        <Text className="border p-2 h-16">Center B (tall)</Text>
        <Text className="border p-2 h-12">Center C</Text>
      </Flex>

      <Flex align="end" className="gap-3 border border-border-base p-2">
        <Text className="border p-2 h-8">End A</Text>
        <Text className="border p-2 h-16">End B (tall)</Text>
        <Text className="border p-2 h-12">End C</Text>
      </Flex>

      <Flex align="stretch" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Stretch A</Text>
        <Text className="border p-2">Stretch B</Text>
        <Text className="border p-2">Stretch C</Text>
      </Flex>
    </Flex>
  ),
};

export const Justify: Story = {
  render: () => (
    <Flex direction="column" className="gap-3">
      <Header size="h4">Justify variants</Header>

      <Flex justify="start" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Start 1</Text>
        <Text className="border p-2">Start 2</Text>
        <Text className="border p-2">Start 3</Text>
      </Flex>

      <Flex justify="center" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Center 1</Text>
        <Text className="border p-2">Center 2</Text>
        <Text className="border p-2">Center 3</Text>
      </Flex>

      <Flex justify="end" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">End 1</Text>
        <Text className="border p-2">End 2</Text>
        <Text className="border p-2">End 3</Text>
      </Flex>

      <Flex justify="between" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Between 1</Text>
        <Text className="border p-2">Between 2</Text>
        <Text className="border p-2">Between 3</Text>
      </Flex>

      <Flex justify="around" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Around 1</Text>
        <Text className="border p-2">Around 2</Text>
        <Text className="border p-2">Around 3</Text>
      </Flex>

      <Flex justify="evenly" className="gap-3 border border-border-base p-2">
        <Text className="border p-2">Evenly 1</Text>
        <Text className="border p-2">Evenly 2</Text>
        <Text className="border p-2">Evenly 3</Text>
      </Flex>
    </Flex>
  ),
};
