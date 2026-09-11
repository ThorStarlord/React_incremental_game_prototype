# Repository Status — Post-M25 Integrated State

**Status date:** 2026-09-11  
**Baseline `main` before this documentation-authority reconciliation:** `56fbee2758ba734f1db67f40230a0970d67fd531`  
**Product authority:** `M25 Complete Chapter Vertical Slice = PASS`  
**Post-M25 timing hardening:** `COMPLETE / INTEGRATED`  
**Human product validation:** `DEFERRED / UNPROVEN`  
**Product Direction Decision:** `PENDING`  
**M26:** `NOT AUTHORIZED`

## Role of this file

`STATUS.md` is the current-state authority for the repository. It answers:

- what is complete and integrated;
- what contracts are currently binding;
- what evidence exists;
- what remains unproven or unauthorized;
- what work must not be restarted;
- what decision should happen next.

For documentation classification and supersession, read [`docs/CURRENT.md`](docs/CURRENT.md). For commands and integration procedure, read [`RUNBOOK.md`](RUNBOOK.md). For domain-specific technical authority, read [`specification/README.md`](specification/README.md).

Do not use this file as a substitute for the detailed domain contracts linked by those indexes.

## Current repository state

The automated implementation program through M25 is complete. The later post-M25 GameLoop timing-hardening work is also integrated on `main`.

The current technical stack includes a compatible model across:

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

## Integration evidence

The canonical post-M25 timing-hardening integration is **PR #97**.

```text
final reconciled candidate: 4c503ccaa63147c53a733ac6aad65262adcbb026
Build Validation #305: PASS on exact candidate head
merge commit: 88c1b5114995cd6702936f414823b783de97bb23
```

The final integrated milestone handoff is **PR #99**.

```text
documentation candidate: fd5c5dc1f3cf1c328c778474891bc41d2e96114e
Build Validation #306: PASS on exact candidate head
merge commit: 56fbee2758ba734f1db67f40230a0970d67fd531
```

PRs #95 and #96 were closed as superseded cumulative predecessors after #97 integrated their work. PR #98 was closed as a superseded pre-integration handoff.

The detailed lineage remains historical evidence; it is no longer an active work queue.

## CI and merge authority

The former Gemini AI Code Review workflow and standalone `gemini.md` instructions were retired in PR #97. Repository CI no longer consumes `GEMINI_API_KEY`.

Current merge authority is:

```text
MERGE AUTHORITY
= deterministic Build Validation
+ preregistered package / milestone acceptance criteria
+ any separately declared human or external gate that is genuinely authoritative for that change
```

AI review, when used, is advisory unless a future explicit policy deliberately changes its status.

Historical Gemini `API_KEY_INVALID` runs explain prior blocked PRs but are not current repository blockers.

The documentation-authority reconciliation adds a deterministic `npm run docs:authority:validate` check to prevent the top-level documentation hierarchy and retired Gemini surfaces from silently drifting.

## Documentation authority

The repository now uses four explicit classifications:

```text
CURRENT AUTHORITY
REFERENCE
HISTORICAL EVIDENCE
SUPERSEDED
```

[`docs/CURRENT.md`](docs/CURRENT.md) is the canonical classification index.

Important consequences:

- `README.md` is orientation, not final technical authority;
- this `STATUS.md` owns current repository/milestone state;
- `RUNBOOK.md` owns operating and qualification procedure;
- `specification/README.md` maps domain-specific technical/product authority;
- older milestone and analysis documents remain preserved as evidence instead of being physically moved or silently rewritten;
- explicitly superseded verdicts must not be used to drive new implementation.

## Evidence ceiling — still unproven

Technical integration does **not** establish:

- fresh-player comprehension or discoverability;
- perceived responsiveness;
- pacing quality;
- fairness or final balance;
- enjoyment;
- retention / desire to continue;
- final Quest duration/reward/economy tuning;
- generalized campaign/chapter scalability;
- production-device/background behavior outside the qualified envelope;
- a final Product Direction decision;
- M26 authorization.

These remain separate human/product authority questions.

The current `PostM25ProductDirection.md` document contains hypotheses and the human-review boundary; it does not itself authorize M26.

## Completed work that must not be restarted

The following queues are closed:

- M4–M25 automated implementation program;
- timed-Quest unit normalization and integration qualification;
- timed-Quest comparison-only precision repair;
- post-M25 GameLoop backpressure/lifecycle/timing-hardening Packages 1–3;
- Gemini CI retirement and merge-authority reconciliation;
- pre-integration post-M25 handoff represented by PR #98.

A new package must begin from a fresh reconciliation of current `main`, not from an unchecked old queue.

## Recommended next priorities

1. **Reconcile Product Direction before opening another GameLoop timing queue.** The timing-hardening work is complete and integrated.
2. **Use the documentation authority chain during every new-session recon.** Start with `STATUS.md`, then `docs/CURRENT.md`, `RUNBOOK.md`, and `specification/README.md`.
3. **Treat human product evidence as a separate gate when available.** Deterministic repository evidence is not a substitute for comprehension, pacing, fairness, enjoyment, or retention evidence.
4. **If human validation is unavailable, continue only with a newly justified repository-only or hermetic bottleneck.** Keep all experiential claims explicitly unproven.
5. **Keep optional future timing questions unauthorized until they become real bottlenecks.** Examples include Page Visibility/background handoff policy, persisted scheduler remainder, or wider cadence envelopes.
6. **Preserve M21 boundaries.** Do not reinterpret browser suspension or arbitrary wall-clock absence as offline Quest progression.

## Fast re-entry checklist

```text
1. Pull and verify latest main.
2. Read STATUS.md.
3. Read docs/CURRENT.md and classify any old document before relying on it.
4. Read RUNBOOK.md for exact operating/CI procedure.
5. Use specification/README.md to locate domain-specific current authority.
6. Confirm old work packages are closed before proposing new work.
7. Reconcile the real active bottleneck.
8. State the evidence ceiling for the new package.
9. Run npm run docs:authority:validate when documentation authority changes.
10. Require exact-head Build Validation before merge.
```

## Governing stop conditions

- Do not restart completed post-M25 timing Packages 1–3.
- Do not reintroduce the retired Gemini workflow as an implicit merge gate.
- Do not use `specification/Technical/ArchitectureOverview.md` testing/CI statements as current authority; its manual-only testing claim is superseded.
- Do not use the first weak Checkpoint B/C verdicts as current outcomes; their later repairs and reruns supersede those verdicts.
- Do not introduce tick dropping, skipping, or coalescing as incidental optimization.
- Do not persist GameLoop accumulator remainder without a new persistence/schema contract.
- Do not widen M21 offline authority implicitly.
- Do not rewrite stored Quest timer values to solve floating-point comparison noise.
- Do not infer pacing, fairness, comprehension, fun, retention, Product Direction, or M26 authority from deterministic tests.
