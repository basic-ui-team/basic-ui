import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";
import { Text } from "../Text";
import { Flex } from "../Flex";
import { Box } from "../Box";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  render: () => (
    <Box>
      <Text>Section above</Text>
      <Divider />
      <Text>Section below</Text>
    </Box>
  ),
};

export const AppearanceVariants: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Box p="md">
        <Text mb="md">Solid</Text>
        <Divider appearance="solid" />
      </Box>
      <Box p="md">
        <Text mb="md">Dashed</Text>
        <Divider appearance="dashed" />
      </Box>
      <Box p="md">
        <Text mb="md">Dotted</Text>
        <Divider appearance="dotted" />
      </Box>
    </Flex>
  ),
};

export const ThicknessVariants: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Divider thickness="thin" />
      <Divider thickness="medium" />
      <Divider thickness="thick" />
      <Divider thickness="none" />
    </Flex>
  ),
};

export const VerticalExample: Story = {
  render: () => (
    <Flex direction="row" align="center" gap="xl" className="h-40">
      <Flex direction="row" align="center" gap="md" className="h-40">
        <Text>Left</Text>
        <Divider direction="vertical" />
        <Text>Right</Text>
      </Flex>
      <Flex direction="row" align="center" gap="md" className="h-40">
        <Text>Left with Thick Muted</Text>
        <Divider direction="vertical" thickness="thick" color="muted" />
        <Text>Right with Thick Muted</Text>
      </Flex>
      <Flex direction="row" align="center" gap="md" className="h-40">
        <Text>Left with Dashed</Text>
        <Divider direction="vertical" thickness="thin" appearance="dashed" />
        <Text>Right with Dashed</Text>
      </Flex>
    </Flex>
  ),
};

export const Labeled: Story = {
  render: () => (
    <Flex direction="column" gap="md">
      <Text>Before</Text>
      <Divider label="Section" />
      <Text>After</Text>
    </Flex>
  ),
};

export const InsetExample: Story = {
  render: () => (
    <Box>
      <Text mb="md">Horizontal Insets</Text>
      <Flex direction="column" gap="md">
        <Divider inset="sm" />
        <Divider inset="md" />
        <Divider inset="lg" />
      </Flex>

      <Text mt="lg" mb="md">
        Vertical Insets
      </Text>
      <Flex direction="row" align="center" gap="xl" p="sm" className="border border-sm border-border-base h-40">
        <Text>Top</Text>
        <Divider direction="vertical" inset="sm" />
        <Text>Middle</Text>
        <Divider direction="vertical" inset="md" />
        <Text>Bottom</Text>
        <Divider direction="vertical" inset="lg" />
      </Flex>
    </Box>
  ),
};
