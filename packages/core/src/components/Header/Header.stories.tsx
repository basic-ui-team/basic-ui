import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;
export default meta;

type Story = StoryObj<typeof Header>;

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header size="h1">Heading H1</Header>
      <Header size="h2">Heading H2</Header>
      <Header size="h3">Heading H3</Header>
      <Header size="h4">Heading H4</Header>
      <Header size="h5">Heading H5</Header>
      <Header size="h6">Heading H6</Header>
    </div>
  ),
};

export const WeightVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header weight="normal">Normal weight</Header>
      <Header weight="medium">Medium weight</Header>
      <Header weight="semibold">Semibold weight</Header>
      <Header weight="bold">Bold weight</Header>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header color="default">Default color</Header>
      <Header color="primary">Primary color</Header>
      <Header color="secondary">Secondary color</Header>
      <Header color="text-red-500">Custom tailwind color</Header>
    </div>
  ),
};

export const AlignmentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header align="left">Left aligned</Header>
      <Header align="center">Center aligned</Header>
      <Header align="right">Right aligned</Header>
    </div>
  ),
};

export const TruncateVariant: Story = {
  render: () => (
    <div className="w-64 border p-2 border-gray-300 rounded">
      <Header truncate>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. (Truncated)
      </Header>
    </div>
  ),
};

export const WrapVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-md">
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Header wrap="nowrap">No wrap header example with long text that overflows.</Header>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Header wrap="wrap">Wrapped header example with long text that flows to new lines.</Header>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Header wrap="balance">Balanced header example with long text that is balanced.</Header>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Header wrap="pretty">Pretty-wrapped header example with long text for demo.</Header>
      </div>
    </div>
  ),
};

export const PolymorphicVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header as="h1">This is an H1 element (default)</Header>
      <Header as="h2">This is an H2 element</Header>
      <Header as="h3">This is an H3 element</Header>
      <Header as="h4">This is an H4 element</Header>
      <Header as="h5">This is an H5 element</Header>
      <Header as="h6">This is an H6 element</Header>
    </div>
  ),
};

export const CombinedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header size="h2" weight="bold" color="primary" align="center" wrap="balance">
        Combined header variants example
      </Header>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    as: "h2",
    size: "h2",
    weight: "normal",
    color: "default",
    align: "left",
    truncate: false,
    wrap: "nowrap",
    children: "Editable Header",
  },
  render: (args) => <Header {...args}>{args.children}</Header>,
  parameters: {
    docs: {
      description: {
        story:
          "Playground: interactive controls for `Header`. Note: when `truncate` is true and no `title` or `aria-label` is provided, the component will automatically add a `title` and `aria-label` with the header text for accessibility. Colors accept built-in tokens (`default`, `primary`, `secondary`) or custom classes like `text-red-500`.",
      },
    },
  },
};

export const Clickable: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Header as="h2">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="no-underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          Clickable header — link
        </a>
      </Header>

      <Header as="h3">
        <button
          onClick={() => {}}
          aria-expanded={false}
          aria-controls="panel"
          className="bg-transparent border-0 p-0 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          Clickable header — button (aria-expanded example)
        </button>
      </Header>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When making headers interactive, place a semantic interactive element (`<a>` or `<button>`) inside the heading and ensure a visible focus indicator plus appropriate ARIA (e.g., `aria-expanded`). Avoid making the heading the interactive element itself.',
      },
    },
  },
};
