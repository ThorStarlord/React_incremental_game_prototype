# Repository Status — Post-M25 Decision-Readiness Integrated State

**Status date:** 2026-09-11  
**Current integrated implementation baseline:** `5bdf808154a62bdb85c1bee55777f9be35f1395e`  
**M25 Complete Chapter Vertical Slice:** `PASS`  
**Post-M25 GameLoop timing hardening:** `COMPLETE / INTEGRATED`  
**Post-M25 content intelligence:** `COMPLETE / INTEGRATED`  
**Second heterogeneous chapter:** `QUALIFIED / INTEGRATED`  
**Player Insight projections:** `COMPLETE / INTEGRATED`  
**Post-M25 product-depth packages:** `COMPLETE / INTEGRATED`  
**Product Direction decision-readiness package:** `COMPLETE / INTEGRATED`  
**Three-chapter friction audit:** `COMPLETE / CLOSED`  
**Chapter-definition integrity repairs:** `COMPLETE / INTEGRATED`  
**Human Integrated Playability / Product Review:** `OPEN HUMAN AUTHORITY GATE / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Role of this file

`STATUS.md` is the current-state authority for the repository. It answers what is integrated, which contracts are binding, what evidence exists, what remains unproven, what work must not be restarted, and what decision should happen next.

Read [`docs/CURRENT.md`](docs/CURRENT.md) for documentation classification and supersession, [`RUNBOOK.md`](RUNBOOK.md) for operating and qualification procedure, and [`specification/README.md`](specification/README.md) for the domain authority chain.

## Current repository state

The automated implementation program through M25 is complete. The later GameLoop timing-hardening milestone is complete and integrated. Subsequent post-M25 repository-only evolution has also been integrated without introducing a generalized chapter engine, narrative condition DSL, duplicate chapter state, or autonomous irreversible Copy planning.

The repository now includes:

- deterministic fixed-step GameLoop scheduling, serialized async backpressure, lifecycle remainder semantics, long-horizon timing qualification, comparison-only timed-Quest precision handling, and bounded M21 offline authority;
- developer-side content integrity, dependency/reachability analysis, route tracing, and negative authoring self-tests;
- three heterogeneous chapter-scale projections over existing domain authorities: **Merchant District Crisis**, **Archive Inquiry**, and **Enemies in Phase**;
- a bounded shared chapter-requirement evaluator extracted by the Rule of Two, rather than a `ChapterEngine`;
- chapter identity derived from canonical definitions rather than duplicated manually;
- generic chapter-definition integrity qualification for unique chapter/route identity, non-empty/non-duplicate requirements, and valid Relationship Experience / completed-dialogue references;
- a chapter validator whose completed-dialogue catalogue mirrors the bounded runtime source set: base dialogues plus M24/M25 dialogue extensions;
- read-only **Player Insight** projections: Causal Journal, Opportunity Map, and Relationship-Derived Build;
- contextual `Available because` explanations for already-visible dialogue topics, with locked content remaining fail-closed rather than becoming a spoiler list;
- cross-domain semantic use of relationship-derived Traits, including `ScholarlyInsight` in both investigation/Quest and combat contexts while preserving permanent-Trait authority and baseline alternatives;
- player-authored Copy routine priority over the existing M20 production-task allowlist, with explicit `Start Preferred` delegation through existing M20 eligibility and one-active-task authority; no automatic chaining;
- a Product Direction Decision Readiness record comparing causal legibility, relationship-derived buildcraft, earned delegation, and heterogeneous composition without prematurely choosing a final product identity.

## Current technical invariants

### `SERIAL_BACKPRESSURE_V1`

```text
elapsed live logical time
-> accumulator
-> admit at most one fixed step while an async consumer is unresolved
-> advance scheduler state only for admitted work
-> retain excess logical milliseconds
-> no queued per-tick FIFO
-> no drop / skip / coalescing / concurrent consumers
-> fulfillment or rejection releases admission
```

### `FRESH_LOOP_RESET_V1`

| Boundary | Sub-step remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

Timed-Quest precision remains comparison-only. Raw and persisted timer values are not rounded or rewritten. M21 remains a bounded offline allowlist; timed Quests remain online-only during offline settlement.

## Post-M25 integration evidence

### PR #101 — Content intelligence and reachability

Integrated developer-side content auditing, causal dependency/reachability tooling, route tracing, and deterministic negative self-tests. No generalized runtime condition language was introduced.

### PR #102 — Second heterogeneous chapter

`Archive Inquiry` demonstrated a second structurally different chapter-scale composition derived from existing Elara Relationship evidence. It introduced no chapter reducer, save root, or `ChapterEngine`.

### PR #103 — Player Insight projections

```text
qualified candidate: 8b0c8481dfc067a068b7fc1f52b239deb2c50182
Build Validation #327: PASS on exact candidate head
merge commit: bc03919c8eb43244bebdbdc37ef926464d98e0c8
```

### PR #104 — Post-M25 product depth

```text
qualified candidate: a70dec63550774aa6ce81ea8f56722e2c339bd49
Build Validation #331: PASS on exact candidate head
merge commit: 4bed51ce21758e2787afdd16f704f6b74b01964c
```

PR #104 integrated bounded Rule-of-Two chapter requirements, contextual causal dialogue explanations, cross-domain `ScholarlyInsight` buildcraft, the `Enemies in Phase` third heterogeneous chapter, and player-authored Copy routine priority.

### PR #106 — Closed post-M25 implementation roadmap

The former six-package post-M25 queue is a closed implementation record rather than a future backlog. Future sessions must not restart it by inertia.

### PR #107 — Product Direction decision readiness + three-chapter friction audit

```text
merge commit before PR #108: 75dbd0d2b8de8610a29196324c237c3c6044e299
```

PR #107 created the current Product Direction decision-preparation record and audited all three chapter projections for repeated repository friction. The audit authorized exactly three repairs: derive chapter identity, add generic chapter-definition integrity qualification, and remove the one-off Archive progress selector.

### PR #108 — Chapter-definition integrity repairs

```text
first candidate: 5fb3edfc9f70f7ecd9ed8f645a078fdb281402c5
Build Validation #335: FAIL at newly added chapter integrity validation
root cause: validator indexed base dialogues but omitted bounded M24/M25 runtime dialogue extensions

