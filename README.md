# basic-ui

An accessible, extensible, and approachable React component library built for ease of use and customization.

## Overview

**basic-ui** is a modern design system and component library designed with three core principles:

- **Approachable**: Simple, semantic APIs with great TypeScript support
- **Extensible**: Fully theemable token system with first-class customization
- **Accessible**: WCAG 2.1 AA compliance built into every component

## Monorepo Structure

```
basic-ui/
├── packages/
│   ├── core/              # React components and hooks
│   ├── tokens/            # Design tokens and theming system
│   └── icons/             # Icon registry
├── apps/
│   ├── storybook/         # Component development environment
│   └── docs/              # Documentation website (Astro + Starlight)
└── .github/workflows/     # CI/CD pipelines
```

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **Package Manager** (any of the following):
  - **pnpm** >= 9 (recommended for monorepo speed)
  - **npm** >= 9
  - **yarn** >= 3.6

### Install Dependencies

**With pnpm (recommended):**

```bash
pnpm install
```

**With npm:**

```bash
npm install
```

**With yarn:**

```bash
yarn install
```

> **Note**: We use Turbo for task orchestration, which works identically across all package managers.

### Development

Start the Storybook dev server:

```bash
pnpm storybook
```

Run type checking:

```bash
pnpm type-check
```

> **Package Manager:** Replace `pnpm` with `npm run` or `yarn` if using npm/yarn (e.g., `npm run storybook`). See [PACKAGE_MANAGERS.md](./PACKAGE_MANAGERS.md) for detailed comparison and setup guidance.

### Build

Build all packages:

```bash
pnpm build
```

Build individual packages:

```bash
pnpm build:core
pnpm build:tokens
pnpm build:icons
```

### Testing

```bash
pnpm test              # Run tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
pnpm test:ui          # Vitest UI
```

### Linting

```bash
pnpm lint
```

## Packages

### `@basic-ui/core`

React components, hooks, and utilities for building user interfaces.

- 27+ accessible, production-ready components
- Responsive prop system (`ResponsiveValue<T>`)
- Dark mode support
- Built with CVA for type-safe variants

### `@basic-ui/tokens`

Design tokens and theming system.

- Semantic color tokens
- Spacing, typography, and radius scales
- Motion and elevation tokens
- Extensible `createTheme()` function
- Tailwind CSS preset

### `@basic-ui/icons`

Icon registry with tree-shakeable exports.

- Lucide-based SVG icons
- Semantic sizing and color variants
- Built-in accessibility

## Documentation

- **[Getting Started](./apps/docs)** — Installation and setup
- **[Theming Guide](./apps/docs/docs/theming)** — Customize colors, spacing, typography
- **[Component APIs](./apps/docs/docs/components)** — Prop reference for all components
- **[Recipes](./apps/docs/docs/recipes)** — Common patterns and examples
- **[Accessibility](./apps/docs/docs/accessibility)** — WCAG compliance and best practices
- **[Conventions](./.docs/guides/CONVENTIONS.md)** — Coding and file naming conventions

## License

MIT

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Made with ❤️ for developers who value simplicity and extensibility.**
