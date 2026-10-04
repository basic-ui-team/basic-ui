import { useCallback, useState } from "react";

/**
 * Props accepted by useControllableState.
 *
 * `value`/`onChange` make the state controlled; omitting `value` makes it
 * uncontrolled, seeded from `defaultValue`.
 */
export type UseControllableStateProps<T> = {
  /** Controlled value. When provided, the state always reflects it. */
  value?: T;
  /** Initial value for the uncontrolled mode. */
  defaultValue?: T;
  /**
   * Called on every state change, in both controlled and uncontrolled modes.
   * In controlled mode the callback receives the next value the caller asked for.
   */
  onChange?: (value: T, ...eventArgs: unknown[]) => void;
};

export type UseControllableStateResult<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T), ...eventArgs: unknown[]) => void,
];

/**
 * Implement the controlled/uncontrolled value pattern once, for every
 * stateful primitive.
 *
 * - With `value` provided (controlled): the returned value always mirrors it,
 *   and `onChange` is invoked with the requested next value. Calling the
 *   setter without `onChange` is a developer error and warns in development.
 * - Without `value` (uncontrolled): the state is kept internally, seeded from
 *   `defaultValue`, and `onChange` is invoked on every change.
 *
 * @example
 * const [open, setOpen] = useControllableState({
 *   value: props.open,
 *   defaultValue: false,
 *   onChange: props.onOpenChange,
 * });
 */
export function useControllableState<T>(
  props: UseControllableStateProps<T>,
): UseControllableStateResult<T> {
  const { value: valueProp, defaultValue, onChange } = props;
  const [internalValue, setInternalValue] = useState<T | undefined>(() =>
    valueProp !== undefined ? valueProp : defaultValue,
  );

  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : (internalValue as T);

  const setValue = useCallback(
    (next: T | ((prev: T) => T), ...eventArgs: unknown[]) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(value) : next;

      if (onChange) {
        onChange(resolved, ...eventArgs);
      } else if (process.env.NODE_ENV !== "production" && controlled) {
        console.warn(
          "useControllableState: a component is changing a controlled prop without providing an onChange handler. " +
            "Add an onChange callback or switch to uncontrolled usage.",
        );
      }

      if (!controlled) {
        setInternalValue(resolved);
      }
    },
    [controlled, onChange, value],
  );

  return [value, setValue];
}
