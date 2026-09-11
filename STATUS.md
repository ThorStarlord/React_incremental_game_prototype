# Milestone Handoff — Post-M25 GameLoop Timing Hardening

**Handoff date:** 2026-09-11  
**Integrated `main` at handoff:** `88c1b5114995cd6702936f414823b783de97bb23`  
**Milestone state:** `COMPLETE / INTEGRATED / CURRENT-MAIN AUTHORITY`  
**Canonical integration:** PR #97  
**Reconciled candidate head:** `4c503ccaa63147c53a733ac6aad65262adcbb026`  
**Build Validation:** #305 — `PASS` on the exact reconciled candidate head  
**Human product validation:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Purpose

This is the current repository handoff after the post-M25 GameLoop timing-hardening milestone was integrated into `main`.

The milestone is no longer a candidate-only body of work. PR #97 was merged after a fresh reconciliation against the then-current `main` and a full Build Validation pass on the exact reconciled candidate head.

Do not restart Packages 1–3. Future work must reconcile from current `main` and identify a new product or repository bottleneck.

## What is now authoritative on `main`

The integrated post-M25 stack establishes one compatible timing model across:

- deterministic fixed-step scheduling;
- serialized async-consumer backpressure;
- lifecycle remainder semantics;
- large-frame/background-stall characterization;
- mid-session cadence transitions;
- long-horizon cross-progression drift;
- representative Essence, Copy, Player, and timed-Quest progression;
- async rejection/liveness behavior;
- comparison-only timed-Quest floating-point precision handling;
- canonical save/load boundaries;
- M21 bounded offline authority;
- accumulated M4–M25 regression coverage and production build.

### `SERIAL_BACKPRESSURE_V1`

```text
elapsed live logical time
-> accumulator
-> admit at most one fixed step while an async consumer is unresolved
-> advance scheduler state only for admitted work
-> retain excess logical milliseconds in the accumulator
-> no queued per-tick TickData FIFO
-> no drop / skip / coalescing / concurrent consumers
-> fulfillment or rejection releases the admission slot
```

### `FRESH_LOOP_RESET_V1`

| Boundary | Sub-step remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

Timed-Quest precision handling remains comparison-only. Raw and persisted `elapsedSeconds` values are not rounded, clamped, quantized, or rewritten.

M21 remains a separate bounded offline authority. Timed Quests remain online-only during offline settlement.

## Completed package lineage

### Package 1 — Backpressure + Lifecycle Composition

- PR #95 — closed as a superseded cumulative predecessor after #97 merged.
- Candidate head: `b11101273323b3ff242eaf4ccf5f24b4b104c642`.
- Build Validation #300: `PASS`.
- Delivered composition of `SERIAL_BACKPRESSURE_V1` and `FRESH_LOOP_RESET_V1`.

### Package 2 — Unified Timing-Hardening Composition

- PR #96 — closed as a superseded cumulative predecessor after #97 merged.
- Candidate head: `ed1762fabaa99a4bd266b303f9f188579dd7898f`.
- Build Validation #301: `PASS`.
- Composed Package 1 with precision, large-frame, cadence-transition, and long-horizon timing qualification.

### Package 3 / Canonical Cumulative Integration

- PR #97 — **MERGED**.
- Original stress candidate: `87cc91a3410c4dc3e066e5c4c3e58559a180e821`.
- Original Build Validation #302: `PASS`.
- CI-governance cleanup head: `365e250979c96e1ee4b8b71139849687053813e4`.
- Build Validation #304: `PASS` on that head.
- `main` then moved independently to `64ed7f51df141d9655a4aaa19702cb391d824c6c` (`Refine handoff CI failure governance`).
- PR #97 explicitly reconciled that concurrent mainline change without dropping it.
- Final reconciled candidate: `4c503ccaa63147c53a733ac6aad65262adcbb026`.
- Build Validation #305: `PASS` on that exact head.
- Merge commit: `88c1b5114995cd6702936f414823b783de97bb23`.

The Package 3 stress suite qualifies:

1. cadence changes while a real progression consumer remains blocked, with producer lead bounded to one and final elapsed-time progression matching a reference execution;
2. successive backlog windows across different fixed-step sizes without lost/coalesced time or non-contiguous tick identities;
3. async rejection during a cadence transition without retry, deadlock, or concurrent consumers, followed by serial drainage and future live progress.

## CI-governance resolution