qualified candidate: 458d1fead28fea3e92c33db5e8baee319d55c3ed
Build Validation #336: PASS on exact candidate head
merge commit: 5bdf808154a62bdb85c1bee55777f9be35f1395e
```

The repair corrected the validator catalogue rather than weakening chapter requirements or rewriting authored content. Build Validation #336 passed documentation authority, content intelligence including `chapter:validate`, heterogeneous chapter qualification, Player Insight, product-depth, TypeScript, live UI-only smoke, the complete timing/progression stack, M20–M25, historical regressions, accumulated M4–M19, and production build.

## Documentation authority

The repository uses four explicit classifications:

```text
CURRENT AUTHORITY
REFERENCE
HISTORICAL EVIDENCE
SUPERSEDED
```

[`docs/CURRENT.md`](docs/CURRENT.md) is the canonical classification index.

Important consequences:

- `README.md` is orientation, not final technical authority;
- `STATUS.md` owns current repository/milestone truth;
- `RUNBOOK.md` owns operating and qualification procedure;
- `specification/README.md` maps domain-specific technical/product authority;
- `specification/Technical/PostM25ProductDirectionDecisionReadiness.md` owns bounded Product Direction preparation, not the final Product Direction decision;
- `specification/Technical/PostM25ImplementationRoadmap.md` is a closed program record;
- `specification/Technical/PostM25ThreeChapterFrictionAudit.md` is a closed audit record whose R1–R3 repairs are integrated;
- `specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md` is the integrated result authority for that repair;
- older milestone documents remain evidence and must not silently override current records.

## Evidence ceiling — still unproven

Technical integration does **not** establish:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- causal/terminology legibility for humans;
- whether relationship-derived capabilities feel meaningfully learned from characters;
- whether Copy delegation feels like earned mastery rather than lost play;
- pacing quality;
- fairness or final balance;
- enjoyment;
- retention / desire to continue;
- final Quest duration/reward/economy tuning;
- generalized campaign scalability;
- production-device/background behavior outside the qualified envelope;
- a final Product Direction decision;
- M26 authorization.

The repository has stronger deterministic evidence about composition and bounded behavior than it has human product evidence. That evidence ceiling is intentional and must remain explicit.

## Completed work that must not be restarted

The following queues are closed unless a fresh regression or new bottleneck provides evidence to reopen them:

- M4–M25 automated implementation program;
- post-M25 GameLoop timing-hardening Packages 1–3;
- Gemini CI retirement and merge-authority reconciliation;
- post-M25 content-intelligence package;
- second heterogeneous chapter qualification;
- Player Insight projection package;
- Rule-of-Two requirement extraction;
- contextual causal dialogue package;
- cross-domain Trait-buildcraft qualification package;
- third heterogeneous chapter projection;
- bounded Copy routine-priority package;
- post-M25 roadmap reconciliation;
- Product Direction decision-readiness documentation package;
- three-chapter friction-audit R1–R3 repair queue;
- chapter-definition integrity repair package.

Do not restart these from historical queues merely because an older document still contains ideas or pre-integration wording.

## Current unresolved gate and next priorities

The only pre-declared product gate that remains intentionally unresolved is **issue #109 — Human Integrated Playability / Product Review**. It requires genuine fresh human evidence; repository tests and synthetic UI observation must not be relabeled as human validation.

When human review becomes available, use it to discriminate between the candidate product identities documented in `PostM25ProductDirectionDecisionReadiness.md`:

1. causal RPG / causal legibility;
2. relationship-derived capability buildcraft;
3. earned delegation / incremental mastery;
4. heterogeneous content composition as enabling architecture.

After genuine evidence is recorded, create an explicit Product Direction Decision that states the selected primary promise, supporting identities, evidence/counter-evidence, what to deepen, what to hold, what to stop expanding, and whether a new milestone is authorized.

Until then:

- Product Direction remains `PENDING`;
- M26 remains `NOT AUTHORIZED`;
- no large new product feature queue should be inferred from technical green tests;
- if repository-only work continues before human evidence, it must start from a fresh concrete bottleneck rather than this closed queue.

## Fast re-entry checklist

```text
1. Pull and verify latest main.
2. Read STATUS.md.
3. Read docs/CURRENT.md before trusting an older document.
4. Read RUNBOOK.md for exact-head qualification procedure.
5. Use specification/README.md to locate domain-specific current authority.
6. Confirm the post-M25 implementation and chapter-integrity queues are closed.
7. Check issue #109 for genuine Human Integrated Playability / Product Review evidence.
8. If no human evidence exists, keep Product Direction PENDING and M26 NOT AUTHORIZED.
9. Run npm run docs:authority:validate when documentation authority changes.
10. Require exact-head Build Validation before merge.
```

## Governing stop conditions

- Do not infer `M26` from technical green tests; it remains **NOT AUTHORIZED**.
- Do not fabricate or simulate human Product Review evidence.
- Do not reintroduce the retired Gemini workflow or `GEMINI_API_KEY` as an implicit merge gate.
- Do not use superseded Checkpoint B/C verdicts as current outcomes.
- Do not introduce tick dropping, skipping, or coalescing as incidental optimization.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not widen M21 offline authority implicitly.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not introduce generalized `ChapterEngine`/narrative DSL or duplicate chapter state without repeated concrete need.
- Do not let Copy priority become automatic task chaining or irreversible player-decision authority.
- Do not infer comprehension, pacing, fairness, fun, retention, Product Direction, or M26 authority from deterministic tests.
