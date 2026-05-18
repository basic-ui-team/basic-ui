import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof Text>;

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text size="xs">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
      <Text size="sm">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
      <Text size="md">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Default)
      </Text>
      <Text size="lg">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
      <Text size="xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
      <Text size="2xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
      <Text size="3xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </Text>
    </div>
  ),
};

export const WeightVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text weight="normal">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Default)
      </Text>
      <Text weight="medium">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Medium)
      </Text>
      <Text weight="semibold">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Semibold)
      </Text>
      <Text weight="bold">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Bold)
      </Text>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text color="default">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Default)
      </Text>
      <Text color="muted">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Muted)
      </Text>
      <Text color="primary">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Primary)
      </Text>
      <Text color="secondary">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Secondary)
      </Text>
      <Text color="error">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Error)
      </Text>
      <Text color="success">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Success)
      </Text>
      <Text color="warning">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Warning)
      </Text>
      <Text color="info">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Info)
      </Text>
      <Text color="text-red-500">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Custom Tailwind Color)
      </Text>
    </div>
  ),
};

export const AlignmentVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text align="left">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Left Aligned)
      </Text>
      <Text align="center">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Center Aligned)
      </Text>
      <Text align="right">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Right Aligned)
      </Text>
    </div>
  ),
};

export const TruncateVariant: Story = {
  render: () => (
    <div className="w-64 border p-2 border-gray-300 rounded">
      <Text truncate>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Truncated)
      </Text>
    </div>
  ),
};

export const WrapVariants: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-md">
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Text wrap="nowrap">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (No Wrap)
        </Text>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Text wrap="wrap">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Wrap)
        </Text>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Text wrap="balance">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Balance)
        </Text>
      </div>
      <div className="w-128 border p-2 border-gray-300 rounded">
        <Text wrap="pretty">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Pretty)
        </Text>
      </div>
    </div>
  ),
};

export const PolymorphicVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text as="span">
        This is a <strong>span</strong> element. (Note: alignment variants won't apply to span since
        text-align doesn't affect inline elements)
      </Text>
      <Text as="p">
        This is a <strong>paragraph</strong> element. (Default)
      </Text>
      <Text as="div">
        This is a <strong>div</strong> element.
      </Text>
    </div>
  ),
};

export const CombinedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-md">
      <Text size="lg" weight="bold" color="primary" align="center" wrap="balance">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. (Combined Variants)
      </Text>
    </div>
  ),
};

export const ComposedExample: Story = {
  render: () => (
    <div className="flex flex-col gap-md w-full">
      <Text wrap="pretty">
        Welcome to the Basic UI Component Library 🎉. This body of text can have a variety of
        different inline styles applied such as <strong>bold text</strong>. Maybe we can have some{" "}
        <em>italic text</em> as well. We can even have{" "}
        <span className="underline text-primary-500">underlined text</span> or text with a{" "}
        <span className="text-gradient bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          gradient color
        </span>
        . The Text component is designed to be flexible and composable, allowing you to create
        complex text styles by combining different variants and custom classes.
      </Text>
    </div>
  ),
};
