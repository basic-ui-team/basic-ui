import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { Dialog, type DialogProps } from "./index";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  argTypes: {
    fullWidth: { control: "boolean" },
    modal: { control: "boolean" },
    showClose: { control: "boolean" },
    dismissOnOutside: { control: "boolean" },
    lockScroll: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

function DialogStory(args: DialogProps) {
  const [open, setOpen] = useState(false);
  const dialogArgs: DialogProps<"div"> = { ...args, as: "div" };

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog {...dialogArgs} open={open} onOpenChange={setOpen}>
        {args.children ?? "Update the settings for this project."}
      </Dialog>
    </>
  );
}

export const Default: Story = {
  args: {
    title: "Project settings",
    description: "Manage your project details and preferences.",
  },
  render: ({ as: _as, ...args }) => <DialogStory {...args} />,
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    title: "Full-width dialog",
    description: "This dialog expands to the available width.",
  },
  render: ({ as: _as, ...args }) => <DialogStory {...args} />,
};

export const NonModal: Story = {
  args: {
    modal: false,
    title: "Non-modal dialog",
    description: "This dialog does not trap focus or show a backdrop.",
  },
  render: ({ as: _as, ...args }) => <DialogStory {...args} />,
};

export const NoCloseButton: Story = {
  args: {
    showClose: false,
    title: "Dialog without a close button",
    description: "The dialog can still be dismissed through its other configured interactions.",
  },
  render: ({ as: _as, ...args }) => <DialogStory {...args} />,
};

export const NoTitle: Story = {
  args: {
    title: undefined,
    "aria-label": "Dialog without a title",
    description: "A dialog can contain supporting text without a title.",
    showClose: false,
    children: "The body starts without extra title spacing.",
  },
  render: ({ as: _as, ...args }) => <DialogStory {...args} />,
};

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open dialog with footer
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Discard changes?"
          description="You have unsaved changes to this project."
          footer={
            <>
              <Button variant="ghost" color="muted" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button color="primary" onClick={() => setOpen(false)}>
                Discard changes
              </Button>
            </>
          }
        >
          Your changes will be lost if you continue.
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open form dialog
        </Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Invite a teammate"
          description="Send an invitation to join your workspace."
          footer={
            <>
              <Button type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button as="button" type="submit" form="invite-form">
                Send invitation
              </Button>
            </>
          }
        >
          <form
            id="invite-form"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <label htmlFor="invite-email">Email address</label>
            <input id="invite-email" name="email" type="email" required />
          </form>
        </Dialog>
      </>
    );
  },
};
