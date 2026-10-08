import { renderWithProviders, setupUser, waitFor } from "../../test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDialog, type UseDialogProps } from "./useDialog";
import { Portal } from "../../portal/Portal";
import { resetOverlayStackForTesting } from "../useOverlay/useOverlay";
import { axe } from "jest-axe";

function DialogFixture(props: UseDialogProps = {}) {
  const { open, onOpen, onClose, dialogProps, titleProps, descriptionProps } = useDialog(props);
  return (
    <div>
      <button data-testid="opener" onClick={onOpen}>
        Open dialog
      </button>
      {open && (
        <Portal>
          <div {...dialogProps} data-testid="dialog">
            <h2 {...titleProps} data-testid="title">
              Confirm
            </h2>
            <p {...descriptionProps} data-testid="description">
              Confirm your choice.
            </p>
            <button data-testid="close" onClick={onClose}>
              Close
            </button>
          </div>
        </Portal>
      )}
    </div>
  );
}

describe("useDialog", () => {
  beforeEach(() => resetOverlayStackForTesting());
  afterEach(() => resetOverlayStackForTesting());

  it("opens via the disclosure and renders role=dialog with aria-modal", async () => {
    const user = setupUser();
    const { getByTestId, queryByTestId } = renderWithProviders(<DialogFixture />);
    expect(queryByTestId("dialog")).toBeNull();
    await user.click(getByTestId("opener"));
    const dialog = getByTestId("dialog");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("supports a non-modal dialog without trapping focus or locking scroll", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<DialogFixture modal={false} />);
    const opener = getByTestId("opener");
    opener.focus();
    await user.click(opener);

    expect(getByTestId("dialog")).toHaveAttribute("aria-modal", "false");
    expect(document.body.style.overflow).toBe("");

    await user.tab();
    expect(getByTestId("close")).toHaveFocus();
    await user.tab({ shift: true });
    expect(opener).toHaveFocus();
  });

  it("labels the dialog via aria-label when a title option is given", async () => {
    const user = setupUser();
    function TitledFixture() {
      const { open, onOpen, dialogProps } = useDialog({ title: "Confirm action" });
      return (
        <div>
          <button data-testid="opener" onClick={onOpen}>
            Open dialog
          </button>
          {open && (
            <div {...dialogProps} data-testid="dialog">
              body
            </div>
          )}
        </div>
      );
    }
    const { getByTestId } = renderWithProviders(<TitledFixture />);
    await user.click(getByTestId("opener"));
    expect(getByTestId("dialog")).toHaveAttribute("aria-label", "Confirm action");
    expect(getByTestId("dialog")).not.toHaveAttribute("aria-labelledby");
  });
  it("labels the dialog via aria-labelledby pointing at the title", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<DialogFixture />);
    await user.click(getByTestId("opener"));
    const dialog = getByTestId("dialog");
    const title = getByTestId("title");
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("describes the dialog via aria-describedby pointing at the description", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<DialogFixture hasDescription />);
    await user.click(getByTestId("opener"));
    const dialog = getByTestId("dialog");
    const description = getByTestId("description");
    expect(dialog.getAttribute("aria-describedby")).toBe(description.id);
  });
  it("omits aria-describedby when hasDescription is not enabled", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<DialogFixture />);
    await user.click(getByTestId("opener"));
    expect(getByTestId("dialog").getAttribute("aria-describedby")).toBeNull();
  });

  it("moves focus into the dialog on open and restores on close", async () => {
    const user = setupUser();
    const { getByTestId } = renderWithProviders(<DialogFixture />);
    const opener = getByTestId("opener");
    opener.focus();
    await user.click(opener);
    // The trap activates a frame after the portal attaches
    await waitFor(() => expect(getByTestId("close")).toHaveFocus());
    await user.click(getByTestId("close"));
    expect(opener).toHaveFocus();
  });

  it("Escape closes and reports onOpenChange", async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();
    const { getByTestId, queryByTestId } = renderWithProviders(
      <DialogFixture onOpenChange={onOpenChange} />,
    );
    await user.click(getByTestId("opener"));
    await user.keyboard("{Escape}");
    expect(queryByTestId("dialog")).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("locks scroll while open", async () => {
    const user = setupUser();
    renderWithProviders(<DialogFixture />);
    await user.click(document.querySelector('[data-testid="opener"]')!);
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(document.querySelector('[data-testid="close"]')!);
    expect(document.body.style.overflow).toBe("");
  });

  it("is axe-clean when open", async () => {
    const user = setupUser();
    const { baseElement, getByTestId } = renderWithProviders(<DialogFixture />);
    await user.click(getByTestId("opener"));
    const results = await axe(baseElement);
    expect(results).toHaveNoViolations();
  });
});
