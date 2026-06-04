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
    <Flex gap="md" align="center" className="w-full ">
      <PlaceholderItem label="Column 1" />
      <PlaceholderItem label="Column 2" />
      <PlaceholderItem label="Column 3" />
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <PlaceholderItem label="Row 1" />
      <PlaceholderItem label="Row 2" />
      <PlaceholderItem label="Row 3" />
    </Flex>
  ),
};

export const GapAndPadding: Story = {
  render: () => (
    <Flex direction="column" w="full" gap="md">
      <Flex gap="sm" p="sm">
        <PlaceholderItem label="Small gap 1 and padding" className="flex-1" />
        <PlaceholderItem label="Small gap 2 and padding" className="flex-1" />
      </Flex>

      <Flex gap="lg" p="lg">
        <PlaceholderItem label="Large gap 1 and padding" className="flex-1" />
        <PlaceholderItem label="Large gap 2 and padding" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <Flex align="center" gap="md">
      <Text as="span" size="2xl">
        This is some text with an inline flex container:
      </Text>
      <Flex display="inline-flex" gap="sm" p="sm">
        <PlaceholderItem label="Inline 1" className="flex-1" />
        <PlaceholderItem label="Inline 2" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Flex direction="column" gap="sm">
      <Header size="h4">Polymorphic example</Header>
      <Text as="span" size="lg">
        This is a nav element using Flex with polymorphic "as" prop:
      </Text>
      <Flex as="nav" gap="md" aria-label="Main navigation">
        <Text as="span" className="border border-transparent border-b-border-base">
          <a  href="#">Home</a>
        </Text>
        <Text as="span" className="border border-transparent border-b-border-base">
          <a  href="#">Docs</a>
        </Text>
      </Flex>
    </Flex>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Flex direction="column" w="full" gap="md">
      <Header size="h4">Responsive example</Header>
      <Text as="span" size="md">
        Resize the preview viewport to see layout change
      </Text>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: "sm", md: "md" }}>
        <PlaceholderItem label="1" className="flex-1" />
        <PlaceholderItem label="2" className="flex-1" />
        <PlaceholderItem label="3" className="flex-1" />
      </Flex>
    </Flex>
  ),
};

export const Align: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Header size="h4">Align variants</Header>
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
    </Flex>
  ),
};

export const Justify: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Header size="h4">Justify variants</Header>

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
    </Flex>
  ),
};
