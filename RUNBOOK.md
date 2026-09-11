# Repository Runbook

**Current product baseline:** M25 complete chapter + integrated post-M25 timing, content-intelligence, Player Insight, product-depth, decision-readiness preparation, and chapter-definition integrity  
**Integrated implementation baseline before this handoff:** `5bdf808154a62bdb85c1bee55777f9be35f1395e`

This file owns **operational procedure**. Read [`STATUS.md`](STATUS.md) for current repository state and [`docs/CURRENT.md`](docs/CURRENT.md) before interpreting older documentation.

## Required re-entry order

```text
latest main
-> STATUS.md
-> docs/CURRENT.md
-> RUNBOOK.md
-> specification/README.md
-> affected current contract/result documents
-> issue #109 when Product Direction or human evidence is relevant
-> fresh bottleneck reconciliation
```

Do not restart a historical work queue without first proving that its bottleneck is current.

## Environment

Repository CI uses Node.js 20.

```bash
npm ci
npx tsc --noEmit
npm run build
```

## Verify current main

```bash
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
```

When qualifying a branch against current `main`, verify ancestry explicitly:

```bash
git fetch origin
git merge-base --is-ancestor origin/main HEAD
```

If that command fails because `main` moved, reconcile the branch and rerun the authoritative workflow on the new exact head.

## Documentation authority qualification

Run whenever documentation authority, handoff state, CI governance, or top-level entrypoints change:

```bash
npm run docs:authority:validate
```

The validator checks the required authority vocabulary and entrypoints, keeps important current/superseded records represented, confirms Build Validation contains the authority gate, and rejects silent restoration of retired `.github/workflows/gemini-review.yml` or `gemini.md`.

The former Gemini review workflow is retired. `GEMINI_API_KEY` is not consumed by repository CI and is not a current merge dependency.

## Authoritative CI and exact-head merge rule

Executable authority:

```text
.github/workflows/build-validation.yml
```

Current merge rule:

```text
Build Validation
+ preregistered package/milestone acceptance criteria
+ any separately declared authoritative human/external gate for that change
```

For a PR, watch the checks:

```bash
gh pr checks <PR_NUMBER> --watch
```

Then verify the candidate that passed is still the PR head:

```bash
gh pr view <PR_NUMBER> --json headRefOid
```

A green run is merge authority only for the **exact-head** candidate it qualified. If the PR head or `main` changes, reconcile and requalify before merge.

## Core local validation

```bash
npm ci
npm run docs:authority:validate
npm run content:intelligence:validate
npm run chapter:validate
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

`chapter:validate` is already included at the tail of `content:intelligence:validate`; running it separately is useful when diagnosing chapter-definition/reference integrity.

Build Validation remains the final executable truth because it also runs the live UI-only smoke and the repository's focused milestone/technical qualifications.

## Focused post-M25 qualification

### Content intelligence and chapter-definition integrity

```bash
npm run content:intelligence:validate
npm run chapter:validate
```

`content:intelligence:validate` includes the existing authoring-integrity, reachability, route-tracing checks and the focused chapter-definition qualification.

The chapter validator checks current projections for:

- duplicate chapter IDs;
- duplicate route IDs within a chapter;
- empty route requirements;
- duplicate requirements;
- dangling Relationship Experience requirements;
- dangling completed-dialogue requirements.

Completed-dialogue validation must mirror the same bounded source set composed by runtime NPC initialization:

```text
public/data/dialogues.json
public/data/m24-world-state-content.json -> dialogues
public/data/m25-chapter-content.json -> dialogues
```

Do not simplify the validator back to `dialogues.json` alone: Build Validation #335 demonstrated that doing so falsely marks valid M25 conclusion IDs as dangling. The runtime-aligned repair passed exact-head Build Validation #336.

Use the route tracer commands documented in the content-intelligence contract when diagnosing authored conclusion paths.

### Second heterogeneous chapter

```bash
CI=true npm test -- --watchAll=false --runInBand PostM25SecondChapterQualification.test.ts
```

Archive Inquiry remains the qualified second chapter; this test no longer asserts that only two chapter definitions may ever exist. Use `selectChapterProgress(state, 'archive_inquiry')`; the old Archive-specific selector has been removed.

### Player Insight

```bash
CI=true npm test -- --watchAll=false --runInBand PostM25PlayerInsightsQualification.test.ts
```

### Product-depth package set

```bash
CI=true npm test -- --watchAll=false --runInBand \
  PostM25RuleOfTwoChapterArchitecture.test.ts \
  PostM25ContextualCausalLegibility.test.ts \
  PostM25CrossDomainTraitBuildcraft.test.ts \
  PostM25ThirdHeterogeneousChapterQualification.test.ts \
  PostM25CopyRoutineStrategy.test.ts
```

The package set qualifies bounded Rule-of-Two chapter requirement extraction, spoiler-safe contextual dialogue causality, cross-domain semantic Trait buildcraft, the `Enemies in Phase` third heterogeneous chapter projection, and player-authored Copy routine priority with explicit `Start Preferred` execution and no automatic chaining.

The workflow preserves a failure-only `product-depth-diagnostics` artifact when this combined gate fails; the gate itself still fails and must not be bypassed.

## Synthetic player-facing review tooling

Static/rejection contracts:

```bash
npm run simulated-review:validate
npm run simulated-review:action-contract
```

UI-only live smoke prerequisites:

```bash
npx playwright install --with-deps chromium
```

Terminal 1:

```bash
HOST=127.0.0.1 PORT=3000 BROWSER=none npm start
```

Terminal 2:

```bash
npm run simulated-review:smoke
```

Do not use Redux inspection, local-storage inspection, debug injection, repository state, or source content as a player oracle when collecting synthetic player-facing evidence.

Synthetic observation is **not** human Product Review evidence and must not be used to close issue #109.

## TypeScript diagnostics

Build Validation intentionally preserves TypeScript output as a failure-only `tsc-diagnostics` artifact before enforcing the type-check gate. This makes compiler failures inspectable without weakening the gate.

Local equivalent:

```bash
npx tsc --noEmit
```

## Focused GameLoop timing qualification

### Scheduler characterization

```bash
CI=true npm test -- --watchAll=false --runInBand useGameLoop.timing-characterization.test.tsx
```

### Async backpressure

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopAsyncTickBacklogPolicyContract.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBoundedBacklogControlRepair.test.tsx
```

