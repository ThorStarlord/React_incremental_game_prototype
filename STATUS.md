# Repository Status — Post-M25 Product-Depth Integrated State

**Status date:** 2026-09-11  
**Integrated baseline before this documentation handoff:** `4bed51ce21758e2787afdd16f704f6b74b01964c`  
**M25 Complete Chapter Vertical Slice:** `PASS`  
**Post-M25 GameLoop timing hardening:** `COMPLETE / INTEGRATED`  
**Post-M25 content intelligence:** `COMPLETE / INTEGRATED`  
**Second heterogeneous chapter:** `QUALIFIED / INTEGRATED`  
**Player Insight projections:** `COMPLETE / INTEGRATED`  
**Post-M25 product-depth packages:** `COMPLETE / INTEGRATED`  
**Human Integrated Playability / Product Review:** `DEFERRED / UNPROVEN`  
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
- read-only **Player Insight** projections: Causal Journal, Opportunity Map, and Relationship-Derived Build;
- contextual `Available because` explanations for already-visible dialogue topics, with locked content remaining fail-closed rather than becoming a spoiler list;
- cross-domain semantic use of relationship-derived Traits, including `ScholarlyInsight` in both investigation/Quest and combat contexts while preserving permanent-Trait authority and baseline alternatives;
- player-authored Copy routine priority over the existing M20 production-task allowlist, with explicit `Start Preferred` delegation through existing M20 eligibility and one-active-task authority; no automatic chaining.

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

The package added read-only causal/opportunity/build projections while keeping canonical gameplay authorities unchanged. The CI TypeScript gate was also improved so failure diagnostics are preserved as an artifact without weakening the gate.

### PR #104 — Post-M25 product depth

```text
qualified candidate: a70dec63550774aa6ce81ea8f56722e2c339bd49
Build Validation #331: PASS on exact candidate head
merge commit: 4bed51ce21758e2787afdd16f704f6b74b01964c
```

PR #104 integrated five bounded packages:

1. Rule-of-Two chapter requirement extraction;
2. contextual causal dialogue explanations;
3. cross-domain `ScholarlyInsight` buildcraft qualification;
4. third heterogeneous chapter projection, `Enemies in Phase`;
5. player-authored bounded Copy routine priority and explicit preferred-task start.

The cumulative candidate passed the new product-depth gate, TypeScript, live UI-only smoke, GameLoop timing/backpressure/lifecycle qualification, M20–M25 qualification, modified historical qualification, accumulated M4–M19 regression coverage, and production build.

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
- `specification/Technical/PostM25ImplementationRoadmap.md` reconciles repository-only post-M25 implementation hypotheses with work already delivered;
- older milestone documents remain preserved as evidence and must not silently override current records.

## Evidence ceiling — still unproven

Technical integration does **not** establish:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- causal/terminology legibility for humans;
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
- bounded Copy routine-priority package.

Do not restart these from historical queues merely because an old document still contains unchecked ideas.

## Recommended next priorities

1. **Human Integrated Playability / Product Review when human evidence is available.** This remains the highest-value unresolved product gate: can players understand the causal model, experience route consequences as meaningful, use delegation appropriately, and want to continue?
2. **Product Direction Decision after human evidence.** Decide which emerging identity deserves depth: causal RPG state, relationship-derived capability buildcraft, earned delegation, or another observed strength.
3. **If human validation remains unavailable, reconcile a fresh repository-only or hermetic bottleneck before coding.** Do not continue the completed post-M25 queue by inertia.
4. **Use three heterogeneous chapter cases as the abstraction evidence base.** Any additional generic chapter infrastructure must be justified by concrete repeated friction; chapter count alone is insufficient.
5. **Keep Copy autonomy bounded.** Routine priority is player-authored and explicit; do not infer permission for automatic chaining or irreversible narrative/social/world decisions.
6. **Keep technical stewardship subordinate to real development risk.** CRA/TypeScript/test modernization is valid when it materially improves correctness or development speed, not as a substitute for product direction.

## Fast re-entry checklist

```text
1. Pull and verify latest main.
2. Read STATUS.md.
3. Read docs/CURRENT.md before trusting an older document.
4. Read RUNBOOK.md for exact-head qualification procedure.
5. Use specification/README.md to locate domain-specific current authority.
6. Read PostM25ImplementationRoadmap.md for reconciled post-M25 implementation accounting.
7. Confirm prior packages are closed.
8. Reconcile the current bottleneck and evidence ceiling.
9. Run npm run docs:authority:validate when documentation authority changes.
10. Require exact-head Build Validation before merge.
```

## Governing stop conditions

- Do not infer `M26` from technical green tests; it remains **NOT AUTHORIZED**.
- Do not reintroduce the retired Gemini workflow or `GEMINI_API_KEY` as an implicit merge gate.
- Do not use superseded Checkpoint B/C verdicts as current outcomes.
- Do not introduce tick dropping, skipping, or coalescing as incidental optimization.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not widen M21 offline authority implicitly.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not introduce generalized `ChapterEngine`/narrative DSL or duplicate chapter state without repeated concrete need.
- Do not let Copy priority become automatic task chaining or irreversible player-decision authority.
- Do not infer comprehension, pacing, fairness, fun, retention, Product Direction, or M26 authority from deterministic tests.