The repository's old Gemini AI Code Review workflow was retired as obsolete CI configuration.

PR #97 removed:

- `.github/workflows/gemini-review.yml`;
- `gemini.md`;
- the repository CI dependency on `GEMINI_API_KEY`.

This was not a weakening of repository correctness gates. Existing repository documentation already defined **Build Validation + preregistered acceptance criteria** as merge authority and Gemini review as diagnostic only. Recent all-configured-workflow wording had accidentally promoted the broken external diagnostic into a merge blocker.

Current rule:

```text
MERGE AUTHORITY
= deterministic Build Validation
+ preregistered package / milestone acceptance criteria
+ any separately declared human or external gate that is genuinely authoritative for that change
```

AI review, when used, is advisory. It is not an implicit merge authority.

Historical Gemini `API_KEY_INVALID` runs remain historical evidence explaining why PRs #95–#98 were temporarily left open. They are not current repository blockers.

The GitHub repository secret named `GEMINI_API_KEY`, if it still exists in repository settings, is now unused by repository code and CI. Secret deletion is an account/repository-settings cleanup action and is not required for runtime or CI correctness.

## Superseded handoff

PR #98 documented the pre-integration candidate state and is closed as superseded. Its statement that Gemini was a current external merge blocker is historical, not current authority.

This handoff supersedes that candidate-only state.

## Evidence verified on the final reconciled candidate

Build Validation #305 passed the complete configured stack, including:

- dependency installation;
- synthetic-review protocol validation;
- synthetic-review action-binding rejection checks;
- localhost Playwright UI-only smoke;
- TypeScript type checking;
- GameLoop timing characterization;
- async backlog policy contract qualification;
- bounded backlog production-repair qualification;
- lifecycle remainder qualification;
- large-frame/background-stall qualification;
- mid-session cadence-transition qualification;
- backpressure × cadence × progression stress qualification;
- cross-progression determinism;
- long-horizon drift qualification;
- timed-Quest unit/save compatibility;
- Quest timing integration;
- timed-Quest precision preflight regression and resolution;
- live/offline progression boundary;
- M21 bounded offline progression;
- M20–M25 milestone qualification;
- active-loop and modified historical qualification;
- accumulated M4–M19 baseline;
- production build.

## Evidence ceiling — still unproven

Technical integration does **not** establish:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- pacing quality;
- fairness or balance;
- enjoyment;
- retention / desire to continue;
- final Quest duration/reward/economy tuning;
- generalized campaign/chapter scalability;
- production-device/background behavior outside the qualified envelope;
- Product Direction;
- M26 authorization.

These remain separate human/product authority questions.

## Recommended next priorities

1. **Reconcile product direction before opening another GameLoop timing queue.** The timing-hardening queue is complete and integrated.
2. **Treat human product evidence as a distinct gate when it becomes available.** Repository determinism is not a substitute for comprehension, pacing, fairness, enjoyment, or retention evidence.
3. **Keep optional future timing questions un-authorized until they become real bottlenecks.** Examples include explicit Page Visibility/background handoff policy, persisted scheduler remainder, or wider cadence envelopes.
4. **Preserve M21 boundaries.** Do not reinterpret browser suspension or arbitrary wall-clock absence as offline Quest progression.
5. **Use deterministic CI authority.** Build Validation and explicit acceptance criteria remain the repository merge gate; optional AI review must remain advisory unless a future explicit policy deliberately changes that.

## Governing stop conditions

- Packages 1, 2, and 3 are complete and integrated; do not restart them.
- Do not reopen the retired Gemini workflow merely to reproduce historical process.
- Do not introduce tick dropping, skipping, or coalescing as incidental optimization.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not widen M21 offline authority implicitly.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not infer pacing, fairness, comprehension, fun, retention, Product Direction, or M26 authority from deterministic tests.

## Fast re-entry checklist

```text
1. Read STATUS.md and RUNBOOK.md.
2. Verify latest main; this handoff recorded 88c1b5114995cd6702936f414823b783de97bb23.
3. Treat PR #97 as integrated history, not a pending candidate.
4. Preserve SERIAL_BACKPRESSURE_V1 and FRESH_LOOP_RESET_V1.
5. Preserve comparison-only timed-Quest precision behavior.
6. Preserve M21 as a separate bounded offline authority.
7. Use Build Validation + explicit acceptance criteria as merge authority.
8. Reconcile product direction before inventing another timing package.
9. Do not infer human/product quality from repository qualification.
```
