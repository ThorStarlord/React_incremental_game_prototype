# Post-M25 Chapter Definition Integrity Repair

**Status:** CANDIDATE — repository-only repair package
**Prepared:** 2026-09-11
**Authority source:** `PostM25ThreeChapterFrictionAudit.md`
**Human product-quality evidence:** NOT IN SCOPE / UNPROVEN
**Product Direction Decision:** PENDING
**M26:** NOT AUTHORIZED

## Purpose

Implement only the three repairs authorized by the three-chapter friction audit. The package strengthens chapter authoring integrity and removes mechanical API/type duplication without introducing new runtime chapter authority.

## R1 — Derive chapter identity from canonical definitions

`ChapterId` is derived from the literal `id` values in `CHAPTER_DEFINITIONS` rather than maintained as a second handwritten union.

This removes one synchronization point while retaining compile-time chapter identity.

No registry framework, dynamic loader, reducer, save root, or chapter engine is introduced.

## R2 — Generic chapter-definition integrity qualification

`ChapterDefinitionIntegrity.test.ts` validates the current chapter definitions against canonical relationship/dialogue content and includes rejection coverage for:

- duplicate chapter IDs;
- duplicate route IDs within a chapter;
- routes with no requirement;
- duplicate requirements within a route;
- dangling Relationship Experience IDs;
- dangling completed-dialogue IDs.

The focused command is:

```bash
npm run chapter:validate
```

`content:intelligence:validate` invokes this focused qualification after the existing JSON content-intelligence checks, so the authoritative Build Validation workflow exercises it without creating a second parallel CI system.

## R3 — Keep chapter progress API generic

The historical `selectArchiveInquiryChapterProgress` convenience export is removed. Archive Inquiry qualification now uses:

```text
selectChapterProgress(state, 'archive_inquiry')
```

matching the generic selector already used by later chapter projections.

No generated selector registry or chapter service layer is introduced.

## Acceptance criteria

The package is acceptable only when the exact candidate head passes:

1. current documentation authority qualification;
2. `content:intelligence:validate`, including `chapter:validate`;
3. second and third heterogeneous chapter qualifications;
4. Player Insight and product-depth qualification;
5. TypeScript;
6. live UI smoke and existing GameLoop/progression gates;
7. modified historical and accumulated M4–M19 regressions;
8. production build.

Until that exact-head qualification passes and the PR is merged, this document remains a candidate record rather than integrated-result evidence.

## Evidence ceiling

This repair can establish stronger authoring/reference integrity and lower chapter-maintenance duplication. It cannot establish fresh-player comprehension, causal terminology comprehension, pacing, fairness, enjoyment, retention, final Product Direction, or M26 authorization.