import { renderWithProviders, setupUser, screen } from "../../test-utils";
import { describe, it, expect, vi } from "vitest";
import { useSelect, type SelectOption } from "./useSelect";
import { Portal } from "../../portal/Portal";
import { axe } from "jest-axe";

const fruits: SelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "boysenberry", label: "Boysenberry" },
  { value: "cherry", label: "Cherry" },
  { value: "cranberry", label: "Cranberry" },
];

function SelectFixture({
  options = fruits,
  onChange,
  value,
  defaultValue,
  onOpenChange,
  defaultOpen,
  open,
}: {
  options?: SelectOption[];
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  open?: boolean;
} = {}) {
  const select = useSelect({
    options,
    onChange,
    value,
    defaultValue,
    onOpenChange,
    defaultOpen,
    open,
  });
  return (
    <div>
      <span {...select.labelProps}>Favorite Fruit</span>
      <div data-testid="combobox" {...select.comboboxProps}>
        {select.selectedLabel ?? "Choose a Fruit"}
      </div>
      {select.open && (
        <Portal>
          <div data-testid="listbox" {...select.listboxProps}>
            {options.map((option, index) => (
              <div
                key={option.value}
                data-testid={`option-${option.value}`}
                {...select.getOptionProps(index)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </Portal>
      )}
    </div>
  );
}

describe("useSelect", () => {
  describe("aria structure (APG: Role, Property, State)", () => {
    it("renders combobox and listbox with the pattern's roles and wiring", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      expect(combobox).toHaveAttribute("role", "combobox");
      expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");
      expect(combobox).toHaveAttribute("aria-controls");
      await user.click(combobox);
      const listbox = screen.getByTestId("listbox");
      expect(listbox).toHaveAttribute("role", "listbox");
      expect(combobox.getAttribute("aria-controls")).toBe(listbox.id);
      expect(combobox.getAttribute("aria-labelledby")).toBe(
        screen.getByText("Favorite Fruit").id,
      );
      const apple = screen.getByTestId("option-apple");
      expect(apple).toHaveAttribute("role", "option");
    });

    it("combobox aria-expanded reflects open state", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      expect(combobox).toHaveAttribute("aria-expanded", "true");
      await user.click(combobox);
      expect(combobox).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("closed combobox keyboard (APG: Closed Combobox)", () => {
    it("ArrowDown opens and activates the first option", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowDown}");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-apple").id,
      );
    });

    it("ArrowUp opens and activates the last option", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowUp}");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cranberry").id,
      );
    });

    it("Enter and Space open without changing the active option", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture defaultValue="cherry" />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{Enter}");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      // Active option is the selected one, not moved by Enter
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cherry").id,
      );
      await user.keyboard("{Escape}");
      await user.keyboard(" ");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cherry").id,
      );
    });
  });

  describe("listbox popup keyboard (APG: Listbox Popup)", () => {
    async function openPopup() {
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowDown}");
      return { user, combobox };
    }

    it("ArrowDown moves to the next option and does not wrap", async () => {
      renderWithProviders(<SelectFixture />);
      const { user, combobox } = await openPopup();
      await user.keyboard("{ArrowDown}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-banana").id,
      );
      for (let i = 0; i < 5; i++) await user.keyboard("{ArrowDown}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cranberry").id,
      );
    });

    it("ArrowUp moves to the previous option and does not wrap", async () => {
      renderWithProviders(<SelectFixture />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowUp}");
      await user.keyboard("{ArrowUp}");
      // Opened on the last option (cranberry); one more ArrowUp lands on cherry
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cherry").id,
      );
    });

    it("Home and End move to the first and last options", async () => {
      renderWithProviders(<SelectFixture />);
      const { user, combobox } = await openPopup();
      await user.keyboard("{End}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cranberry").id,
      );
      await user.keyboard("{Home}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-apple").id,
      );
    });

    it("PageUp/PageDown jump 10 options, clamped", async () => {
      renderWithProviders(<SelectFixture />);
      const { user, combobox } = await openPopup();
      await user.keyboard("{PageDown}");
      // 0 + 10 clamps to the last of 6 options
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cranberry").id,
      );
      await user.keyboard("{PageUp}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-apple").id,
      );
    });

    it("Enter selects the active option, closes, and reports onChange", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture onChange={onChange} />);
      const { user, combobox } = await openPopup();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");
      expect(onChange).toHaveBeenCalledWith("banana");
      expect(screen.queryByTestId("listbox")).toBeNull();
      expect(combobox).toHaveTextContent("Banana");
      expect(combobox).toHaveFocus();
    });

    it("Space selects the active option and closes", async () => {
      renderWithProviders(<SelectFixture />);
      const { user, combobox } = await openPopup();
      await user.keyboard(" ");
      expect(screen.queryByTestId("listbox")).toBeNull();
      expect(combobox).toHaveTextContent("Apple");
    });

    it("Escape closes retaining the current value", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture defaultValue="cherry" onChange={onChange} />);
      const { user, combobox } = await openPopup();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Escape}");
      expect(screen.queryByTestId("listbox")).toBeNull();
      expect(onChange).not.toHaveBeenCalled();
      expect(combobox).toHaveTextContent("Cherry");
    });
  });

  describe("typeahead (APG: character keys)", () => {
    it("typing opens and activates the first matching option", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("b");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-banana").id,
      );
    });

    it("multiple characters in quick succession match the full string", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("bl");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-blueberry").id,
      );
    });

    it("repeating the same character cycles among first-letter matches", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("b");
      await user.keyboard("b");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-blueberry").id,
      );
      await user.keyboard("b");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-boysenberry").id,
      );
    });

    it("no match does not move the active option", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("z");
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      // active stays at the first option (default on open)
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-apple").id,
      );
    });
  });

  describe("mouse interaction", () => {
    it("clicking the combobox toggles the popup", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      expect(screen.getByTestId("listbox")).toBeInTheDocument();
      await user.click(combobox);
      expect(screen.queryByTestId("listbox")).toBeNull();
    });

    it("clicking an option selects it and returns focus to the combobox", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture onChange={onChange} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      await user.click(screen.getByTestId("option-cherry"));
      expect(onChange).toHaveBeenCalledWith("cherry");
      expect(screen.queryByTestId("listbox")).toBeNull();
      expect(combobox).toHaveTextContent("Cherry");
      expect(combobox).toHaveFocus();
    });

    it("pointerdown outside commits the active option and closes", async () => {
      const onChange = vi.fn();
      renderWithProviders(
        <div>
          <SelectFixture onChange={onChange} />
          <button data-testid="elsewhere">elsewhere</button>
        </div>,
      );
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.click(screen.getByTestId("elsewhere"));
      expect(onChange).toHaveBeenCalledWith("banana");
      expect(screen.queryByTestId("listbox")).toBeNull();
    });
  });

  describe("controlled and uncontrolled value", () => {
    it("uncontrolled: selection updates internally and via onChange", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture onChange={onChange} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      await user.click(screen.getByTestId("option-cherry"));
      expect(onChange).toHaveBeenCalledWith("cherry");
      expect(combobox).toHaveTextContent("Cherry");
    });

    it("controlled: value prop wins; onChange reports requests", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture value="banana" onChange={onChange} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      await user.click(screen.getByTestId("option-cherry"));
      expect(onChange).toHaveBeenCalledWith("cherry");
      // Controlled value still displayed
      expect(combobox).toHaveTextContent("Banana");
    });

    it("controlled open state: onOpenChange reports requests", async () => {
      const onOpenChange = vi.fn();
      renderWithProviders(<SelectFixture open={false} onOpenChange={onOpenChange} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByTestId("listbox")).toBeNull();
    });
  });

  describe("popup positioning", () => {
    it("anchors the listbox under the combobox", async () => {
      const user = setupUser();
      renderWithProviders(<SelectFixture />);
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      const listbox = screen.getByTestId("listbox");
      const anchorRect = combobox.getBoundingClientRect();
      expect(listbox.style.top).toBe(`${anchorRect.bottom + window.scrollY}px`);
      expect(listbox.style.left).toBe(`${anchorRect.left + window.scrollX}px`);
      expect(listbox.style.minWidth).toBe(`${anchorRect.width}px`);
    });
  });

  describe("disabled options", () => {
    const withDisabled = [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana", disabled: true },
      { value: "cherry", label: "Cherry" },
    ];

    it("skips disabled options during keyboard navigation", async () => {
      renderWithProviders(<SelectFixture options={withDisabled} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      combobox.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      expect(combobox.getAttribute("aria-activedescendant")).toBe(
        screen.getByTestId("option-cherry").id,
      );
    });

    it("cannot select a disabled option by click", async () => {
      const onChange = vi.fn();
      renderWithProviders(<SelectFixture options={withDisabled} onChange={onChange} />);
      const user = setupUser();
      const combobox = screen.getByTestId("combobox");
      await user.click(combobox);
      await user.click(screen.getByTestId("option-banana"));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it("is axe-clean while open", async () => {
    const user = setupUser();
    const { baseElement } = renderWithProviders(<SelectFixture />);
    await user.click(screen.getByTestId("combobox"));
    // The region rule is a page-structure concern, not a widget concern: the
    // portalled listbox is a direct child of body (like every overlay popup)
    // and so is outside any landmark this isolated test renders.
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });
});
