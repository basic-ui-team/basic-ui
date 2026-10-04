---
"@basic-ui/core": patch
---

Decouple Card anatomy parts from sibling-component imports per the component composition rule (#60, completes #87).

- `Card.Title`, `Card.Description` and `Card.Image` no longer wrap the public `Header`, `Text` and `Image` components; each renders on `Box` with styling owned by new `cardTitleVariants`, `cardDescriptionVariants` and `cardImageFitVariants` in `card.variants.ts`, with visual parity to the previous defaults
- `card.types.ts` now defines the parts' prop types (`CardTitleOwnProps`, `CardDescriptionOwnProps`, `CardImageOwnProps`) instead of re-exporting `HeaderProps`/`TextProps`/`ImageProps` — the exported `CardTitleProps`/`CardDescriptionProps`/`CardImageProps` aliases and the `Card.Title`/`Card.Description`/`Card.Image` APIs are unchanged
- Every component in `core` now imports only `Box`; the composition check runs fully strict with no grandfathered violations
