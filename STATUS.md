# Milestone Handoff — Post-M25 GameLoop Timing Hardening

**Handoff date:** 2026-09-11  
**Current `main` at handoff:** `96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71`  
**Milestone state:** `COMPLETE / REPOSITORY-QUALIFIED / NOT YET INTEGRATED`  
**Canonical cumulative candidate:** PR #97, head `87cc91a3410c4dc3e066e5c4c3e58559a180e821`  
**External merge blocker:** Gemini AI Code Review credential is invalid (`API_KEY_INVALID`)  
**Human product validation:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Purpose

This handoff records the completed three-package post-M25 timing-hardening milestone for future engineers and future chat sessions.

The milestone is technically complete in repository-qualified candidate branches, but it is **not yet current-main authority**. `main` still points to the previous timed-Quest milestone handoff because every package was intentionally left unmerged when the separate Gemini AI Code Review workflow failed its configured external credential.

Do not describe the new scheduler/backpressure/lifecycle/precision/stress behavior as merged or deployed until a cumulative candidate has passed every configured workflow and has actually been integrated into `main`.

## Milestone objective

The work closed the remaining repository-local timing-hardening gaps after M25 by proving one compatible stack across:

- async GameLoop backpressure;
- lifecycle remainder semantics;
- timed-Quest floating-point comparison precision;
- large-frame / background-stall characterization;
- mid-session cadence transitions;
- long-horizon cross-progression drift;
- representative Essence, Copy, Player, and Quest progression;
- rejection/liveness paths;
- M21 live/offline authority boundaries;
- accumulated M4-M25 regressions and production build.

The final cumulative candidate is PR #97. It carries the complete Package 2 tree, and Package 2 already carries Package 1 plus the earlier timing-hardening stack. Therefore PR #97 is the preferred integration candidate once the external CI gate is resolved.

## Work Package Queue — terminal state

- [x] Package 1 — Compose Backpressure + Lifecycle Stack
- [x] Package 2 — Unified Timing-Hardening Composition
- [x] Package 3 — Backpressure × Cadence Progression Stress Qualification

No package from this queue should be restarted in a future session.

## Package 1 — Compose Backpressure + Lifecycle Stack

**Terminal state:** `COMPLETE / REPOSITORY-QUALIFIED / UNMERGED`  
**PR:** #95 — `Compose GameLoop backpressure and lifecycle contracts`  
**Branch:** `work/compose-backpressure-lifecycle`  
**Candidate head:** `b11101273323b3ff242eaf4ccf5f24b4b104c642`  
**Build Validation:** #300 — `PASS`  
**Gemini AI Code Review:** #330 — `FAIL / API_KEY_INVALID`

Package 1 composed the previously independent backlog-policy, production-repair, and lifecycle-policy work onto one exact tree.

### Preserved authorities

`SERIAL_BACKPRESSURE_V1`:

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

`FRESH_LOOP_RESET_V1`:

| Boundary | Sub-step remainder | Wall-time replay |
| --- | --- | --- |
| continuous live execution | preserve | live time only |
| pause/resume | preserve | paused interval rejected |
| stop/start | discard | none |
| unmount/remount | discard | none |
| canonical save/load + fresh mount | discard | none |

Package 1 also promoted the old policy-test incompatibility into a post-repair regression: production must no longer mint queued tick identities behind a blocked async consumer.

### Explicit non-goals

Package 1 did not change default cadence, game speed, save schema, migrations, persisted accumulator state, M21 offline authority, timed-Quest offline behavior, progression formulas, rewards, Quest durations, background policy, or product claims.

## Package 2 — Unified Timing-Hardening Composition

**Terminal state:** `COMPLETE / REPOSITORY-QUALIFIED / UNMERGED`  
**PR:** #96 — `Compose unified post-M25 timing hardening stack`  
**Branch:** `work/unified-timing-hardening-composition`  
**Candidate head:** `ed1762fabaa99a4bd266b303f9f188579dd7898f`  
**Build Validation:** #301 — `PASS`  
**Gemini AI Code Review:** #331 — `FAIL / API_KEY_INVALID`

Package 2 composed Package 1 with the already-qualified timing-hardening line from PR #88.

The resulting exact tree contains:

- `SERIAL_BACKPRESSURE_V1`;
- `FRESH_LOOP_RESET_V1`;
- timed-Quest comparison-only floating-point precision repair;
- long-horizon cross-progression drift qualification;
- large-frame / background-stall characterization;
- mid-session cadence transition qualification;
- existing timed-Quest unit/save/integration qualification;
- M21 live/offline authority qualification;
- M20-M25 and historical regression coverage.

