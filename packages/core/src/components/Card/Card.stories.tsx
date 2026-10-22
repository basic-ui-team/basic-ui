import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./index";
import { Text } from "../Text/Text";
import { Flex } from "../Flex";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const ResponsiveLayout: Story = {
  render: () => (
    <Card variant="outlined" className="max-w-lg">
      <Card.Image
        src="https://placehold.co/800x600"
        alt="Placeholder"
        aspectRatio={{ base: "square", md: "video", lg: "auto" }}
        objectFit={{ base: "cover", lg: "contain" }}
        rounded="lg"
      />
      <Card.Header variant={{ base: "compact", md: "default" }}>
        <Card.Title
          size={{ base: "h4", md: "h3", lg: "h2" }}
          truncate={{ base: true, md: false }}
          wrap="balance"
        >
          A responsive card title that truncates on narrow screens and wraps on wider screens
        </Card.Title>
        <Card.Description
          size={{ base: "sm", md: "md" }}
          truncate={{ base: true, md: false }}
          wrap={{ base: "nowrap", md: "pretty" }}
        >
          Resize the preview to change spacing, typography, wrapping, and image geometry.
        </Card.Description>
      </Card.Header>
      <Card.Body variant={{ base: "compact", lg: "default" }}>Independent body spacing</Card.Body>
      <Card.Footer sticky variant={{ base: "compact", md: "default" }}>
        Scalar sticky footer
      </Card.Footer>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-5/6">
      <Card variant="default">
        <Card.Header>
          <Card.Title>Default card</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>
            Default variant uses subtle surface and elevation on hover.
          </Card.Description>
        </Card.Body>
      </Card>

      <Card variant="elevated">
        <Card.Header>
          <Card.Title>Elevated card</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>Elevated cards use stronger shadows for emphasis.</Card.Description>
        </Card.Body>
      </Card>

      <Card variant="outlined">
        <Card.Header>
          <Card.Title>Outlined card</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>
            Outlined cards show a visible border and lighter background.
          </Card.Description>
        </Card.Body>
      </Card>

      <Card variant="unstyled">
        <Card.Header>
          <Card.Title>Unstyled card</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>
            Use the unstyled Card when you want the structure without default visuals.
          </Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const Interactions: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-5/6">
      <Card interaction="static">
        <Card.Body>
          <Card.Description>Static card (no pointer interactions)</Card.Description>
        </Card.Body>
      </Card>

      <Card interaction="clickable" onClick={() => alert("Card clicked")}>
        <Card.Body>
          <Card.Description>
            Clickable card (renders as a button for accessibility)
          </Card.Description>
        </Card.Body>
      </Card>

      <Card interaction="draggable">
        <Card.Body>
          <Card.Description>Draggable card (draggable attribute and cursor)</Card.Description>
        </Card.Body>
      </Card>

      <Card interaction="both" onClick={() => alert("Both: click")}>
        <Card.Body>
          <Card.Description>Both (draggable + clickable)</Card.Description>
        </Card.Body>
      </Card>

      <Card href="#" interaction="clickable">
        <Card.Body>
          <Card.Description>Anchor card (href renders as anchor)</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates different `interaction` modes: `static`, `clickable`, `draggable`, `both`, and `href` anchors.",
      },
    },
  },
};

export const SelectedDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-5/6">
      <Card selected>
        <Card.Body>
          <Card.Description>Selected card (visual selected state)</Card.Description>
        </Card.Body>
      </Card>

      <Card disabled>
        <Card.Body>
          <Card.Description>Disabled card (reduced opacity, interactions blocked)</Card.Description>
        </Card.Body>
      </Card>

      <Card selected disabled>
        <Card.Body>
          <Card.Description>Selected + disabled</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const Composition: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-3/4">
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
          <Card.Description as="span">@username</Card.Description>
        </Card.Header>
        <Card.Image className="p-3" src="https://placehold.co/600x400" alt="banner" objectFit="cover" />
        <Card.Body>
          <Text>
            This is an example of a composed Card using Header, Image, Body and Footer
            subcomponents.
          </Text>
        </Card.Body>
        <Card.Footer>
          <Flex justify="end" className="gap-2">
            <button
              className="bg-primary-500 px-3 py-2 rounded-sm"
              onClick={() => alert("Followed")}
            >
              Follow
            </button>
            <button
              className="bg-secondary-400 px-3 py-2 rounded-sm"
              onClick={() => alert("Message sent")}
            >
              Message
            </button>
          </Flex>
        </Card.Footer>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Sticky footer example</Card.Title>
        </Card.Header>
        <Card.Body className="overflow-y-scroll" style={{ height: 120 }}>
          <Text truncate={true}>
            Card body with enough content to demonstrate sticky footer behavior. This content needs
            to be really long so we're able to see the sticky footer in action. Lorem ipsum dolor
            sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem
            placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
            urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa
            nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti
            sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
          </Text>
        </Card.Body>
        <Card.Footer sticky>
          <Flex justify="end" className="gap-2">
            <button
              className="bg-primary-500 px-3 py-2 rounded-sm "
              onClick={() => alert("Action clicked")}
            >
              Action
            </button>
            <button
              className="bg-red-100 text-red-800 px-3 py-2 rounded-sm"
              onClick={() => alert("Cancel clicked")}
            >
              Cancel
            </button>
          </Flex>
        </Card.Footer>
      </Card>
    </div>
  ),
};

export const UnstyledUsage: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-5/6">
      <Card.Unstyled className="p-3 border border-primary-500 rounded-full shadow-sm hover:shadow-md hover:bg-primary-500/10 transition-all duration-300">
        <Card.Header>
          <Card.Title>Unstyled with custom classes</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Description>
            We can apply our own classes when using the Unstyled Card.
          </Card.Description>
        </Card.Body>
      </Card.Unstyled>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`Card.Unstyled` provides the card structure but intentionally avoids the library's default visual styles so you can compose your own look.",
      },
    },
  },
};

export const Polymorphic: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-5/6">
      <Card as="div">
        <Card.Body>
          <Card.Description>Rendered as `div` (default)</Card.Description>
        </Card.Body>
      </Card>

      <Card as="button" interaction="clickable" onClick={() => {}}>
        <Card.Body>
          <Card.Description>Rendered as `button` using `as` prop</Card.Description>
        </Card.Body>
      </Card>

      <Card as="a" href="#">
        <Card.Body>
          <Card.Description>Rendered as `a` using `as` and `href`</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
};
