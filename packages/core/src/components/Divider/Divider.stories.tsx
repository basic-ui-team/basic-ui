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

export const ResponsiveThickness: Story = {
  render: () => (
    <Box style={{ width: 320 }}>
      <Divider
        data-testid="responsive-horizontal-divider"
        decorative={false}
        thickness={{ base: "thick", md: "none", lg: "thin" }}
        inset={{ base: 1, md: 3 }}
      />
      <Box style={{ height: 160 }}>
        <Divider
          data-testid="responsive-vertical-divider"
          direction="vertical"
          decorative={false}
          thickness={{ base: "thin", md: "thick", lg: "none" }}
          inset={{ base: 1, md: 3 }}
        />
      </Box>
    </Box>
  ),
};

export const AppearanceVariants: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Box p={3}>
        <Text mb={3}>Solid</Text>
        <Divider appearance="solid" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Dashed</Text>
        <Divider appearance="dashed" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Dotted</Text>
        <Divider appearance="dotted" />
      </Box>
    </Flex>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Box p={3}>
        <Text mb={3}>Base Color</Text>
        <Divider color="default" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Muted Color</Text>
        <Divider color="muted" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Primary Color</Text>
        <Divider color="primary" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Secondary Color</Text>
        <Divider color="secondary" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Red</Text>
        <Divider color="red" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Green</Text>
        <Divider color="green" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Amber</Text>
        <Divider color="amber" />
      </Box>
      <Box p={3}>
        <Text mb={3}>Sky</Text>
        <Divider color="sky" />
      </Box>
    </Flex>
  ),
};

export const ThicknessVariants: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Divider thickness="thin" />
      <Divider thickness="medium" />
      <Divider thickness="thick" />
      <Divider thickness="none" />
    </Flex>
  ),
};

export const VerticalExample: Story = {
  render: () => (
    <Flex direction="row" align="center" gap={5} className="h-40">
      <Flex direction="row" align="center" gap={3} className="h-40">
        <Text>Left</Text>
        <Divider direction="vertical" />
        <Text>Right</Text>
      </Flex>
      <Flex direction="row" align="center" gap={3} className="h-40">
        <Text>Left with Thick Muted</Text>
        <Divider direction="vertical" thickness="thick" color="muted" />
        <Text>Right with Thick Muted</Text>
      </Flex>
      <Flex direction="row" align="center" gap={3} className="h-40">
        <Text>Left with Dashed</Text>
        <Divider direction="vertical" thickness="thin" appearance="dashed" />
        <Text>Right with Dashed</Text>
      </Flex>
    </Flex>
  ),
};

export const Labeled: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Text>Before</Text>
      <Divider label="Section" />
      <Text>After</Text>
    </Flex>
  ),
};

export const InsetExample: Story = {
  render: () => (
    <Box>
      <Text mb={3}>Horizontal Insets</Text>
      <Flex direction="column" gap={3} pb={4}>
        <Divider inset={2} />
        <Divider inset={3} />
        <Divider inset={4} />
      </Flex>
      <Divider />
      <Text mb={3} mt={2}>
        Note: Inset is not currently supported for vertical dividers.
      </Text>
    </Box>
  ),
};
