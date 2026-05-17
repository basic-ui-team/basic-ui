---
"@basic-ui/core": minor
---

[pagination] Deprecate and delete initial, old pagination component and related files.
[pagination] Deprecate and delete old usePagination hook.
[pagination] implement redesigned usePagination hook with new API and improved internal logic.
[pagination] Implement new redesigned LinkPagination, using usePagination hook and common internal view renderer.
[pagination] Implement new redesigned ButtonPagination, using usePagination hook and common internal view renderer.
[pagination] Add new pagination stories and tests for new components.
[test-utils] Add renderWithProvider, renderHookWithProvider and setupUser utils for testing components and hooks that require context providers or user interactions.
[test-utils] Add createProviderBuilder utility for easily creating context providers for testing.
[alert] update tests to use new renderWithProvider test util and remove redundant provider wrappers from individual tests.
[common-props] clean up commonProps jsdoc comments and remove redundant descriptions.