### Important reconciliations

The composed large-frame async test no longer expects all catch-up ticks to be minted ahead of an unresolved consumer. It requires one admitted tick while blocked and eventual deterministic drainage after settlement.

The ordinary 10 -> 20 -> 10 Hz progression case allows each cadence phase to drain before changing cadence, while a separate blocked-consumer case proves that retained milliseconds are re-evaluated against the currently authoritative fixed-step threshold after settlement.

The timed-Quest precision repair remains comparison-only: raw `elapsedSeconds` and persisted values are not rounded, clamped, quantized, or rewritten.

### Explicit non-goals

Package 2 did not add a max-frame catch-up budget, Page Visibility handoff policy, new background/offline semantics, cadence default changes, save-schema changes, authored balance changes, or product-quality claims.

## Package 3 — Backpressure × Cadence Progression Stress Qualification

**Terminal state:** `COMPLETE / REPOSITORY-QUALIFIED / UNMERGED`  
**PR:** #97 — `Qualify backpressure x cadence progression stress`  
**Branch:** `work/backpressure-cadence-progression-stress`  
**Candidate head:** `87cc91a3410c4dc3e066e5c4c3e58559a180e821`  
**Build Validation:** #302 — `PASS`  
**Gemini AI Code Review:** #332 — `FAIL / API_KEY_INVALID`

Package 3 carries forward the exact Package 2 tree and adds only hermetic qualification artifacts. It changes no production mechanics.

### Stress evidence

The new stress suite proves three cross-seam cases that were not established merely by unioning the independent Package 1/2 tests:

1. **Two-second cadence flap behind one blocked real progression consumer.** Cadence changes through 20/5/25/10 Hz and ends at 20 Hz while the first consumer remains unresolved. Producer lead stays bounded to one admission; after settlement, retained logical time drains using the current threshold. Final Essence, Copy, Player, Quest, and GameLoop elapsed state matches equivalent 2000 ms reference progression.
2. **Successive backlog windows across multiple fixed-step sizes.** Deferred time is repeatedly re-evaluated at 20 Hz, 5 Hz, then 20 Hz. Tick identities remain contiguous, async concurrency remains one, and no logical time is dropped or coalesced.
3. **Intentional async rejection during a cadence transition.** The failed tick is not retried; the rejection path logs once; the admission slot is released; retained logical time drains serially; later live ticks continue; no deadlock or concurrent consumer appears.

This package converts the milestone from a collection of compatible-looking tests into one explicit cross-seam stress qualification on the cumulative tree.

## Evidence ledger

### Repository / hermetic evidence verified

- Package 1 exact head `b1110127...` passed Build Validation #300.
- Package 2 exact head `ed1762fa...` passed Build Validation #301.
- Package 3 exact head `87cc91a3...` passed Build Validation #302.
- The Package 3 Build Validation run passed:
  - dependency installation;
  - synthetic-review protocol validation;
  - synthetic-review action-binding negative/rejection checks;
  - localhost Playwright UI-only smoke;
  - TypeScript type checking;
  - GameLoop timing characterization;
  - async backlog policy contract qualification;
  - bounded backlog production-repair qualification;
  - lifecycle remainder qualification;
  - large-frame/background-stall qualification;
  - mid-session cadence transition qualification;
  - the new backpressure × cadence × progression stress suite;
  - cross-progression determinism;
  - long-horizon drift qualification;
  - timed-Quest unit/save compatibility;
  - Quest timing integration;
  - timed-Quest precision preflight regression;
  - timed-Quest precision semantics resolution;
  - live/offline progression boundary;
  - M20-M25 milestone checks;
  - active-loop and modified historical checks;
  - accumulated M4-M19 baseline;
  - production build.
- `SERIAL_BACKPRESSURE_V1` and `FRESH_LOOP_RESET_V1` coexist on one cumulative candidate.
- Deferred milliseconds adopt the current fixed-step threshold after a cadence change rather than preserving stale TickData objects.
- Async consumer rejection releases backpressure without retrying, concurrent execution, or deadlock.
- Representative Essence, Copy, Player, and timed-Quest progression remains elapsed-time consistent under the qualified stress matrix.
- M21 remains a separate explicit offline authority; timed Quests remain online-only during offline settlement.
- Timed-Quest comparison tolerance remains bounded to machine-scale precision handling and does not rewrite raw or persisted timer values.

