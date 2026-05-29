import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "./Image";

const meta: Meta<typeof Image> = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs"],
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

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
        { srcSet: "https://placehold.co/400x300 1x, https://placehold.co/800x600 2x", media: "(max-width: 600px)" },
        { srcSet: "https://placehold.co/800x600 1x, https://placehold.co/1600x1200 2x", media: "(min-width: 601px)" },
      ]}
      className="w-full max-w-md"
    />
  ),
};

export const ObjectFitContain: Story = {
  render: () => (
    <Image src="https://placehold.co/400x300" alt="Contain" objectFit="contain" className="w-48 h-48" />
  ),
};

export const RoundedFull: Story = {
  render: () => (
    <Image src="https://placehold.co/400x400" alt="Rounded Full" rounded="full" className="w-48 h-48" />
  ),
};
