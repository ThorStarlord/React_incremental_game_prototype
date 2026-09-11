# Post-M25 Rule-of-Two Chapter Architecture

**Status:** REPOSITORY-ONLY / HERMETIC QUALIFICATION  
**Human product evidence:** UNPROVEN  
**ChapterEngine introduced:** No

## Result

Merchant District Crisis and Archive Inquiry repeat one concrete implementation need: chapter-scale presentation must evaluate existing Relationship Experience and completed-dialogue evidence in more than one selector.

The smallest justified abstraction is therefore `ChapterRequirements.ts`, which normalizes only the two requirement kinds already present in both chapter definitions and evaluates them against their canonical domain authorities.

```text
ChapterRouteDefinition
-> listChapterRouteRequirements
-> isChapterRequirementSatisfied
-> chapter progress / opportunity projection
```

The helper owns no canonical state, reducer, persistence field, authoring language, transition system, or autonomous progression.

## Explicit non-result

Two chapters do **not** justify:

- a `ChapterEngine`;
- a chapter reducer;
- chapter-local completion flags;
- a generalized condition DSL;
- a new save-schema root;
- autonomous route selection.

Any future abstraction must be justified by new repeated friction rather than by chapter count alone.

## Qualification

`PostM25RuleOfTwoChapterArchitecture.test.ts` verifies that both existing chapter shapes normalize through the helper, that canonical evidence remains the source of truth, that partial evidence still derives `in_progress`, and that both chapter and Player Insight projections consume the shared helper.
