import { renderWithProviders, renderHookWithProviders, waitFor } from "../../test-utils";
import { describe, it, expect } from "vitest";
import * as React from "react";
import { useAnchorPositioning, type AnchorSide, type AnchorAlign } from "./useAnchorPositioning";
import { Portal } from "../../portal/Portal";

function mockElementSize(node: HTMLElement, size: { width: number; height: number }) {
  Object.defineProperty(node, "offsetWidth", { value: size.width, configurable: true });
  Object.defineProperty(node, "offsetHeight", { value: size.height, configurable: true });
}

function mockAnchorRect(rect: Partial<DOMRect>): DOMRect {
  return {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect;
}

type FixtureRect = Partial<DOMRect>;
type PopupSize = { width: number; height: number };

function Fixture({
  enabled = true,
  side,
  align,
  sideOffset,
  viewportPadding,
  anchorRect,
  popupSize,
}: {
  enabled?: boolean;
  side?: AnchorSide;
  align?: AnchorAlign;
  sideOffset?: number;
  viewportPadding?: number;
  anchorRect: FixtureRect;
  popupSize?: PopupSize;
}) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const { popupRef, style } = useAnchorPositioning({
    enabled,
    anchorRef,
    side,
    align,
    sideOffset,
    viewportPadding,
  });
  return (
    <div>
      <button
        ref={(node) => {
          anchorRef.current = node;
          if (node) node.getBoundingClientRect = () => mockAnchorRect(anchorRect);
        }}
      >
        anchor
      </button>
      {enabled && (
        <Portal>
          <div
            ref={(node) => {
              popupRef.current = node;
              if (node && popupSize) mockElementSize(node, popupSize);
            }}
            data-testid="popup"
            style={style}
          />
        </Portal>
      )}
    </div>
  );
}

async function expectPopupStyle(left?: string, top?: string) {
  await waitFor(() => {
    const popup = document.querySelector('[data-testid="popup"]') as HTMLDivElement;
    if (left !== undefined) expect(popup.style.left).toBe(left);
    if (top !== undefined) expect(popup.style.top).toBe(top);
  });
}

