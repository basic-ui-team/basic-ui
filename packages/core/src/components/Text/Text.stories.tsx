import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text";
import { Flex } from "../Flex";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;
export default meta;

type Story = StoryObj<typeof Text>;

export const ResponsiveLayout: Story = {
  render: () => (
    <div className="max-w-lg">
      <Text
        size={{ base: "sm", md: "md", lg: "lg" }}
        align={{ base: "left", lg: "center" }}
        truncate={{ base: true, md: false }}
        wrap="pretty"
      >
        Text that truncates on narrow screens and restores wrapping on wider screens.
      </Text>
    </div>
  ),
};

export const SizeVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text size="xs">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
      <Text size="sm">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
      <Text size="md">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Default)
      </Text>
      <Text size="lg">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
      <Text size="xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
      <Text size="2xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
      <Text size="3xl">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua."
      </Text>
    </div>
  ),
};

export const WeightVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text weight="normal">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Default)
      </Text>
      <Text weight="medium">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Medium)
      </Text>
      <Text weight="semibold">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Semibold)
      </Text>
      <Text weight="bold">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Bold)
      </Text>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Text color="default">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Default)
      </Text>
      <Text color="muted">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Muted)
      </Text>
      <Text color="primary">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Primary)
      </Text>
      <Text color="secondary">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Secondary)
      </Text>
      <Text color="red">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Red)
      </Text>
      <Text color="green">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Green)
      </Text>
      <Text color="amber">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Amber)
      </Text>
      <Text color="sky">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Sky)
      </Text>
      <Text color="rose">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Rose)
      </Text>
    </div>
  ),
};

export const AlignmentVariants: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Text align="left">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Left Aligned)
      </Text>
      <Text align="center">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Center Aligned)
      </Text>
      <Text align="right">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Right Aligned)
      </Text>
    </Flex>
  ),
};

export const TruncateVariant: Story = {
  render: () => (
    <div className="w-64 border p-2 border-gray-300 rounded">
      <Text truncate>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Truncated)
      </Text>
    </div>
  ),
};

export const WrapVariants: Story = {
  render: () => (
    <Flex direction="column" align="center" gap={3}>
      <div className="w-lg border p-2 border-gray-300 rounded">
        <Text wrap="nowrap">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (No Wrap)
        </Text>
      </div>
      <div className="w-lg border p-2 border-gray-300 rounded">
        <Text wrap="wrap">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Wrap)
        </Text>
      </div>
      <div className="w-lg border p-2 border-gray-300 rounded">
        <Text wrap="balance">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Balance)
        </Text>
      </div>
      <div className="w-lg border p-2 border-gray-300 rounded">
        <Text wrap="pretty">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum." (Pretty)
        </Text>
      </div>
    </Flex>
  ),
};

export const PolymorphicVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
    <div className="flex flex-col gap-3">
      <Text size="lg" weight="bold" color="primary" align="center" wrap="balance">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua." (Combined Variants)
      </Text>
    </div>
  ),
};

export const ComposedExample: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-full">
      <Text wrap="pretty">
        Welcome to the Basic UI Component Library 🎉. This body of text can have a variety of
        different inline styles applied such as <strong>bold text</strong>. Maybe we can have some{" "}
        <em>italic text</em> as well. We can even have{" "}
        <span className="underline text-primary-500">underlined text</span> or text with a{" "}
        <span className="text-gradient bg-linear-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          gradient color
        </span>
        . The Text component is designed to be flexible and composable, allowing you to create
        complex text styles by combining different variants and custom classes.
      </Text>
    </div>
  ),
};
