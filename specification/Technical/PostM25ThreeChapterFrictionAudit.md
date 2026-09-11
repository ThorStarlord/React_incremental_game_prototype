# Post-M25 Three-Chapter Repository Friction Audit

**Status:** CURRENT AUTHORITY for this bounded repository-only audit
**Audited:** 2026-09-11
**Human product evidence:** NOT IN SCOPE / UNPROVEN
**M26:** NOT AUTHORIZED

## Purpose

Inspect repeated implementation and authoring friction across the three existing chapter-scale projections before adding more content or generic infrastructure.

This is a repository audit, not a gameplay experiment. Chapter count alone is not evidence for a ChapterEngine or narrative DSL.

## Cases inspected

- Merchant District Crisis: two routes driven primarily by completed-dialogue evidence.
- Archive Inquiry: two routes driven by shared and divergent Relationship Experience evidence.
- Enemies in Phase: one route driven by Relationship Experience evidence.

The inspected path is `ChapterDefinitions.ts` -> `ChapterRequirements.ts` -> `ChapterSelectors.ts` -> `PlayerInsightSelectors.ts`, together with chapter qualification tests, relationship/dialogue content, and the existing content-intelligence tooling.

## Finding F1 — Chapter identity is duplicated manually

`ChapterDefinitions.ts` declares a manual `ChapterId` union and separately repeats the same IDs in `CHAPTER_DEFINITIONS`.

With three chapters, every new chapter requires synchronized identity edits in two places. This is mechanical duplication rather than meaningful authority.

**Authorized repair R1:** derive `ChapterId` from the literal IDs in `CHAPTER_DEFINITIONS`.

Do not introduce a registry framework or dynamic chapter loader.

## Finding F2 — Chapter references are outside the generic content-integrity check

The content-intelligence model scans `public/data/**/*.json`. Chapter requirements are authored in TypeScript, so their `requiredExperienceIds` and `requiredCompletedDialogueIds` are outside that graph.

The current chapters reference Merchant District conclusion dialogue IDs plus Elara and Lyra Relationship Experience IDs. Chapter-specific tests cover some of these paths, but no generic qualification guarantees that every chapter requirement resolves to canonical authored content.

A typo or content rename can therefore leave a route syntactically valid but impossible to complete.

**Authorized repair R2:** add a generic chapter-definition integrity qualification that checks:

- unique chapter IDs;
- unique route IDs within each chapter;
- at least one requirement per route;
- no duplicate requirements in a route;
- every required Experience ID exists in relationship content;
- every required completed-dialogue ID exists in dialogue content.

Expose it as `npm run chapter:validate`. Build Validation executes it at the tail of `content:intelligence:validate`, immediately after the JSON content-intelligence checks.

Do not create a generalized condition language or duplicate content graph.

## Finding F3 — One historical selector creates unnecessary per-chapter API surface

`ChapterSelectors.ts` already exposes `selectChapterProgress(state, chapterId)`, but it also retains `selectArchiveInquiryChapterProgress(state)`. The convenience selector is only used by the Archive Inquiry qualification test; the third chapter already uses the generic selector.

**Authorized repair R3:** update the Archive Inquiry test to use `selectChapterProgress` and remove the one-off selector.

Do not replace it with generated per-chapter selectors or a chapter service layer.

## Findings deliberately not promoted

The Opportunity Map currently matches route requirements and route progress by array order. Both are derived from the same chapter definition order, and no independent reordering or defect is present. No repair is justified.

The chapters contain different useful structural constants. Their heterogeneity is intentional; no generic route-segment abstraction is justified.

Chapter tests contain small content-specific fixture duplication. It is not yet costly enough to justify a test framework.

No inspected friction requires a ChapterEngine, chapter state machine, new save root, or narrative DSL.

## Authorized repair package

Only these repairs are authorized by this audit:

```text
R1 derive ChapterId from CHAPTER_DEFINITIONS
R2 generic chapter-definition integrity qualification + chapter:validate + CI gate
R3 remove the Archive-specific selector and use the generic selector
```

Anything beyond this package requires new evidence.

## Qualification requirements

The repair must include positive and rejection coverage for chapter-definition integrity, preserve the existing chapter and Player Insight qualifications, pass TypeScript, and pass full Build Validation on the exact candidate head.

## Evidence ceiling

Successful repair can prove stronger authoring integrity and reduced maintenance duplication across the current chapter projections. It cannot prove human comprehension, pacing, enjoyment, fairness, retention, final Product Direction, or M26 authorization.