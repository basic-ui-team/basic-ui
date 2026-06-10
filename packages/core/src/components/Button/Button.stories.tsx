import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { Box } from "../Box";

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
      options: ["default", "muted", "primary", "secondary", "error", "success", "warning", "info"],
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

export const Variants: Story = {
  render: () => (
    <Box className="flex gap-md flex-col">
      {(["solid", "ghost", "outline", "link"] as const).map((variant) => (
        <Box key={variant} className="flex gap-sm items-center">
          {(
            [
              "default",
              "muted",
              "primary",
              "secondary",
              "error",
              "success",
              "warning",
              "info",
            ] as const
          ).map((color) => (
            <Button key={`${variant}-${color}`} variant={variant} color={color} size="md">
              {`${variant} / ${color}`}
            </Button>
          ))}
        </Box>
      ))}
    </Box>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Box className="flex gap-lg items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Box>
  ),
};

export const Loading: Story = {
  render: () => (
    <Box className="flex gap-sm items-center">
      <Button loading>Loading</Button>
      <Button loading loadingText="Submitting">
        With text
      </Button>
    </Box>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Box className="flex gap-sm items-center">
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
    loadingIcon: <span data-testid="custom-loader">★</span>,
    children: "Loading",
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
      <Box className="flex gap-sm items-center flex-wrap">
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
