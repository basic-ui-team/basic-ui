import type { Meta, StoryObj } from "@storybook/react-vite";
import { LinkPagination } from "./LinkPagination";
import { Flex } from "../../Flex";

const meta = {
  title: "Components/Pagination/LinkPagination",
  component: LinkPagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    pageCount: { control: "number", description: "Number of pages" },
    currentPage: { control: "number", description: "Active page (1-indexed)" },
    getPageHref: { table: { disable: true } },
    linkComponent: { table: { disable: true } },
    customIcons: { table: { disable: true } },
  },
} satisfies Meta<typeof LinkPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pageCount: 10,
    currentPage: 1,
    getPageHref: (p: number) => `/${p}`,
  },
  render: (args) => <LinkPagination {...args} />,
};

export const Colors: Story = {
  args: { ...Default.args, currentPage: 3 },
  render: (args) => (
    <Flex direction="column" align="center" gap={3}>
      {(["teal", "violet", "rose", "amber"] as const).map((color) => (
        <LinkPagination key={color} {...args} color={color} />
      ))}
    </Flex>
  ),
};

export const CustomIcons: Story = {
  args: {
    ...Default.args,
    customIcons: { first: "⏮", previous: "◀", next: "▶", last: "⏭" },
  },
};

export const WithoutFirstLast: Story = {
  args: { ...Default.args, showFirstLast: false },
};

export const WithoutPrevNext: Story = {
  args: { ...Default.args, showPrevNext: false },
};

export const WithCustomLinkComponent: Story = {
  args: {
    ...Default.args,
    // simple custom link component that prevents navigation so the story remains interactive
    linkComponent: ({ href, children, ...rest }: any) => (
      <a {...rest} href={String(href)} onClick={(e) => e.preventDefault()}>
        {children}
      </a>
    ),
  },
  render: (args) => <LinkPagination {...args} />,
};
