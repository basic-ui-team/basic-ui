---
name: bui-component-markdown
description: "Create, edit, and maintain markdown documentation for UI components, documenting in a style suitable for Astro SSG markdown rendering. Supports generating templates and filling out component-specific details."
user-invocable: true
---

# Basic UI Component Markdown Documentation

Create and maintain the user-facing documentation in `.docs/components` for Basic UI components, headless hooks, utilities, and related UI primitives. Write for developers using the library, not for its maintainers.

## Documentation goals

- Explain what the item is for and show how to use it; do not turn the guide into an API dump.
- Include useful behavior and constraints, but omit implementation details, design deliberations, and engineering chatter.
- Keep the structure and tone consistent across guides while allowing sections and examples to vary when the item needs them.
- Describe only behavior verified in the current source and tests. Do not invent props, defaults, accessibility behavior, or usage patterns.

## Page boundaries

- Write one guide per component, headless hook, or utility.
- Keep a compound component or related set of components in one guide when users generally use them together (for example, `Card` or `Pagination`). Explain the shared behavior and clearly distinguish each part's API where needed.
- Do not split a guide into separate pages merely because the implementation has multiple files or exports.

## Standard guide structure

Use this order as the default:

1. **Title and introduction** — identify the component or utility and briefly explain its purpose. Follow the introduction immediately with a small, representative basic example, including the package import when helpful.
2. **API** — document the public props/options that users need to configure or understand. Use a readable table with the name, type, default (when applicable), and concise description.
3. **Examples** — show practical usage patterns, similar to the project's Storybook stories. Give each example a descriptive heading and explain behavior that is not obvious from the code.

Add or reorder sections such as accessibility, usage guidance, or related hooks only when they answer a real user question. Avoid empty or boilerplate sections. For compound guides, organize the API and examples by subcomponent when that is clearer.

## API guidance

- Document the component's own relevant props, not every inherited DOM attribute. Mention that standard HTML/React props are accepted when useful, rather than listing them all.
- When props are inherited from a shared prop group, link to its guide instead of duplicating a long API table. Use the repository's existing documentation link conventions and verify that the target exists.
- If a component inherits layout props or common props, link to the relevant layout/common-props guide when available. If no guide exists, document only the relevant inherited props needed to use the component and do not create a speculative link.
- Hook options that are small and directly relevant may be documented inline in the component guide to keep the user journey in one place. This can drift from the hook's own documentation; verify the inline details against the hook source whenever either guide changes.
- Make defaults and required values explicit. Use types and terminology consistent with the exported API.

## Examples and source verification

- Prefer examples that demonstrate real user tasks and meaningful variations, matching existing Storybook stories where possible.
- Keep snippets focused and valid in the documented framework. Include imports and state setup when needed to make an example understandable.
- Before writing or changing a guide, inspect the relevant component/hook/utility source, exported types, tests, and Storybook stories as appropriate. Treat the implementation and tests as authoritative; stories are examples, not proof of every API detail.
- Link to related guides and source/story files only when those links are useful and their paths are correct.
- Use the Markdown and code-fence conventions supported by the Astro documentation site. Prefer straightforward headings, tables, and fenced examples over custom formatting.

