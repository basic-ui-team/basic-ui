import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { useControllableState } from "../useControllableState/useControllableState";
import { useDisclosure } from "../useDisclosure/useDisclosure";
import { useId } from "../useId/useId";

/** How long typed characters accumulate into a single search before resetting. */
const TYPEAHEAD_RESET_MS = 500;
/** How many options PageUp/PageDown jump, per the APG select-only combobox. */
const PAGE_SIZE = 10;

export type SelectOption = {
  /** The option's value, reported through onChange and controlled `value`. */
  value: string;
  /** The option's visible text; also the typeahead search target. */
  label: string;
  /** Disabled options are skipped by keyboard navigation and cannot be selected. */
  disabled?: boolean;
};

export type UseSelectProps = {
  /** The full set of options, rendered by the consumer. */
  options: SelectOption[];
  /** Controlled selected value. When provided, the selection is controlled. */
  value?: string;
  /** Initially selected value for the uncontrolled mode. */
  defaultValue?: string;
  /** Called with the newly selected value, in both modes. */
  onChange?: (value: string) => void;
  /** Controlled open state of the listbox popup. */
  open?: boolean;
  /** Initial open state for the uncontrolled mode. Defaults to false. */
  defaultOpen?: boolean;
  /** Called with the next open state, in both modes. */
  onOpenChange?: (open: boolean) => void;
};

export type UseSelectResult = {
  /** Whether the listbox popup is open. */
  open: boolean;
  /** Open the listbox. */
  onOpen: () => void;
  /** Close the listbox. */
  onClose: () => void;
  /** The selected value, controlled or internal. */
  value: string | undefined;
  /** The label of the selected option, for the combobox's visible text. */
  selectedLabel: string | undefined;
  /** Index into `options` of the option with visual (roving) focus while open. */
  activeIndex: number;
  /** Props to spread on the visible label element. */
  labelProps: { id: string; onClick: () => void };
  /**
   * Props to spread on the combobox element (the visible trigger). DOM focus
   * stays here the whole time; the active option is conveyed through
   * `aria-activedescendant`.
   */
  comboboxProps: {
    ref: RefObject<HTMLDivElement | null>;
    id: string;
    role: "combobox";
    tabIndex: number;
    "aria-haspopup": "listbox";
    "aria-expanded": boolean;
    "aria-labelledby": string;
    "aria-controls": string;
    "aria-activedescendant"?: string;
    onClick: () => void;
    onKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
    onBlur: (event: ReactFocusEvent<HTMLDivElement>) => void;
  };
  /**
   * Props to spread on the listbox popup, rendered through `Portal`. The
   * `style` anchors the popup under the combobox via getBoundingClientRect
   * (simple anchor — no positioning engine yet, revisit in the ADR).
   */
  listboxProps: {
    ref: RefObject<HTMLDivElement | null>;
    id: string;
    role: "listbox";
    tabIndex: number;
    "aria-labelledby": string;
    style: CSSProperties;
  };
  /** Props to spread on each rendered option element. */
  getOptionProps: (index: number) => {
    role: "option";
    id: string;
    "aria-selected": boolean;
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
    onClick: () => void;
  };
};

/**
 * Headless single-select per the WAI-ARIA APG "Combobox (Select-Only)"
 * pattern: a `role="combobox"` trigger whose DOM focus never leaves the
 * combobox, a portalled `role="listbox"` popup whose active option is
 * conveyed through `aria-activedescendant`, and the pattern's full keyboard
 * interface:
 *
 * - Closed: Down opens and activates the first option, Up opens and activates
 *   the last, Enter/Space open without moving the active option; typing
 *   printable characters opens and activates the first match.
 * - Open: Down/Up/Home/End/PageUp/PageDown move the active option (never
 *   wrapping); Enter/Space/Tab select the active option and close; Escape
 *   closes retaining the value; typing continues matching (multi-letter with
 *   a 500ms reset, same-letter cycling).
 * - Mouse: clicking the combobox toggles; clicking an option selects it and
 *   returns focus to the combobox; a pointerdown outside (or focus leaving)
 *   commits the active option and closes, matching the APG reference.
 *
 * Like every stateful primitive it is controlled/uncontrolled in both the
 * selected value and the open state, built on `useControllableState` and
 * `useDisclosure`.
 *
 * @example
 * const fruits = [{ value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }];
 * const select = useSelect({ options: fruits, onChange });
 * <span {...select.labelProps}>Fruit</span>
 * <div {...select.comboboxProps}>{select.selectedLabel ?? "Choose"}</div>
 * {select.open && (
 *   <Portal>
 *     <div {...select.listboxProps}>
 *       {fruits.map((option, index) => (
 *         <div key={option.value} {...select.getOptionProps(index)}>{option.label}</div>
 *       ))}
 *     </div>
 *   </Portal>
 * )}
 */
