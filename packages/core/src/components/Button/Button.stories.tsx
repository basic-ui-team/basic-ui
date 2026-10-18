import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { Box } from "../Box";
import { Spinner } from "../Spinner";
import { PALETTE_FAMILIES } from "../../lib/colorRecipes/colorRecipes";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "ghost", "outline", "link"],
    },
    color: {
      control: "select",
      options: [...PALETTE_FAMILIES],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    loadingText: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Color: Story = {
  render: () => (
    <Box className="flex flex-col flex-wrap gap-4 w-full" p={4}>
      {PALETTE_FAMILIES.map((family) => (
        <Box className="flex flex-wrap items-center">
          <span className="font-bold w-24">{family}</span>
          <Box className="flex justify-between gap-8">
            {(["solid", "outline", "ghost", "link"] as const).map((variant) => (
              <Button key={variant} color={family} variant={variant}>
                {variant.substring(0, 1).toUpperCase() + variant.substring(1)}
              </Button>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Box>
  ),
};

export const Loading: Story = {
  render: () => (
    <Box className="flex gap-2 items-center">
      <Button loading>Loading</Button>
      <Button loading loadingText="Submitting">
        With text
      </Button>
      <Button loading loadingIcon={<Spinner as="span" size="sm" color="primary" />}>
        With spinner
      </Button>
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box className="flex gap-2 items-center">
      <Button disabled>Disabled</Button>
      <Button disabled loading>
        Disabled + Loading
      </Button>
    </Box>
  ),
};

export const WithClickAction: Story = {
  render: () => {
    const handleClick = () => alert("Button clicked!");
    return <Button onClick={handleClick}>Click Me</Button>;
  },
};

export const WithCustomLoadingIcon: Story = {
  args: {
    loading: true,
    loadingIcon: <Spinner as="span" size={{ base: "xs", md: "sm" }} color="primary" />,
    children: "Loading",
  },
};

export const ResponsiveSizes: Story = {
  args: {
    size: { base: "sm", md: "md", lg: "lg" },
    children: "Resize to change button size",
  },
};

export const WithCustomLoadingText: Story = {
  args: {
    loading: true,
    loadingText: "Please wait...",
    children: "Submit",
  },
};

export const AsAnchor: Story = {
  render: () => (
    <Button as="a" href="#" color="primary">
      Anchor Link
    </Button>
  ),
};

export const WithCustomLinkComponent: Story = {
  render: () => {
    // Mock custom link component (e.g., Next.js Link, React Router Link)
    const CustomLink = React.forwardRef<any, any>(({ href, children, ...props }, ref) => (
      <a ref={ref} href={href} data-custom-link {...props}>
        {children}
      </a>
    ));
    CustomLink.displayName = "CustomLink";

    return (
      <Box className="flex gap-2 items-center flex-wrap">
        <Button as="a" linkComponent={CustomLink} href="/docs" color="primary">
          Go to Docs
        </Button>
        <Button as="a" linkComponent={CustomLink} href="/github" variant="ghost">
          GitHub
        </Button>
      </Box>
    );
  },
};
