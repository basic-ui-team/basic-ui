import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TablePagination } from "./TablePagination";

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
      <div className="flex flex-col items-center gap-md">
        <TablePagination {...args} />
        <TablePagination {...args} color="primary" />
        <TablePagination {...args} color="secondary" />
      </div>
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
      <div className="flex flex-col items-center gap-md">
        <TablePagination {...args} shape="rounded" />
        <TablePagination {...args} shape="square" />
        <TablePagination {...args} shape="circular" />
      </div>
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
      <div className="flex flex-col items-center gap-md">
        <TablePagination {...args} />
        <TablePagination {...args} color="primary" />
        <TablePagination {...args} color="secondary" />
      </div>
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
      <div className="flex flex-col items-center gap-lg">
        <span className="text-sm text-foreground-muted p-md border border-foreground-muted rounded">
          maxSiblingButtons=1, maxBoundaryButtons=2
        </span>
        <TablePagination {...args} maxSiblingButtons={1} maxBoundaryButtons={2} />
        <span className="text-sm text-foreground-muted p-md mt-md border border-foreground-muted rounded">
          maxSiblingButtons=3, maxBoundaryButtons=0
        </span>
        <TablePagination {...args} maxSiblingButtons={3} maxBoundaryButtons={0} />
        <span className="text-sm text-foreground-muted p-md mt-md border border-foreground-muted rounded">
          maxSiblingButtons=0, maxBoundaryButtons=3
        </span>
        <TablePagination {...args} maxSiblingButtons={0} maxBoundaryButtons={3} />
      </div>
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
      <div className="flex flex-col items-center gap-md">
        <div className="flex gap-md">
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
        </div>
        <span className="text-lg font-medium">Current Page: {currentPage}</span>
        <TablePagination
          {...args}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxBoundaryButtons={1}
          maxSiblingButtons={1}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
  },
};
