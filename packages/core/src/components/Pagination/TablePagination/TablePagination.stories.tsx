import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TablePagination } from "./TablePagination";
import { Flex } from "../../Flex";
import { Text } from "../../Text";

const meta = {
  title: "Components/Pagination/TablePagination",
  component: TablePagination,
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
      options: ["rounded", "square", "circular"],
      description: "Border radius style",
    },
  },
} satisfies Meta<typeof TablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic pagination with default settings. */
export const Default: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
  },
  render: (args) => {
    return (
      <Flex direction="column" align="center" gap="md">
        <TablePagination {...args} />
        <TablePagination {...args} color="primary" />
        <TablePagination {...args} color="secondary" />
      </Flex>
    );
  },
};

/** Custom shape and sibling/boundary button counts. */
export const PaginationShapes: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    return (
      <Flex direction="column" align="center" gap="md">
        <TablePagination {...args} shape="rounded" />
        <TablePagination {...args} shape="square" />
        <TablePagination {...args} shape="circular" />
      </Flex>
    );
  },
};

export const OutlinedVariant: Story = {
  args: {
    ...Default.args,
    variant: "outlined",
  },
  render: (args) => {
    return (
      <Flex direction="column" align="center" gap="md">
        <TablePagination {...args} />
        <TablePagination {...args} color="primary" />
        <TablePagination {...args} color="secondary" />
      </Flex>
    );
  },
};

/** Sibling and boundary button variations. */
export const SiblingBoundaryButtons: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    return (
      <Flex direction="column" align="center" gap="lg">
        <Text>maxSiblingButtons=1, maxBoundaryButtons=2</Text>
        <TablePagination {...args} maxSiblingButtons={1} maxBoundaryButtons={2} />
        <Text>maxSiblingButtons=3, maxBoundaryButtons=0</Text>
        <TablePagination {...args} maxSiblingButtons={3} maxBoundaryButtons={0} />
        <Text>maxSiblingButtons=0, maxBoundaryButtons=3</Text>
        <TablePagination {...args} maxSiblingButtons={0} maxBoundaryButtons={3} />
      </Flex>
    );
  },
};

export const WithoutFirstLast: Story = {
  args: {
    ...Default.args,
    showFirstLast: false,
  },
};

export const WithoutPrevNext: Story = {
  args: {
    ...Default.args,
    showPrevNext: false,
  },
};

/** Pagination with custom icons. */
export const CustomIcons: Story = {
  args: {
    ...Default.args,
    customIcons: {
      first: "⏮",
      previous: "◀",
      next: "▶",
      last: "⏭",
    },
  },
};

/** Controlled pagination example. */
export const Controlled: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    return (
      <Flex direction="column" align="center" gap="md">
        <Flex gap="md">
          <button
            className="px-md py-sm bg-primary-500 rounded-md border-foreground-primary border-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <button
            className="px-md py-sm bg-primary-500 rounded-md border-foreground-primary border-2"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </Flex>
        <Text>Current Page: {currentPage}</Text>
        <TablePagination
          {...args}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxBoundaryButtons={1}
          maxSiblingButtons={1}
        />
      </Flex>
    );
  },
  args: {
    ...Default.args,
  },
};
