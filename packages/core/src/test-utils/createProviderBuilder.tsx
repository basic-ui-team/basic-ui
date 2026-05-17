import React from "react";

type WrapperComponent = React.FC<{ children?: React.ReactNode }>;

export function createProviderBuilder() {
  const wrappers: WrapperComponent[] = [];

  const api = {
    withTheme<T = any>(themeValue: T, ThemeContext = React.createContext<T | undefined>(undefined)) {
      const ThemeProvider: WrapperComponent = ({ children }) => (
        <ThemeContext value={themeValue}>{children}</ThemeContext>
      );
      wrappers.push(ThemeProvider);
      return api;
    },

    withCustom(wrapper: WrapperComponent) {
      wrappers.push(wrapper);
      return api;
    },

    build(): WrapperComponent {
      return function CompositeProvider({ children }) {
        return wrappers.reduceRight<React.ReactNode>((acc, W) => <W>{acc}</W>, children) as React.ReactElement;
      };
    },
  } as const;

  return api;
}

export type ProviderBuilder = ReturnType<typeof createProviderBuilder>;
