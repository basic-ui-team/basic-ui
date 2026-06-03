import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "./Box";
import { Text } from "../Text/Text";
import { Flex } from "../Flex/Flex";

const meta: Meta<typeof Box> = {
  title: "Components/Box",
  component: Box,
  tags: ["autodocs"],
} satisfies Meta<typeof Box>;
export default meta;

type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box className="border p-sm rounded">
      <Text as="span">This is a Box (div)</Text>
    </Box>
  ),
};

export const AsSpan: Story = {
  render: () => (
    <Flex direction="row" align="center" gap="md">
      <Text as="span">Inline with Box as span:</Text>
      <Box as="span" px="sm" className="border text-foreground-primary rounded">
        Inline Box
      </Box>
    </Flex>
  ),
};

export const DisplayVariants: Story = {
  render: () => (
    <Flex direction="column" gap="md" className="text-foreground-primary">
      <Box display="block" className="border p-sm">Block</Box>
      <Box display="inline-block" className="border p-sm">Inline-block</Box>
      <Box display="inline" className="border p-sm">Inline</Box>
    </Flex>
  ),
};

export const LayoutProps: Story = {
  render: () => (
    <Flex direction="column" gap="md" className="w-full text-foreground-primary">
      <Box p="md" m="sm" className="border rounded">Padding MD & Margin SM</Box>
      <Box px="lg" py="sm" className="border rounded">Padding X LG, Y SM</Box>
      <Box mt="lg" ml="sm" mr="xl" mb="xs" className="border rounded">Margin Top LG, Left SM, Right XL, Bottom XS</Box>
      <Box pt="lg" pl="sm" pr="xl" pb="xs" className="border rounded">Padding Top LG, Left SM, Right XL, Bottom XS</Box>
    </Flex>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Box as="section" aria-label="Example section" className="border border-border-base p-sm rounded">
      <Text as="span">Section using Box as="section"</Text>
    </Box>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box display={{ base: "inline", md: "block" }} p={{ base: "sm", md: "lg" }} className="border border-border-base rounded">
      <Text as="span">Responsive Box (resize preview to inspect)</Text>
    </Box>
  ),
};
