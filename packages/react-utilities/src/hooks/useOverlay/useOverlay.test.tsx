import { renderWithProviders, setupUser } from "../../test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as React from "react";
import { useOverlay, resetOverlayStackForTesting } from "./useOverlay";
import { useDisclosure } from "../useDisclosure/useDisclosure";

describe("useOverlay", () => {
  beforeEach(() => {
    resetOverlayStackForTesting();
  });

  afterEach(() => {
    resetOverlayStackForTesting();
  });

  it("restores a pre-existing inline body overflow policy on unlock", () => {
    const onDismiss = vi.fn();
    document.body.style.overflow = "scroll";
    function Fixture({ open }: { open: boolean }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useOverlay({ open, ref, onDismiss });
      return open ? <div ref={ref}>overlay</div> : null;
    }
    const { rerender } = renderWithProviders(<Fixture open />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Fixture open={false} />);
    expect(document.body.style.overflow).toBe("scroll");
    document.body.style.overflow = "";
  });

  it("locks body scroll while open and restores on close", () => {
    const onDismiss = vi.fn();
    function Fixture({ open }: { open: boolean }) {
      const ref = React.useRef<HTMLDivElement>(null);
      useOverlay({ open, ref, onDismiss });
      return open ? <div ref={ref}>overlay</div> : null;
    }
    const { rerender } = renderWithProviders(<Fixture open />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Fixture open={false} />);
    expect(document.body.style.overflow).toBe("");
  });

  it("Escape dismisses an open overlay", async () => {
    const user = setupUser();
    const onDismiss = vi.fn();
    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      const { open } = useDisclosure({ defaultOpen: true });
      useOverlay({ open, ref, onDismiss });
      return open ? <div ref={ref}>overlay</div> : null;
    }
    renderWithProviders(<Fixture />);
    await user.keyboard("{Escape}");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("Escape only dismisses the topmost overlay", async () => {
    const user = setupUser();
    const dismissBottom = vi.fn();
    const dismissTop = vi.fn();
    function Fixture() {
      const ref1 = React.useRef<HTMLDivElement>(null);
      const ref2 = React.useRef<HTMLDivElement>(null);
      const [showTop, setShowTop] = React.useState(false);
      React.useEffect(() => {
        setShowTop(true);
      }, []);
      const { open: openBottom } = useDisclosure({ defaultOpen: true });
      useOverlay({ open: openBottom && !showTop === false, ref: ref1, onDismiss: dismissBottom });
      useOverlay({ open: showTop, ref: ref2, onDismiss: dismissTop });
      return (
        <div>
          <div ref={ref1}>bottom</div>
          {showTop && <div ref={ref2}>top</div>}
        </div>
      );
    }
    renderWithProviders(<Fixture />);
    await user.keyboard("{Escape}");
    expect(dismissTop).toHaveBeenCalledTimes(1);
    expect(dismissBottom).not.toHaveBeenCalled();
  });

  it("outside pointerdown dismisses but inside does not", async () => {
    const user = setupUser();
    const onDismiss = vi.fn();
    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      const { open } = useDisclosure({ defaultOpen: true });
      useOverlay({ open, ref, onDismiss });
      return (
        <div>
          <div ref={ref} data-testid="overlay">overlay</div>
          <button data-testid="outside">outside</button>
        </div>
      );
    }
    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("overlay"));
    expect(onDismiss).not.toHaveBeenCalled();
    await user.click(getByTestId("outside"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("respects dismissOnOutside=false", async () => {
    const user = setupUser();
    const onDismiss = vi.fn();
    function Fixture() {
      const ref = React.useRef<HTMLDivElement>(null);
      const { open } = useDisclosure({ defaultOpen: true });
      useOverlay({ open, ref, onDismiss, dismissOnOutside: false });
      return (
        <div>
          <div ref={ref}>overlay</div>
          <button data-testid="outside">outside</button>
        </div>
      );
    }
    const { getByTestId } = renderWithProviders(<Fixture />);
    await user.click(getByTestId("outside"));
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("nested overlays lock scroll once and restore once", () => {
    function Fixture({ openA, openB }: { openA: boolean; openB: boolean }) {
      const refA = React.useRef<HTMLDivElement>(null);
      const refB = React.useRef<HTMLDivElement>(null);
      useOverlay({ open: openA, ref: refA, onDismiss: () => {} });
      useOverlay({ open: openB, ref: refB, onDismiss: () => {} });
      return (
        <div>
          {openA && <div ref={refA}>a</div>}
          {openB && <div ref={refB}>b</div>}
        </div>
      );
    }
    const { rerender } = renderWithProviders(<Fixture openA openB />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Fixture openA openB={false} />);
    // One overlay still open — still locked
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Fixture openA={false} openB={false} />);
    expect(document.body.style.overflow).toBe("");
  });
});
