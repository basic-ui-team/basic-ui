import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    totalItems: {
      control: "number",
      description: "Total number of items to paginate",
    },
    itemsPerPage: {
      control: "number",
      description: "Number of items per page",
    },
    currentPage: {
      control: "number",
      description: "Current active page (1-indexed)",
    },
    onPageChange: {
      action: "onPageChange",
      description: "Callback when page changes",
    },
    showFirstLast: {
      control: "boolean",
      description: "Show first and last page buttons",
    },
    showPrevNext: {
      control: "boolean",
      description: "Show previous and next page buttons",
    },
    maxSiblingButtons: {
      control: "number",
      description: "Max page buttons adjacent to current page",
    },
    maxBoundaryButtons: {
      control: "number",
      description: "Max page buttons at start/end",
    },
    shape: {
      control: "select",
      options: ["rounded", "square"],
      description: "Border radius style",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic pagination with default settings. */
export const Default: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination showing first/last navigation buttons. */
export const WithFirstLast: Story = {
  args: {
    totalItems: 150,
    itemsPerPage: 10,
    showFirstLast: true,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(3);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Large pagination set with many pages. */
export const ManyPages: Story = {
  args: {
    totalItems: 500,
    itemsPerPage: 10,
    showFirstLast: true,
    maxSiblingButtons: 2,
    maxBoundaryButtons: 1,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(15);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination with square button shape. */
export const SquareShape: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    shape: "square",
    showFirstLast: true,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(2);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination without first/last or prev/next buttons. */
export const PageNumbersOnly: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    showFirstLast: false,
    showPrevNext: false,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(3);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination with custom icons (using text placeholders). */
export const CustomIcons: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    showFirstLast: true,
    showPrevNext: true,
    icons: {
      first: "⏮",
      previous: "◀",
      next: "▶",
      last: "⏭",
    },
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(3);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination at the first page. */
export const FirstPage: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    showFirstLast: true,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination at the last page. */
export const LastPage: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    showFirstLast: true,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(10);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};

/** Pagination with minimal sibling buttons. */
export const MinimalSiblings: Story = {
  args: {
    totalItems: 200,
    itemsPerPage: 10,
    showFirstLast: true,
    maxSiblingButtons: 1,
    maxBoundaryButtons: 1,
    currentPage: 1,
    onPageChange: () => {},
  },
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(10);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
  },
};
