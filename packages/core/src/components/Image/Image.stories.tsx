import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "./Image";
import { Flex } from "../Flex";
import { Box } from "../Box";
import { Text } from "../Text";

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

export const ResponsiveGeometry: Story = {
  render: () => {
    const src = `data:image/svg+xml,${encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='600' height='400' fill='indigo'/></svg>",
    )}`;
    return (
      <div className="flex flex-col gap-3">
        <Image
          src={src}
          alt="Responsive image"
          aspectRatio={{ base: "square", md: "video", lg: "auto" }}
          objectFit={{ base: "cover", lg: "contain" }}
          rounded="lg"
          className="w-full max-w-md"
        />
        <Image
          as="picture"
          src={src}
          sources={[{ srcSet: src, media: "(min-width: 768px)" }]}
          alt="Responsive picture"
          aspectRatio={{ base: "square", md: "video", lg: "auto" }}
          objectFit={{ base: "cover", lg: "contain" }}
          rounded="lg"
          className="w-full max-w-md"
        />
      </div>
    );
  },
};

export const Basic: Story = {
  render: () => (
    <Image src="https://placehold.co/600x400" alt="Placeholder image" className="w-72 h-48" />
  ),
};

export const ResponsivePicture: Story = {
  render: () => (
    <Image
      as="picture"
      src="https://placehold.co/800x600"
      alt="Responsive"
      sources={[
        {
          srcSet: "https://placehold.co/400x300 1x, https://placehold.co/800x600 2x",
          media: "(max-width: 600px)",
        },
        {
          srcSet: "https://placehold.co/800x600 1x, https://placehold.co/1600x1200 2x",
          media: "(min-width: 601px)",
        },
      ]}
      className="w-full max-w-md"
    />
  ),
};

export const ObjectFit: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      <Box>
        <Text>Object Fit: Cover</Text>
        <Image
          src="https://placehold.co/400x300"
          alt="Cover"
          objectFit="cover"
          className="w-96 h-48"
        />
      </Box>
      <Box>
        <Text>Object Fit: Contain</Text>
        <Image
          src="https://placehold.co/400x300"
          alt="Contain"
          objectFit="contain"
          className="w-96 h-48 bg-neutral-100"
        />
      </Box>
      <Box>
        <Text>Object Fit: Fill</Text>
        <Image
          src="https://placehold.co/400x300"
          alt="Fill"
          objectFit="fill"
          className="w-96 h-48"
        />
      </Box>
      <Box>
        <Text>Object Fit: None</Text>
        <Image
          src="https://placehold.co/400x300"
          alt="None"
          objectFit="none"
          className="w-96 h-48"
        />
      </Box>
    </Flex>
  ),
};

const variants = ["none", "sm", "md", "lg", "xl", "full"] as const;
export const Rounded: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      {variants.map((v) => (
        <Box key={v}>
          <Text>Rounded: {v}</Text>
          <Image
            src="https://placehold.co/400x300"
            alt={`Rounded ${v}`}
            rounded={v}
            className="w-48 h-48"
          />
        </Box>
      ))}
    </Flex>
  ),
};

const aspectRatios = ["square", "video", "landscape", "portrait", "auto"] as const;
export const AspectRatios: Story = {
  render: () => (
    <Flex direction="column" gap={3}>
      {aspectRatios.map((ar) => (
        <Box key={ar}>
          <Text>Aspect Ratio: {ar}</Text>
          <Image
            src="https://placehold.co/400x300"
            alt={`Aspect Ratio ${ar}`}
            aspectRatio={ar}
            className="w-96"
          />
        </Box>
      ))}
    </Flex>
  ),
};
