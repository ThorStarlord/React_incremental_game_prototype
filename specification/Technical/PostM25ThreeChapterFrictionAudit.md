# Post-M25 Three-Chapter Repository Friction Audit

**Status:** COMPLETE / CLOSED — current historical authority for this bounded audit  
**Audited:** 2026-09-11  
**Resolution:** R1–R3 implemented and integrated by PR #108  
**Repair result:** `PostM25ChapterDefinitionIntegrityRepair.md`  
**Human product evidence:** NOT IN SCOPE / UNPROVEN  
**Product Direction Decision:** PENDING  
**M26:** NOT AUTHORIZED

## Purpose

This audit inspected repeated implementation and authoring friction across the three existing chapter-scale projections before adding more content or generic infrastructure.

It was a repository audit, not a gameplay experiment. Chapter count alone was not treated as evidence for a ChapterEngine or narrative DSL.

## Cases inspected

- Merchant District Crisis: two routes driven primarily by completed-dialogue evidence.
- Archive Inquiry: two routes driven by shared and divergent Relationship Experience evidence.
- Enemies in Phase: one route driven by Relationship Experience evidence.

The inspected path was `ChapterDefinitions.ts` -> `ChapterRequirements.ts` -> `ChapterSelectors.ts` -> `PlayerInsightSelectors.ts`, together with chapter qualification tests, relationship/dialogue content, and the existing content-intelligence tooling.

## Finding F1 — Chapter identity was duplicated manually

`ChapterDefinitions.ts` declared a manual `ChapterId` union and separately repeated the same IDs in `CHAPTER_DEFINITIONS`.

With three chapters, every new chapter required synchronized identity edits in two places. This was mechanical duplication rather than meaningful authority.

**Authorized repair R1:** derive `ChapterId` from the literal IDs in `CHAPTER_DEFINITIONS`.

**Resolution:** COMPLETE / INTEGRATED by PR #108. No registry framework or dynamic chapter loader was introduced.

## Finding F2 — Chapter references were outside the generic content-integrity check

The original content-intelligence model scans `public/data/**/*.json`. Chapter requirements are authored in TypeScript, so their `requiredExperienceIds` and `requiredCompletedDialogueIds` were outside that graph.

The current chapters reference Merchant District conclusion dialogue IDs plus Elara and Lyra Relationship Experience IDs. Chapter-specific tests covered some paths, but no generic qualification guaranteed that every chapter requirement resolved to canonical authored content.

A typo or content rename could therefore leave a route syntactically valid but impossible to complete.

**Authorized repair R2:** add a generic chapter-definition integrity qualification that checks:

- unique chapter IDs;
- unique route IDs within each chapter;
- at least one requirement per route;
- no duplicate requirements in a route;
- every required Experience ID exists in relationship content;
- every required completed-dialogue ID exists in the bounded runtime dialogue catalogue.

Expose it as `npm run chapter:validate`; Build Validation executes it at the tail of `content:intelligence:validate`.

**Resolution:** COMPLETE / INTEGRATED by PR #108. The final validator mirrors the bounded dialogue source set composed by runtime initialization: base dialogues plus the M24 and M25 extension bundles. No generalized condition language or duplicate content graph was created.

## Finding F3 — One historical selector created unnecessary per-chapter API surface

`ChapterSelectors.ts` already exposed `selectChapterProgress(state, chapterId)`, but it also retained `selectArchiveInquiryChapterProgress(state)`. The convenience selector was only used by the Archive Inquiry qualification test; the third chapter already used the generic selector.

**Authorized repair R3:** update the Archive Inquiry test to use `selectChapterProgress` and remove the one-off selector.

**Resolution:** COMPLETE / INTEGRATED by PR #108. No generated per-chapter selectors or chapter service layer was introduced.

## Findings deliberately not promoted

The Opportunity Map currently matches route requirements and route progress by array order. Both are derived from the same chapter definition order, and no independent reordering or defect was present. No repair was justified.

The chapters contain different useful structural constants. Their heterogeneity is intentional; no generic route-segment abstraction was justified.

Chapter tests contain small content-specific fixture duplication. It was not costly enough to justify a test framework.

No inspected friction required a ChapterEngine, chapter state machine, new save root, or narrative DSL.

## Closed repair package

The only repairs authorized by this audit were:

```text
R1 derive ChapterId from CHAPTER_DEFINITIONS             COMPLETE
R2 generic integrity + chapter:validate + CI integration COMPLETE
R3 remove Archive-specific selector                      COMPLETE
```

PR #108 qualified exact head `458d1fead28fea3e92c33db5e8baee319d55c3ed` in Build Validation #336 and merged as `5bdf808154a62bdb85c1bee55777f9be35f1395e`.

This queue is now **closed**. Anything beyond it requires new evidence rather than reopening these findings by inertia.

## Evidence ceiling

The completed repair proves stronger authoring integrity and reduced maintenance duplication across the current chapter projections. It cannot prove human comprehension, pacing, enjoyment, fairness, retention, final Product Direction, or M26 authorization.
