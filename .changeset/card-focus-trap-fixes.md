---
"@basic-ui/core": patch
"@basic-ui/react-utilities": patch
---

Fix Card keyboard and disabled interactions, including click handlers on
unstyled links. Disabled Card links no longer expose an href or enter the
tab order, and keyboard activation uses native click events.

Fix nested focus traps so the outer trap resumes when an inner trap unmounts,
including traps activated after a deferred mount.
