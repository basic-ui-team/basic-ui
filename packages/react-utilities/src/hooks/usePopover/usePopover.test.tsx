import { renderWithProviders, setupUser } from "../../test-utils";
import { screen } from "@testing-library/react";
import * as React from "react";
import { usePopover, type UsePopoverProps } from "./usePopover";
import { resetOverlayStackForTesting } from "../useOverlay/useOverlay";
import { Portal } from "../../portal/Portal";
import { useDialog } from "../useDialog/useDialog";

describe("usePopover", () => {
  beforeEach(() => {
    resetOverlayStackForTesting();
  });
  afterEach(() => {
    resetOverlayStackForTesting();
  });

  function PopoverFixture(
    props: Partial<Omit<UsePopoverProps<HTMLButtonElement>, "anchorRef">> = {},
  ) {
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const { open, onToggle, anchorProps, popoverProps } = usePopover({
      anchorRef,
      ...props,
    });
    return (
      <>
        <button {...anchorProps} onClick={onToggle}>
          Trigger
        </button>
        {open && (
          <Portal>
            <div {...popoverProps} data-testid="popover">
              Content
            </div>
          </Portal>
        )}
      </>
    );
  }

  function ControlledPopoverFixture({
    onOpenChange,
  }: {
    onOpenChange: (nextOpen: boolean) => void;
  }) {
    const [open, setOpen] = React.useState(false);

    return (
      <PopoverFixture
        open={open}
        onOpenChange={(nextOpen) => {
          onOpenChange(nextOpen);
          setOpen(nextOpen);
        }}
      />
    );
  }

  function DialogFixture() {
    const { open, onClose, dialogProps, titleProps } = useDialog({ defaultOpen: true });
    if (!open) return null;
    return (
      <Portal>
        <div {...dialogProps} data-testid="dialog">
          <h2 {...titleProps}>Dialog</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </Portal>
    );
  }

  it("renders closed; aria-expanded reflects open state", async () => {
    const user = setupUser();
    renderWithProviders(<PopoverFixture />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("aria-controls matches the popover element id", async () => {
    const user = setupUser();
    renderWithProviders(<PopoverFixture />);
    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-controls", screen.getByTestId("popover").id);
  });

  it("clicking the trigger while open closes it exactly once", async () => {
    const user = setupUser();
    renderWithProviders(<PopoverFixture />);
    const trigger = screen.getByRole("button");

    await user.click(trigger);
    await user.click(trigger);

    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
  });

  it("outside pointerdown dismisses; pointerdown inside does not", async () => {
    // open, then user.pointer over a <p>elsewhere</p> in the fixture body
    // expect closed; repeat with pointerdown on the popover itself → stays open
    const user = setupUser();
    renderWithProviders(<PopoverFixture />);
    const trigger = screen.getByRole("button");

    await user.click(trigger);
    await user.pointer({ target: document.body, keys: "[MouseLeft]" });

    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();

    // reopen
    await user.click(trigger);
    const popover = screen.getByTestId("popover");
    await user.pointer({ target: popover, keys: "[MouseLeft]" });

    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("Escape dismisses the topmost popover only", async () => {
    const user = setupUser();
    renderWithProviders(
      <>
        <PopoverFixture defaultOpen />
        <PopoverFixture defaultOpen />
      </>,
    );

    expect(screen.queryAllByTestId("popover").length).toBe(2);

    await user.keyboard("[Escape]");
    expect(screen.queryAllByTestId("popover").length).toBe(1);

    await user.keyboard("[Escape]");
    expect(screen.queryAllByTestId("popover").length).toBe(0);
  });

  it("dismissOnOutside: false stays open on outside pointerdown", async () => {
    const user = setupUser();
    renderWithProviders(<PopoverFixture dismissOnOutside={false} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.pointer({ target: document.body, keys: "[MouseLeft]" });

    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("dismissOnEscape: false ignores Escape", async () => {
    const user = setupUser();
    renderWithProviders(<PopoverFixture dismissOnEscape={false} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    await user.keyboard("[Escape]");

    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("does not lock scroll while open (non-modal)", () => {
    renderWithProviders(<PopoverFixture defaultOpen />);
    expect(document.body.style.overflow).toBe("");
  });

  it("Escape closes a popover stacked above a dialog, not the dialog", async () => {
    const user = setupUser();
    renderWithProviders(
      <>
        <DialogFixture />
        <PopoverFixture defaultOpen />
      </>,
    );

    expect(screen.getByTestId("popover")).toBeInTheDocument();
    expect(screen.getByTestId("dialog")).toBeInTheDocument();

    await user.keyboard("[Escape]");
    expect(screen.queryByTestId("popover")).not.toBeInTheDocument();
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("controlled open/onOpenChange works", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();
    renderWithProviders(<ControlledPopoverFixture onOpenChange={onOpenChange} />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByTestId("popover")).toBeInTheDocument();
  });

  it("hasPopup and role defaults are overridable", () => {
    renderWithProviders(<PopoverFixture hasPopup="menu" role="menu" defaultOpen />);

    const trigger = screen.getByRole("button");
    const popover = screen.getByTestId("popover");

    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(popover).toHaveAttribute("role", "menu");
  });
});
