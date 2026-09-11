# Milestone Handoff — GC-01 / Campaign One 1.0 Completion

**Handoff status:** INTEGRATED / CURRENT-MAIN AUTHORITY  
**Prepared:** 2026-09-11  
**Integrated implementation baseline:** `ff829ce6ee4da8a693adfb783fe843775403326d`  
**Current maturity:** PLAYABLE PRE-ALPHA  
**Next unsatisfied completion responsibility:** GC-02 Prologue / onboarding

## Repository reality

The implementation delivered in this milestone is GC-01 — 1.0 player-surface scope cleanup.

Implementation evidence:

```text
PR:                  #117
branch:              work/gc01-player-surface-scope-cleanup
qualified head:      caabc1581316dab33f7eeb98dac9b32072ec57df
Build Validation:    #343 / run 34629859287 / PASS
merge commit:        ff829ce6ee4da8a693adfb783fe843775403326d
merge status:        MERGED
```

Because PR #117 is merged, GC-01 is **INTEGRATED / CURRENT-MAIN AUTHORITY**.

## Package accounting

The session-level Work Package Queue originally contained three causally ordered packages. Repository evidence does not support claiming that all three were implemented.

```text
[x] Package 1 — Integrate Qualified GC-01 Candidate
    Result: COMPLETE / INTEGRATED

[ ] Package 2 — GC-02 Prologue / Onboarding Vertical Path
    Result: NOT EXECUTED / CARRIED FORWARD

[ ] Package 3 — GC-03 Chapters 1–3 Production Spine
    Result: NOT EXECUTED / CARRIED FORWARD
```

The one-package-per-turn stop rule prevented GC-02 and GC-03 from being started in the GC-01 integration turns. They remain genuine Version 1.0 work; this handoff does not mark them complete by inference.

## What GC-01 delivered

GC-01 closes the first post-transition 1.0 player-surface requirement:

- separate generic Skills no longer appear as an implemented Campaign One player surface;
- generic Crafting no longer appears as an implemented Campaign One player surface;
- general Inventory remains deferred rather than advertised as required 1.0 progression;
- duplicate save-management navigation is removed as a false second persistence authority;
- the Main Menu remains the canonical New Game / Continue / Load / Import / Export / delete persistence surface;
- legacy/deferred IDs remain interpretable for compatibility;
- unknown or cut `/game/*` legacy destinations fail closed to Dashboard;
- focused positive and rejection qualification is available through `npm run gc01:validate`.

GC-01 does not add a skill tree, crafting system, inventory economy, second save model, new progression authority, or persistence-schema change.

## CI and integration triage

### Implementation PR #117

The exact implementation head `caabc1581316dab33f7eeb98dac9b32072ec57df` passed Build Validation #343 before merge. No implementation CI failure remains to classify.

### Follow-up documentation PR #118

PR #118 (`work/gc01-integration-status`, head `50e8bbf3f91a4ad4bd388756e9c8e99264d95570`) was created only to reconcile stale post-merge authority text. Its Build Validation #344 was observed in `queued` state with no conclusion.

That state is **not a CI failure** and therefore is not classified as IMPLEMENTATION_FAILURE, RELEVANT_ENVIRONMENT_FAILURE, OBSOLETE_CI_CONFIGURATION, NON_REQUIRED_AUXILIARY_FAILURE, or HUMAN_PRODUCT_DECISION.

The repository's `main` branch currently has no branch-protection required-check configuration, but repository operating policy still requires a green exact-head Build Validation before merging a candidate. This handoff preserves that stricter repository policy.

This consolidated handoff supersedes the narrower purpose of PR #118; do not treat #118 as implementation authority.

## Authoritative CI

The active workflow is:

```text
.github/workflows/build-validation.yml
```

It intentionally triggers on pull requests and runs on `ubuntu-latest` with Node.js 20. It includes documentation authority, GC-01 rejection/acceptance checks, content intelligence, TypeScript, live synthetic UI smoke, GameLoop timing/backpressure/lifecycle regressions, timed-Quest and offline-boundary qualification, historical milestone regression suites, and the production build.

No active CI failure in this milestone was found that requires classification or cleanup. Retired Gemini/API-key review history must not be resurrected as current authority unless repository authority explicitly changes.

## Local qualification commands

Use these before opening or updating a completion-program PR:

```bash
npm ci
npm run docs:authority:validate
npm run gc01:validate
npm run content:intelligence:validate
npm run chapter:validate
npm run m26:validate
npm run simulated-review:validate
npm run simulated-review:action-contract
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

For exact CI parity, use `.github/workflows/build-validation.yml` as executable truth rather than copying a historical milestone command list.

## Human evidence boundary

Issue #109 remains OPEN / UNPROVEN.

Repository automation can prove routing/configuration behavior and deterministic technical composition. It cannot establish:

- fresh-player comprehension or discoverability;
- onboarding quality;
- pacing;
- fairness or final balance;
- enjoyment or emotional impact;
- retention or desire to continue;
- market preference.

Those claims remain human evidence and become required for Beta/final player-quality qualification under the current completion contracts.

## Recommended next milestone priorities

1. **GC-02 — Prologue / onboarding:** create the smallest ordinary-UI fresh-save path from New Game to a clear objective, first meaningful anchor relationship interaction, active player action, visible persistent consequence, Chapter 1 entry, and save/load survival.
2. **GC-03 — Chapters 1–3 production spine:** connect Prologue -> Merchant District Crisis -> Archive Inquiry -> Enemies in Phase through existing canonical evidence without introducing a generic ChapterEngine, chapter reducer, or narrative DSL.
3. **Then reconcile GC-04 / GC-05 against actual campaign evidence:** audit current relationship-derived capabilities and mastered routines before creating any standalone buildcraft or delegation feature work. Let chapter content satisfy those floors where it naturally does so.

Do not reopen GameLoop/tick-rate hardening, Skills, Crafting, general Inventory, duplicate Saves, generalized simulation, Chapters 8+, interplanetary continuation, or New Game+ merely because further improvement is possible. A new package requires a named 1.0 completion gap or demonstrated blocker.

## Re-entry sequence

Future engineers and chat sessions should start with:

```text
latest main
-> STATUS.md
-> HANDOFF.md
-> docs/CURRENT.md
-> specification/GameCompletionDefinition.md
-> specification/Features/FeatureScopeMatrix.md
-> specification/Progression/GameProgressionArc.md
-> specification/Narrative/CampaignArchitecture.md
-> specification/Technical/GameCompletionRoadmap.md
-> relevant Alpha/Beta/Release contract
-> RUNBOOK.md
-> fresh repository reconciliation
```

## Stop condition for this handoff

This handoff records GC-01 as integrated and preserves GC-02 as the next unsatisfied Version 1.0 responsibility. It does not authorize or implement GC-02 inside the documentation milestone.
