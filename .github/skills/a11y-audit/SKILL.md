---
name: a11y-audit
description: "Accessibility (WCAG 2.1 Level AA) audit for components and pages."
argument-hint: "Component/page path or feature name (e.g., Alert.tsx, pagination)"
user-invocable: true
---

# Accessibility Audit Skill

Audits components or pages for accessibility compliance against WCAG 2.1 Level AA standards. Identifies issues with keyboard navigation, color contrast, ARIA attributes, focus management, and other accessibility concerns.

## Quick Start

Use this skill to:

- **Review component code** for accessibility issues
- **Verify keyboard navigation** works across all interactive elements
- **Check color contrast** ratios for text and UI components
- **Validate ARIA attributes** and roles
- **Test focus management** and tab order
- **Ensure screen reader compatibility**

## Common Use Cases

1. **Component Development** - Audit new components before shipping to catch accessibility issues early
2. **Code Review** - Run accessibility checks during PR review to maintain standards
3. **Accessibility Improvements** - Identify and fix accessibility gaps in existing components
4. **Team Onboarding** - Help new developers understand accessibility best practices

## What Gets Checked

The audit verifies compliance with WCAG 2.1 Level AA guidelines across four key areas:

- **Perceivable**: Content is visible and distinguishable (contrast, text alternatives)
- **Operable**: Full keyboard navigation, visible focus indicators, sufficient timing
- **Understandable**: Clear language, consistent navigation, helpful error messages
- **Robust**: Compatible with assistive technologies and various user agents

See [reference.md](./reference.md) for detailed WCAG guidelines and external resources.
