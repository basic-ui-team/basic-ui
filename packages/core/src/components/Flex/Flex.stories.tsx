import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "./Flex";

const meta: Meta<typeof Flex> = {
  title: "Components/Flex",
  component: Flex,
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;
export default meta;

type Story = StoryObj<typeof Flex>;

export const Row: Story = {
  render: () => (
    <Flex gap="md" align="center">
      <div className="p-sm border">Item 1</div>
      <div className="p-sm border">Item 2</div>
      <div className="p-sm border">Item 3</div>
    </Flex>
  ),
};

export const Column: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <div className="p-sm border">Row 1</div>
      <div className="p-sm border">Row 2</div>
      <div className="p-sm border">Row 3</div>
    </Flex>
  ),
};

export const GapAndPadding: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Flex gap="sm" padding="sm">
        <div className="border p-sm">A</div>
        <div className="border p-sm">B</div>
      </Flex>

      <Flex gap="lg" padding="lg">
        <div className="border p-sm">A</div>
        <div className="border p-sm">B</div>
      </Flex>

      <Flex gap="gap-8" padding="p-4">
        <div className="border p-sm">A</div>
        <div className="border p-sm">B</div>
      </Flex>
    </div>
  ),
};

export const InlineExample: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <span>Label:</span>
      <Flex inline gap="sm">
        <div className="border p-sm">Inline 1</div>
        <div className="border p-sm">Inline 2</div>
      </Flex>
    </div>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Flex as="nav" gap="md" aria-label="Main navigation">
        <a href="#">Home</a>
        <a href="#">Docs</a>
      </Flex>
    </div>
  ),
};

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <p className="text-sm">Resize the preview viewport to see layout change</p>
      <Flex direction={{ base: "column", md: "row" }} gap={{ base: "sm", md: "md" }}>
        <div className="border p-sm">A</div>
        <div className="border p-sm">B</div>
        <div className="border p-sm">C</div>
      </Flex>
    </div>
  ),
};

export const Align: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div className="text-sm">Align variants</div>
      <Flex align="start" gap="md" className="border p-sm">
        <div className="border p-sm h-8">Start A</div>
        <div className="border p-sm h-16">Start B (tall)</div>
        <div className="border p-sm h-12">Start C</div>
      </Flex>

      <Flex align="center" gap="md" className="border p-sm">
        <div className="border p-sm h-8">Center A</div>
        <div className="border p-sm h-16">Center B (tall)</div>
        <div className="border p-sm h-12">Center C</div>
      </Flex>

      <Flex align="end" gap="md" className="border p-sm">
        <div className="border p-sm h-8">End A</div>
        <div className="border p-sm h-16">End B (tall)</div>
        <div className="border p-sm h-12">End C</div>
      </Flex>

      <Flex align="stretch" gap="md" className="border p-sm">
        <div className="border p-sm">Stretch A</div>
        <div className="border p-sm">Stretch B</div>
        <div className="border p-sm">Stretch C</div>
      </Flex>

      <Flex align="baseline" gap="md" className="border p-sm">
        <div className="border p-sm text-xs">Baseline A</div>
        <div className="border p-sm text-lg">Baseline B</div>
        <div className="border p-sm">Baseline C</div>
      </Flex>
    </div>
  ),
};

export const Justify: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <div className="text-sm">Justify variants</div>

      <Flex justify="start" gap="md" className="border p-sm">
        <div className="border p-sm">Start 1</div>
        <div className="border p-sm">Start 2</div>
        <div className="border p-sm">Start 3</div>
      </Flex>

      <Flex justify="center" gap="md" className="border p-sm">
        <div className="border p-sm">Center 1</div>
        <div className="border p-sm">Center 2</div>
        <div className="border p-sm">Center 3</div>
      </Flex>

      <Flex justify="end" gap="md" className="border p-sm">
        <div className="border p-sm">End 1</div>
        <div className="border p-sm">End 2</div>
        <div className="border p-sm">End 3</div>
      </Flex>

      <Flex justify="between" gap="md" className="border p-sm">
        <div className="border p-sm">Between 1</div>
        <div className="border p-sm">Between 2</div>
        <div className="border p-sm">Between 3</div>
      </Flex>

      <Flex justify="around" gap="md" className="border p-sm">
        <div className="border p-sm">Around 1</div>
        <div className="border p-sm">Around 2</div>
        <div className="border p-sm">Around 3</div>
      </Flex>

      <Flex justify="evenly" gap="md" className="border p-sm">
        <div className="border p-sm">Evenly 1</div>
        <div className="border p-sm">Evenly 2</div>
        <div className="border p-sm">Evenly 3</div>
      </Flex>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    gap: "md",
    padding: "sm",
    direction: "row",
    children: (
      <>
        <div className="border p-sm">1</div>
        <div className="border p-sm">2</div>
        <div className="border p-sm">3</div>
      </>
    ),
  },
  render: (args) => <Flex {...args}>{args.children}</Flex>,
};
