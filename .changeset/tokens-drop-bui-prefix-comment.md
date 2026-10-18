---
"@basic-ui/tokens": patch
---

Remove the stale `bui:` utility-prefix comment from the generated
`styles/theme.css`. The prefix was a never-implemented design and no code
uses it; the comment misdescribed the published stylesheet. No functional
change to tokens or CSS output.
