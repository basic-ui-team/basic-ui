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
