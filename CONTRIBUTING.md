# Contributing to basic-ui

We welcome contributions to basic-ui! Whether it's a bug fix, feature, or documentation improvement, your help is appreciated.

## Getting Started

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Create a branch**: `git checkout -b feat/my-feature`
4. **Make your changes** and commit: `git commit -am 'Add my feature'`
5. **Push to your fork** and open a **Pull Request**

## Development Workflow

- **Storybook**: `pnpm storybook` — Visual development environment
- **Tests**: `pnpm test:watch` — Watch tests while developing
- **Linting**: `pnpm lint` — Check and fix code style
- **Type checking**: `pnpm type-check` — Verify TypeScript

## Adding a Component

1. Create a new folder in `packages/core/src/components/{ComponentName}/`
2. Implement:
   - `{ComponentName}.tsx` — Component implementation
   - `{ComponentName}.types.ts` — Prop types (exported from types file)
   - `{ComponentName}.variants.ts` — CVA variants (if visual component)
   - `{ComponentName}.stories.tsx` — Storybook stories
   - `{ComponentName}.test.tsx` — Unit tests
   - `index.ts` — Public exports
3. Add the component to `packages/core/src/index.ts`
4. Add stories showcasing all variants and states

## Component Guidelines

- **Accessibility**: Use semantic HTML, ARIA attributes, and keyboard navigation
- **Props**: Name descriptively, avoid flags that can be inferred
- **Responsiveness**: Support `ResponsiveValue<T>` for breakpoint-based props
- **Dark Mode**: Use semantic color tokens (e.g., `--color-text`, not hardcoded colors)
- **Variants**: Use CVA for type-safe class composition

## PR Requirements

- [ ] Code follows the project style
- [ ] Tests are included and passing
- [ ] TypeScript strict mode passes
- [ ] Storybook stories added for visual components
- [ ] Documentation updated (if applicable)
- [ ] Accessibility checklist reviewed (WCAG 2.1 AA)

## Questions?

Open an issue or start a discussion in the repo!
