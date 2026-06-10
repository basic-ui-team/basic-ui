# @basic-ui/tokens

## 0.3.0

### Minor Changes

- e280131: [tokens] improve mergeTheme function for better flexibility and maintainability
- 4eb400d: [core/button] - Added new `Button` component with support for variants, sizes, colors, and loading state. This component is designed to be flexible and accessible, allowing for easy integration into various UI designs. The `Button` component also includes a new `rounded` prop for controlling border radius, enhancing the customization options available to developers.

  [tokens] updated some semantic (error, info, etc) colors to be more consistent with the new design system. These changes may affect the appearance of components that rely on these tokens, so please review the updated token values and adjust your styles accordingly if necessary.

- 1a1b31c: [tokens/themeConfig] Refactored theme config. Color themes are now written as nested objects generated directly from types.

  [tokens] refactored themeToCustomProperties (Renamed to themeToCSSVariables) to handle nested color objects properly.

  [token/themes] move and refactor preset themes into themes folder. Refactored to match new token config. Use tailwind oklch values for color ramps to ensure better colors and accessibility.

  [tokens/scripts] refactored generate-theme-css to generate both css for exporting and token object for programmatic token use.

## 0.2.1

### Patch Changes

- 1f998f5: [lint] Added lint scripts to all packages while simplifying the root configuration. This allows for consistent code quality checks across the entire monorepo and makes it easier for developers to run linting on their code before committing changes. By using ESLint with caching enabled, we can improve the performance of linting by only checking files that have changed since the last linting run, which helps to speed up the development workflow and maintain a clean codebase.

  [typescript] Enforced stronger typing across the codebase by enabling the noImplicitAny TypeScript compiler option and fix resulting errors.

  [accesibility] Brought jsx-a11y rules into package configs and fixed violations across the codebase. This improvement ensures that our components adhere to accessibility best practices, making them more inclusive and usable for all users, including those with disabilities.

## 0.2.0

### Minor Changes

- ce32fac: [tokens/font-size] Add 5xl font-size token and CSS variable --text-5xl; update light preset and FontSizeTokens type to include 5xl.

## 0.1.0

### Minor Changes

- 6484252: \[theme] update border to border-base in theme and update components to use new token

  \[theme] fix failing tests