export function useSelect(props: UseSelectProps): UseSelectResult {
  const {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    open: openProp,
    defaultOpen,
    onOpenChange,
  } = props;

  const [value, setValue] = useControllableState<string>({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const { open, onOpen, onClose, onToggle } = useDisclosure({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  const id = useId("select");
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const getOptionId = useCallback((index: number) => `${id}-option-${index}`, [id]);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const pendingActiveRef = useRef<number | null>(null);
  const searchStringRef = useRef("");
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({
    position: "absolute",
    top: 0,
    left: 0,
  });

  const enabledIndexes = useMemo(
    () => options.flatMap((option, index) => (option.disabled ? [] : [index])),
    [options],
  );
  const selectedValueIndex =
    value !== undefined ? options.findIndex((option) => option.value === value) : -1;
  const selectedLabel =
    selectedValueIndex >= 0 ? options[selectedValueIndex]?.label : undefined;

  /**
   * The active option at the moment the popup opens: the one a keydown
   * already queued (pendingActiveRef), else the selected option, else the
   * first enabled one.
   */
  useEffect(() => {
    if (!open) return;
    const pending = pendingActiveRef.current;
    pendingActiveRef.current = null;
    if (pending !== null) {
      setActiveIndex(pending);
      return;
    }
    if (selectedValueIndex >= 0 && !options[selectedValueIndex]?.disabled) {
      setActiveIndex(selectedValueIndex);
      return;
    }
    setActiveIndex(enabledIndexes[0] ?? -1);
  }, [open, value, options, enabledIndexes, selectedValueIndex]);

  useEffect(() => {
    return () => window.clearTimeout(searchTimeoutRef.current);
  }, []);

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      setValue(option.value);
      setActiveIndex(index);
    },
    [options, setValue],
  );

  const closePopup = useCallback(() => {
    onClose();
    comboboxRef.current?.focus();
  }, [onClose]);

  /** Select the active option (if any) and close — Enter/Space/Tab/blur. */
  const commitActive = useCallback(() => {
    const option = activeIndex >= 0 ? options[activeIndex] : undefined;
    if (option && !option.disabled) {
      setValue(option.value);
    }
    onClose();
  }, [activeIndex, options, setValue, onClose]);
  const commitActiveRef = useRef(commitActive);
  commitActiveRef.current = commitActive;

  // The blur that follows a programmatic commit (Tab moving focus on) would
  // commit a second time before the re-render; ignore it once.
  const ignoreNextBlurRef = useRef(false);

  const moveActive = useCallback(
    (delta: number) => {
      if (enabledIndexes.length === 0) return;
      const position = enabledIndexes.indexOf(activeIndex);
      const next = Math.min(
        Math.max(position + delta, 0),
        enabledIndexes.length - 1,
      );
      setActiveIndex(enabledIndexes[next]);
    },
    [enabledIndexes, activeIndex],
  );

  const findTypeaheadIndex = useCallback(
    (search: string): number => {
      const normalized = search.toLowerCase();
      const start = activeIndex >= 0 ? activeIndex + 1 : 0;
      const ordered = [...options.slice(start), ...options.slice(0, start)];
      const firstMatch = ordered.find(
        (option) => !option.disabled && option.label.toLowerCase().startsWith(normalized),
      );
      if (firstMatch) return options.indexOf(firstMatch);
      const allSameLetter =
        normalized.length > 0 &&
        normalized.split("").every((char) => char === normalized[0]);
      if (allSameLetter) {
        const cycled = ordered.find(
          (option) => !option.disabled && option.label.toLowerCase().startsWith(normalized[0]),
        );
        if (cycled) return options.indexOf(cycled);
      }
      return -1;
    },
    [options, activeIndex],
  );

  const accumulateSearch = useCallback((char: string) => {
    window.clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = window.setTimeout(() => {
      searchStringRef.current = "";
    }, TYPEAHEAD_RESET_MS);
    searchStringRef.current += char.toLowerCase();
    return searchStringRef.current;
  }, []);

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const { key, altKey, ctrlKey, metaKey } = event;

      if (key === "Escape" && open) {
        event.preventDefault();
        onClose();
        return;
      }

      if (!open) {
        if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
          // Closed: Down/Up open and activate the first/last option
          // (APG); Enter/Space open without moving the active option.
          event.preventDefault();
          if (key === "ArrowDown") {
            pendingActiveRef.current = enabledIndexes[0] ?? -1;
          } else if (key === "ArrowUp") {
            pendingActiveRef.current = enabledIndexes[enabledIndexes.length - 1] ?? -1;
          }
          onOpen();
          return;
        }
        if (key === "Home" || key === "End") {
          event.preventDefault();
          pendingActiveRef.current =
            key === "Home"
              ? (enabledIndexes[0] ?? -1)
              : (enabledIndexes[enabledIndexes.length - 1] ?? -1);
          onOpen();
          return;
        }
      }

      if (
        key === "Backspace" ||
        key === "Clear" ||
        (key.length === 1 && key !== " " && !altKey && !ctrlKey && !metaKey)
      ) {
        const search = accumulateSearch(key);
        const match = findTypeaheadIndex(search);
        if (match < 0) {
          window.clearTimeout(searchTimeoutRef.current);
          searchStringRef.current = "";
        }
        if (!open) {
          pendingActiveRef.current = match >= 0 ? match : null;
          onOpen();
        } else if (match >= 0) {
          pendingActiveRef.current = null;
          setActiveIndex(match);
        }
        return;
      }

      if (open) {
        if (key === "Enter" || key === " ") {
          event.preventDefault();
          commitActive();
          return;
        }
        if (key === "Tab") {
          // Select and close, letting the browser move focus onwards.
          ignoreNextBlurRef.current = true;
          commitActive();
          return;
        }
        if (key === "ArrowDown") {
          event.preventDefault();
          if (altKey) {
            commitActive();
            return;
          }
          moveActive(1);
          return;
        }
        if (key === "ArrowUp") {
          event.preventDefault();
          if (altKey) {
            commitActive();
            return;
          }
          moveActive(-1);
          return;
        }
        if (key === "Home") {
          event.preventDefault();
          setActiveIndex(enabledIndexes[0] ?? -1);
          return;
        }
        if (key === "End") {
          event.preventDefault();
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
          return;
        }
        if (key === "PageUp") {
          event.preventDefault();
          moveActive(-PAGE_SIZE);
          return;
        }
        if (key === "PageDown") {
          event.preventDefault();
          moveActive(PAGE_SIZE);
          return;
        }
      }
    },
    [open, enabledIndexes, onOpen, onClose, commitActive, moveActive, accumulateSearch, findTypeaheadIndex],
  );

  /** Focus leaving the combobox (and not into the popup) commits and closes. */
  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLDivElement>) => {
      if (ignoreNextBlurRef.current) {
        ignoreNextBlurRef.current = false;
        return;
      }
      if (!open) return;
      if (listboxRef.current?.contains(event.relatedTarget as Node | null)) return;
      commitActive();
    },
    [open, commitActive],
  );

  /**
   * A pointerdown outside both the combobox and the portalled listbox
   * commits the active option and closes — the APG reference's blur-commit
   * behavior, made robust for portalled popups.
   */
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (comboboxRef.current?.contains(target)) return;
      if (listboxRef.current?.contains(target)) return;
      commitActiveRef.current();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [open]);

  /** Keep the active option on screen when it moves via keyboard. */
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const optionEl = document.getElementById(getOptionId(activeIndex));
    if (optionEl && typeof optionEl.scrollIntoView === "function") {
      optionEl.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex, getOptionId]);

  /**
   * Anchor the portalled listbox under the combobox — a simple
   * getBoundingClientRect anchor; collision handling is deliberately out of
   * scope for the spike (revisit in the ADR).
   */
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = comboboxRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setPopupStyle({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        minWidth: rect.width,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const getOptionProps = useCallback(
    (index: number) => {
      const option = options[index];
      return {
        role: "option" as const,
        id: getOptionId(index),
        "aria-selected": value !== undefined && option?.value === value,
        onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
          // Keep DOM focus on the combobox so blur does not commit early.
          event.preventDefault();
        },
        onClick: () => {
          if (!option || option.disabled) return;
          selectOption(index);
          closePopup();
        },
      };
    },
    [options, value, getOptionId, selectOption, closePopup],
  );

  const labelProps = useMemo(
    () => ({ id: labelId, onClick: () => comboboxRef.current?.focus() }),
    [labelId],
  );

  const comboboxProps = {
    ref: comboboxRef,
    id,
    role: "combobox" as const,
    tabIndex: 0,
    "aria-haspopup": "listbox" as const,
    "aria-expanded": open,
    "aria-labelledby": labelId,
    "aria-controls": listboxId,
    ...(open && activeIndex >= 0
      ? { "aria-activedescendant": getOptionId(activeIndex) }
      : {}),
    onClick: onToggle,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
  };

  const listboxProps = {
    ref: listboxRef,
    id: listboxId,
    role: "listbox" as const,
    tabIndex: -1,
    "aria-labelledby": labelId,
    style: popupStyle,
  };

  return {
    open,
    onOpen,
    onClose,
    value,
    selectedLabel,
    activeIndex,
    labelProps,
    comboboxProps,
    listboxProps,
    getOptionProps,
  };
}