describe("useAnchorPositioning", () => {
  const realInnerWidth = window.innerWidth;
  const realInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1200 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 800 });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: realInnerWidth });
    Object.defineProperty(window, "innerHeight", { writable: true, value: realInnerHeight });
  });

  it("positions bottom-start below the anchor with the side offset", async () => {
    renderWithProviders(<Fixture anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }} />);
    await expectPopupStyle("200px", "148px"); // 140 + 8
    const popup = document.querySelector('[data-testid="popup"]') as HTMLDivElement;
    expect(popup.style.position).toBe("fixed");
  });

  it("aligns center on the cross axis", async () => {
    renderWithProviders(
      <Fixture
        align="center"
        anchorRect={{ top: 100, left: 200, right: 300, bottom: 140, width: 100 }}
        popupSize={{ width: 50, height: 20 }}
      />,
    );
    await expectPopupStyle("225px"); // 200 + 100/2 - 50/2
  });

  it("aligns end on the cross axis", async () => {
    renderWithProviders(
      <Fixture
        align="end"
        anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }}
        popupSize={{ width: 50, height: 20 }}
      />,
    );
    await expectPopupStyle("250px"); // 300 - 50
  });

  it("positions top side above the anchor accounting for popup height", async () => {
    renderWithProviders(
      <Fixture
        side="top"
        anchorRect={{ top: 200, left: 200, right: 300, bottom: 240 }}
        popupSize={{ width: 50, height: 40 }}
        sideOffset={10}
      />,
    );
    await expectPopupStyle(undefined, "150px"); // 200 - 40 - 10
  });

  it("positions right and left sides", async () => {
    const { rerender } = renderWithProviders(
      <Fixture
        side="right"
        anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }}
        popupSize={{ width: 50, height: 40 }}
      />,
    );
    await expectPopupStyle("308px", "100px"); // 300 + 8; cross start = rect.top
    rerender(
      <Fixture
        side="left"
        anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }}
        popupSize={{ width: 50, height: 40 }}
      />,
    );
    await expectPopupStyle("142px"); // 200 - 50 - 8
  });

  it("clamps the popup into the viewport", async () => {
    renderWithProviders(
      <Fixture
        anchorRect={{ top: 790, left: -50, right: 50, bottom: 795 }}
        popupSize={{ width: 100, height: 50 }}
      />,
    );
    // The popup mirrors above the anchor; left -50 is clamped to 8.
    await expectPopupStyle("8px", "732px");
  });

  it("initial style is hidden until positioned", () => {
    const anchorRef = { current: null as HTMLElement | null };
    const { result } = renderHookWithProviders(() =>
      useAnchorPositioning({ enabled: true, anchorRef }),
    );
    // No anchor/popup attached: update is a no-op and the style stays hidden.
    result.current.update();
    expect(result.current.style.visibility).toBe("hidden");
    expect(result.current.style.position).toBe("fixed");
  });

  it("uses the mirrored side when the requested side does not fit", async () => {
    renderWithProviders(
      <Fixture
        anchorRect={{ top: 700, left: 200, right: 300, bottom: 740 }}
        popupSize={{ width: 100, height: 100 }}
      />,
    );
    await expectPopupStyle("200px", "592px");
  });

  it("uses the roomiest perpendicular side when neither mirrored side fits", async () => {
    renderWithProviders(
      <Fixture
        anchorRect={{ top: 350, left: 200, right: 300, bottom: 390 }}
        popupSize={{ width: 100, height: 500 }}
      />,
    );
    await expectPopupStyle("308px", "292px");
  });

  it("recomputes on window resize", async () => {
    renderWithProviders(<Fixture anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }} />);
    await expectPopupStyle("200px");
    Object.defineProperty(window, "innerWidth", { writable: true, value: 150 });
    window.dispatchEvent(new Event("resize"));
    // 200 clamped to 150 - 0 - 8 = 142
    await expectPopupStyle("142px");
  });

  it("recomputes on captured scroll events", async () => {
    renderWithProviders(<Fixture anchorRect={{ top: 100, left: 200, right: 300, bottom: 140 }} />);
    Object.defineProperty(window, "innerWidth", { writable: true, value: 100 });
    window.dispatchEvent(new Event("scroll"));
    await expectPopupStyle("92px"); // clamped to 100 - 8
  });

  it("does nothing while disabled", () => {
    renderWithProviders(<Fixture enabled={false} anchorRect={{ top: 100 }} />);
    expect(document.querySelector('[data-testid="popup"]')).toBeNull();
  });

  it("retries positioning until the portalled popup attaches", async () => {
    const anchorRef = { current: null as HTMLButtonElement | null };
    function LatePortalFixture() {
      const [show, setShow] = React.useState(false);
      const { popupRef, style } = useAnchorPositioning({ enabled: true, anchorRef });
      return (
        <div>
          <button
            ref={(node) => {
              anchorRef.current = node;
              if (node)
                node.getBoundingClientRect = () =>
                  mockAnchorRect({ top: 100, left: 200, right: 300, bottom: 140 });
            }}
          >
            anchor
          </button>
          <button data-testid="show" onClick={() => setShow(true)} />
          {show && (
            <Portal>
              <div ref={popupRef} data-testid="popup" style={style} />
            </Portal>
          )}
        </div>
      );
    }
    renderWithProviders(<LatePortalFixture />);
    expect(document.querySelector('[data-testid="popup"]')).toBeNull();
    const show = document.querySelector('[data-testid="show"]') as HTMLElement;
    show.click();
    await expectPopupStyle("200px", "148px");
  });

  it("exposes update for manual recomputation", () => {
    const anchorRef = { current: null as HTMLButtonElement | null };
    const { result } = renderHookWithProviders(() =>
      useAnchorPositioning({ enabled: true, anchorRef }),
    );
    expect(typeof result.current.update).toBe("function");
    expect(result.current.popupRef).toHaveProperty("current");
    expect(() => result.current.update()).not.toThrow();
  });
});
