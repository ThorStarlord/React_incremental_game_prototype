# Post-M25 Chapter Definition Integrity Repair

**Status:** COMPLETE / INTEGRATED — repository-only repair package  
**Prepared:** 2026-09-11  
**Integrated:** 2026-09-11  
**Authority source:** `PostM25ThreeChapterFrictionAudit.md`  
**Qualified candidate:** `458d1fead28fea3e92c33db5e8baee319d55c3ed`  
**Build Validation:** `#336` — PASS on exact candidate head  
**Merge commit:** `5bdf808154a62bdb85c1bee55777f9be35f1395e`  
**Human product-quality evidence:** NOT IN SCOPE / UNPROVEN  
**Product Direction Decision:** PENDING  
**M26:** NOT AUTHORIZED

## Purpose

This record closes the three repairs authorized by the three-chapter friction audit. The package strengthens chapter authoring integrity and removes mechanical API/type duplication without introducing new runtime chapter authority.

## R1 — Derive chapter identity from canonical definitions

`ChapterId` is derived from the literal `id` values in `CHAPTER_DEFINITIONS` rather than maintained as a second handwritten union.

This removes one synchronization point while retaining compile-time chapter identity.

No registry framework, dynamic loader, reducer, save root, or chapter engine was introduced.

## R2 — Generic chapter-definition integrity qualification

`ChapterDefinitionIntegrity.test.ts` validates the current chapter definitions against the same bounded authored source set used by runtime initialization and includes rejection coverage for:

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

### Runtime-aligned dialogue catalogue

The chapter validator indexes completed-dialogue IDs from the bounded source set that runtime NPC initialization composes:

```text
public/data/dialogues.json
public/data/m24-world-state-content.json -> dialogues
public/data/m25-chapter-content.json -> dialogues
```

This matters because Merchant District completion is projected from M25 conclusion dialogue IDs rather than only the base dialogue catalogue.

## R3 — Keep chapter progress API generic

The historical `selectArchiveInquiryChapterProgress` convenience export is removed. Archive Inquiry qualification uses:

```text
selectChapterProgress(state, 'archive_inquiry')
```

matching the generic selector used by later chapter projections.

No generated selector registry or chapter service layer was introduced.

## Qualification history

### First candidate — diagnostic failure

Build Validation `#335` failed at the new chapter-integrity tail of `content:intelligence:validate`.

The failure exposed a **validator/catalogue mismatch**, not invalid authored chapter content: the first implementation indexed completed-dialogue IDs only from `public/data/dialogues.json`, while runtime initialization also merges the bounded M24 and M25 dialogue-extension bundles. The valid M25 conclusion IDs therefore appeared dangling to the incomplete validator.

The repair aligned the validator with the runtime source set and added regression assertions for:

```text
valerius_m25_public_order_conclusion
gronk_m25_quiet_network_conclusion
```

No chapter content was weakened or rewritten to make the validator pass.

### Exact-head qualification

Candidate:

```text
458d1fead28fea3e92c33db5e8baee319d55c3ed
```

Build Validation `#336` passed on that exact head, including:

- documentation authority;
- content intelligence including `chapter:validate`;
- second heterogeneous chapter;
- Player Insight;
- post-M25 product-depth package set;
- synthetic review contracts;
- TypeScript;
- live UI-only smoke;
- GameLoop timing, backpressure, lifecycle, cadence, stress, drift, Quest precision, and live/offline boundaries;
- M20–M25 qualifications;
- active-loop and modified historical qualification;
- accumulated M4–M19 baseline;
- production build.

The candidate was merged by PR #108 as:

```text
5bdf808154a62bdb85c1bee55777f9be35f1395e
```

## Closed repair scope

The audit-authorized repairs are complete:

```text
R1 derive ChapterId from CHAPTER_DEFINITIONS       COMPLETE
R2 chapter-definition integrity + chapter:validate COMPLETE
R3 generic chapter progress selector surface       COMPLETE
```

Do not treat this closed package as authorization for further chapter abstraction. A generalized `ChapterEngine`, narrative DSL, chapter reducer/save root, dynamic chapter registry, or per-chapter service layer still requires new concrete repeated friction.

## Evidence ceiling

This repair establishes stronger authoring/reference integrity and lower chapter-maintenance duplication across the current projections. It does **not** establish fresh-player comprehension, causal terminology comprehension, pacing, fairness, enjoyment, retention, final Product Direction, or M26 authorization.
