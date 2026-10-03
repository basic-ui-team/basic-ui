import { renderHook, RenderHookOptions } from "@testing-library/react";
import { createProviderBuilder, ProviderBuilder } from "./createProviderBuilder";

type Opts<TProps> = RenderHookOptions<TProps> & { builder?: ProviderBuilder };

export function renderHookWithProviders<TProps, TResult>(
  hook: (props: TProps) => TResult,
  options?: Opts<TProps>,
) {
  const builder = options?.builder ?? createProviderBuilder();
  const Wrapper = builder.build();
  return renderHook(hook, { wrapper: Wrapper, ...options });
}
