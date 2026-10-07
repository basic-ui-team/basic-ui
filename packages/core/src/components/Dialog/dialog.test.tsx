import React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { renderWithProviders, screen, setupUser } from "../../test-utils";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("does not render while closed by default", () => {
    renderWithProviders(<Dialog title="Confirm">Dialog content</Dialog>);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders and closes from caller-owned state", async () => {
    const user = setupUser();
    function Fixture() {
      const [open, setOpen] = React.useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)}>Open dialog</button>
          <Dialog open={open} onOpenChange={setOpen} title="Confirm">
            Dialog content
          </Dialog>
        </>
      );
    }

    renderWithProviders(<Fixture />);
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards a ref to the dialog element", () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithProviders(
      <Dialog open ref={ref} title="Confirm">
        Dialog content
      </Dialog>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "dialog");
  });

  it("does not force full width by default", () => {
    renderWithProviders(
      <Dialog open title="Confirm">
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).not.toHaveClass("w-full");
  });

  it("expands to full width when fullWidth is enabled", () => {
    renderWithProviders(
      <Dialog open fullWidth title="Confirm">
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("w-full");
  });

  it("does not add title spacing when the title is omitted", () => {
    renderWithProviders(
      <Dialog open aria-label="Dialog without a title">
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog").querySelector("h2")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog").firstElementChild).toHaveClass("p-0");
    expect(screen.getByRole("dialog").firstElementChild).toHaveClass("justify-end");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Dialog without a title");
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("text-fg-muted");
  });

  it("is axe-clean in its default modal presentation", async () => {
    const { baseElement } = renderWithProviders(
      <Dialog open title="Project settings" description="Manage project details">
        Project details
      </Dialog>,
    );

    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it("is axe-clean in non-modal mode", async () => {
    const { baseElement } = renderWithProviders(
      <Dialog open modal={false} title="Project settings" description="Manage project details">
        Project details
      </Dialog>,
    );

    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it("is axe-clean with form content", async () => {
    const { baseElement } = renderWithProviders(
      <Dialog open title="Update profile" description="Edit your profile details">
        <form>
          <label htmlFor="display-name">Display name</label>
          <input id="display-name" name="displayName" />
          <button type="button">Cancel</button>
          <button type="submit">Save changes</button>
        </form>
      </Dialog>,
    );

    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
