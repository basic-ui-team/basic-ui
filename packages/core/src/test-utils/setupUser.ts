import userEvent from "@testing-library/user-event";

export function setupUser(options?: Parameters<typeof userEvent.setup>[0]) {
  return userEvent.setup(options);
}
