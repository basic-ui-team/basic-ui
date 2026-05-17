import React from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ProviderBuilder, createProviderBuilder } from "./createProviderBuilder";

type Opts = RenderOptions & { builder?: ProviderBuilder };

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Opts,
): RenderResult {
  const builder = options?.builder ?? createProviderBuilder();
  const Wrapper = builder.build();
  return render(ui, { wrapper: Wrapper, ...options });
}

export type { RenderResult };