Expected authority remains `SERIAL_BACKPRESSURE_V1`: at most one unresolved admitted tick, retained logical milliseconds, no queued TickData FIFO, no drop/skip/coalescing, and no concurrent async consumers.

### Lifecycle remainder

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopSubStepRestartSaveResumePreflight.test.tsx GameLoopLifecycleRemainderPolicy.test.ts
```

Expected authority remains `FRESH_LOOP_RESET_V1`: continuous execution and pause/resume preserve the sub-step remainder; stop/start, unmount/remount, and save/load into a fresh mount discard it; paused wall time is not replayed.

### Large-frame, cadence, stress, and drift

```bash
CI=true npm test -- --watchAll=false --runInBand GameLoopLargeFrameBackgroundStallPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopMidSessionCadenceTransitionQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopBackpressureCadenceProgressionStressQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopProgressionDeterminism.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLongHorizonCrossProgressionDrift.test.tsx
```

These do not authorize a max-frame budget, Page Visibility policy, new cadence default, persisted scheduler remainder, or wider offline policy.

## Timed-Quest and offline qualification

```bash
CI=true npm test -- --watchAll=false --runInBand QuestTimerUnitCompatibilityPreflight.test.ts
CI=true npm test -- --watchAll=false --runInBand GameLoopQuestTimingIntegrationQualification.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionPreflight.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopTimedQuestPrecisionResolution.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopLiveOfflineBoundary.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
```

Timed-Quest precision remains comparison-only. Do not round, clamp, quantize, or rewrite raw/persisted timer values. M21 remains a bounded offline authority; timed Quests remain online-only during offline settlement.

## Milestone / baseline regression commands

```bash
CI=true npm test -- --watchAll=false --runInBand M25CompleteChapterVerticalSlice.test.tsx
CI=true npm test -- --watchAll=false --runInBand M24ObjectiveWorldState.test.tsx
CI=true npm test -- --watchAll=false --runInBand M23FactionReputation.test.tsx
CI=true npm test -- --watchAll=false --runInBand M22SocialKnowledgePropagation.test.tsx
CI=true npm test -- --watchAll=false --runInBand CheckpointCIncrementalIntegrationRepair.test.tsx
CI=true npm test -- --watchAll=false --runInBand GameLoopM21OfflineProgress.test.ts
CI=true npm test -- --watchAll=false --runInBand CopyM20ProductionTaskAutomation.test.tsx
CI=true npm test -- --watchAll=false --runInBand ActiveRpgLoopIntegrationRepair.test.tsx
```

For the accumulated M4-M19 and modified-historical command lists, use `.github/workflows/build-validation.yml` as executable authority rather than copying stale command sets from older milestone documents.

## Human Product Review gate

Issue #109 is the explicit unresolved Human Integrated Playability / Product Review authority surface.

Repository automation may prepare the build, record prompts/questions, preserve provenance, and reconcile documentation. It may **not** invent participant observations, score human comprehension, claim enjoyment, or close the gate.

The eventual human review should test the decision-discriminating questions in `specification/Technical/PostM25ProductDirectionDecisionReadiness.md`. Only after genuine evidence is recorded should a Product Direction Decision be authored.

Until then:

```text
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

## Documentation change procedure

When a package creates, supersedes, or materially reinterprets authority:

```text
1. Update/create the domain-specific contract or result.
2. Update docs/CURRENT.md classification in the same package or final handoff.
3. Update STATUS.md when repository state or an evidence/authority gate changes.
4. Update RUNBOOK.md when commands, CI, or operating procedure changes.
5. Keep README.md concise and navigational.
6. Update specification/README.md when the domain authority chain changes.
7. Preserve old evidence; prefer classification over destructive relocation.
8. Run npm run docs:authority:validate.
9. Open PR and require exact-head Build Validation.
10. If main moves, reconcile and rerun exact-head Build Validation.
11. Merge only after current-base qualification succeeds.
```

## Product evidence boundary

Repository and hermetic validation may establish deterministic behavior, composition, rejection paths, persistence behavior, and bounded synthetic evidence. They do **not** by themselves establish fresh-player comprehension, pacing, fairness, enjoyment, retention, final balance, generalized campaign scalability, final Product Direction, or M26 authorization.

## Do-not-cross boundaries

- Do not bypass `docs/CURRENT.md` when interpreting old documentation.
- Do not reintroduce the retired Gemini workflow as an implicit merge gate.
- Do not use the legacy `ArchitectureOverview.md` manual-only testing statement as current CI authority.
- Do not widen M21 offline authority implicitly.
- Do not make timed Quests advance during offline settlement implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not introduce drop/skip/coalescing as incidental backpressure optimization.
- Do not weaken `chapter:validate` by ignoring runtime dialogue-extension sources.
- Do not introduce a generalized `ChapterEngine`, narrative DSL, or duplicate chapter state without repeated concrete need.
- Do not let Copy routine priority become automatic task chaining or irreversible narrative/social/world authority.
- Do not fabricate human Product Review evidence.
- Do not infer pacing, fairness, comprehension, enjoyment, retention, Product Direction, or M26 authority from deterministic execution.
