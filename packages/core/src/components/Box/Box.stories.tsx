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
    <Box className="border p-2 rounded">
      <Text as="span">This is a Box (div)</Text>
    </Box>
  ),
};

export const AsSpan: Story = {
  render: () => (
    <Flex direction="row" align="center" gap={3}>
      <Text as="span">Inline with Box as span:</Text>
      <Box as="span" px={2} className="border text-foreground-primary rounded">
        Inline Box
      </Box>
    </Flex>
  ),
};

export const DisplayVariants: Story = {
  render: () => (
    <Flex direction="column" gap={3} className="text-foreground-primary">
      <Box display="block" className="border p-2">
        Block
      </Box>
      <Box display="inline-block" className="border p-2">
        Inline-block
      </Box>
      <Box display="inline" className="border p-2">
        Inline
      </Box>
    </Flex>
  ),
};

export const LayoutProps: Story = {
  render: () => (
    <Flex direction="column" gap={3} className="w-full text-foreground-primary">
      <Box p={3} m={2} className="border rounded">
        Padding MD & Margin SM
      </Box>
      <Box px={4} py={2} className="border rounded">
        Padding X LG, Y SM
      </Box>
      <Box mt={4} ml={2} mr={5} mb={1} className="border rounded">
        Margin Top LG, Left SM, Right XL, Bottom XS
      </Box>
      <Box pt={4} pl={2} pr={5} pb={1} className="border rounded">
        Padding Top LG, Left SM, Right XL, Bottom XS
      </Box>
    </Flex>
  ),
};

export const Polymorphic: Story = {
  render: () => (
    <Box
      as="section"
      aria-label="Example section"
      className="border border-border-base p-2 rounded"
    >
      <Text as="span">Section using Box as="section"</Text>
    </Box>
  ),
};

export const Responsive: Story = {
  render: () => (
    <Box
      display={{ base: "inline", md: "block" }}
      p={{ base: 2, md: 4 }}
      className="border border-border-base rounded"
    >
      <Text as="span">Responsive Box (resize preview to inspect)</Text>
    </Box>
  ),
};