### External CI evidence / blocker

The separate Gemini AI Code Review workflow failed on all three package heads before producing review output:

- Package 1: Gemini #330 — failure;
- Package 2: Gemini #331 — failure;
- Package 3: Gemini #332 — failure.

The known diagnostic is `API_KEY_INVALID` for the configured Gemini API key.

This is an **EXTERNAL_AUTHORITY** maintenance problem. The milestone intentionally did not repair, replace, expose, or bypass credentials, and it did not weaken the standing rule that every configured workflow must pass before merge.

Therefore Packages 1–3 are **repository-qualified but not merge-qualified** under the current all-CI rule.

## Current-main integration state

At this handoff, `main` remains:

```text
96a87c78b9ff33fa57bd9d8fb2a89cd4776c6a71
```

It does **not** yet contain the cumulative post-M25 timing-hardening tree.

PR #97 is the preferred cumulative integration candidate because it already contains the exact Package 2 tree and Package 3 stress evidence. PR #96 already contains Package 1, so merging #95, then #96, then #97 is not required merely to obtain the final tree.

Do not merge overlapping cumulative candidates in arbitrary order.

## Recommended next priorities

### 1. Resolve the external merge gate as a separate maintenance/authority action

Either:

- repair/replace the configured Gemini credential, then rerun the workflow; or
- make an explicit human policy decision to change the all-configured-CI merge rule.

Do not smuggle either choice into GameLoop mechanics work.

### 2. Integrate the cumulative candidate, not three overlapping copies

If `main` is still `96a87c78...` when the external gate is resolved:

1. use PR #97 as the canonical cumulative candidate;
2. rerun all configured workflows on exact head `87cc91a3...` after the external condition is fixed;
3. merge PR #97 only if every configured workflow succeeds;
4. close #95 and #96 as superseded cumulative predecessors rather than merging duplicate overlapping trees;
5. refresh `STATUS.md`, `README.md`, and `RUNBOOK.md` with the actual merge commit and current-main evidence.

If `main` has moved before integration, do not assume the old candidate remains authoritative. Create a fresh cumulative replay/rebase from the new `main`, preserve the selected contracts, and run the complete exact-head validation stack again.

### 3. Reconcile before opening another repository-local timing queue

This three-package queue is complete. A future session must first inspect latest `main`, open PRs, current `STATUS.md`, and product authority before inventing more timing work.

Potential future repository/hermetic questions are only candidates after reconciliation, for example:

- whether real Page Visibility/background suspension needs an explicit bounded catch-up/handoff policy rather than characterization alone;
- whether any future persisted scheduler remainder requires a new save-schema/provenance contract;
- whether further cadence envelopes beyond currently qualified boundaries are product-authorized and worth supporting.

None of those are implicitly authorized by this milestone.

### 4. Return to human product evidence when available

Technical determinism does not prove:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- pacing quality;
- fairness or balance;
- enjoyment;
- retention / desire to continue;
- final Quest duration/reward/economy tuning;
- production device/background behavior outside the hermetic characterization;
- Product Direction;
- M26 authorization.

These remain separate human/product authority gates.

## Governing stop conditions

- Packages 1, 2, and 3 are complete; do not restart them.
- Do not claim the post-M25 timing-hardening stack is on `main` until a cumulative candidate is actually merged.
- Do not merge overlapping cumulative PRs merely because each repository Build Validation is green.
- Do not bypass the configured external review failure without an explicit authority decision.
- Do not widen M21 offline authority implicitly.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not introduce tick dropping, skipping, or coalescing as an incidental optimization.
- Do not reinterpret browser/background suspension as offline progression without an explicit policy.
- Do not infer pacing, fairness, comprehension, fun, retention, Product Direction, or M26 authority from deterministic technical tests.

## Fast re-entry checklist

```text
1. Read STATUS.md and RUNBOOK.md.
2. Verify current main SHA.
3. Inspect PR #97 and all exact-head workflow results.
4. Treat #97 as the cumulative candidate while main remains on the recorded base.
5. Preserve SERIAL_BACKPRESSURE_V1 and FRESH_LOOP_RESET_V1.
6. Preserve comparison-only timed-Quest precision behavior.
7. Preserve M21 as a separate bounded offline authority.
8. Do not merge until every configured workflow passes, unless an explicit human policy decision changes that rule.
9. After any mainline movement, replay/requalify the cumulative stack rather than assuming stale evidence composes.
10. Do not infer product-quality claims from repository qualification.
```
