# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current state

The automated implementation program through **M25 — Complete Chapter Vertical Slice** is complete and qualified. The later post-M25 GameLoop timing-hardening milestone is also **complete and integrated**: deterministic fixed-step scheduling, serialized async backpressure, lifecycle remainder semantics, cadence/large-frame characterization, long-horizon drift qualification, timed-Quest precision handling, persistence boundaries, and M21 bounded offline authority coexist on `main`.

```text
M25 Complete Chapter Vertical Slice: PASS
Post-M25 GameLoop Timing Hardening: COMPLETE / INTEGRATED
Human Integrated Playability / Product Review: DEFERRED / UNPROVEN
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

Repository qualification proves bounded technical behavior. It does **not** prove player comprehension, pacing, fairness, enjoyment, retention, final balance, or Product Direction.

## Documentation map

Do not infer authority from file age, folder depth, or detail. The repository contains substantial historical qualification material.

Read in this order:

1. [`STATUS.md`](STATUS.md) — current repository state, completed work, open gates, and next decisions.
2. [`docs/CURRENT.md`](docs/CURRENT.md) — canonical documentation classification: **CURRENT AUTHORITY / REFERENCE / HISTORICAL EVIDENCE / SUPERSEDED**.
3. [`RUNBOOK.md`](RUNBOOK.md) — setup, validation, CI, exact-head qualification, and integration procedure.
4. [`specification/README.md`](specification/README.md) — technical/product authority map and domain-specific source chain.
5. Specific contract/result documents linked from those indexes.

`README.md` is intentionally an orientation surface. It is not the final authority for disputed implementation, product, or evidence questions.

## Product direction

The strongest currently qualified product pattern is:

```text
meaningful active play
-> Relationship / world / capability consequences
-> understood routine
-> deliberate Copy delegation
-> bounded offline continuation where explicitly allowed
-> return attention to higher-order active decisions
```

The current candidate thesis is that incremental automation should compress **understood repetition**, not replace discovery, interpretation, tactical choice, social choice, or irreversible player agency.

This remains a product-direction hypothesis rather than M26 authorization. See [`specification/Technical/PostM25ProductDirection.md`](specification/Technical/PostM25ProductDirection.md).

## Current technical invariants

Two important GameLoop contracts are now integrated:

**`SERIAL_BACKPRESSURE_V1`**

```text
live logical time -> accumulator
-> admit at most one fixed step while async consumer unresolved
-> retain excess logical milliseconds
-> no per-tick FIFO backlog
-> no drop / skip / coalescing / concurrent consumers
```

**`FRESH_LOOP_RESET_V1`**

```text
continuous live execution: preserve sub-step remainder
pause/resume:              preserve remainder; reject paused wall time
stop/start:                discard remainder
unmount/remount:           discard remainder
save/load + fresh mount:   discard remainder
```

Timed-Quest precision remains comparison-only; raw and persisted timer values are not rounded or rewritten. M21 remains an explicit bounded offline allowlist, and timed Quests remain online-only during offline settlement.

For the complete technical authority chain, use [`specification/README.md`](specification/README.md) and [`docs/CURRENT.md`](docs/CURRENT.md).

## Stack

- React 18 + Create React App
- TypeScript
- Redux Toolkit / React Redux
- Material UI
- React Router
- Data-driven content and versioned persistence
- Jest / React Testing Library
- Playwright-based UI-only synthetic review tooling

## Local setup

Node.js 20 is the project runtime used by repository CI.

```bash
npm ci
npm start
```

The development app is served at `http://localhost:3000` by default.

## Quick validation

```bash
npm run docs:authority:validate
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

For focused GameLoop, Quest, progression, persistence/offline, synthetic-review, and milestone qualification commands, use [`RUNBOOK.md`](RUNBOOK.md).

The authoritative pull-request workflow is:

```text
.github/workflows/build-validation.yml
```

Current merge authority is:

```text
Build Validation
+ preregistered package / milestone acceptance criteria
+ any explicitly declared authoritative gate for the change
```

AI review is advisory unless a future explicit policy deliberately promotes it. The retired Gemini review workflow and `GEMINI_API_KEY` dependency are not part of current repository CI.

## Repository layout

```text
src/                    production source and executable qualification tests
specification/          product, feature, narrative, UI/UX, and technical records
docs/CURRENT.md         documentation authority/classification index
docs/analysis/          historical/reference analysis material
scripts/                repository-local validation and review tooling
.github/workflows/      authoritative CI workflow(s)
STATUS.md               current repository/milestone truth
RUNBOOK.md              operating and qualification procedure
```

## Working rule for future changes

Before opening a new milestone or feature package:

```text
latest main
-> STATUS.md
-> docs/CURRENT.md
-> RUNBOOK.md
-> specification/README.md
-> affected current contract/result documents
-> fresh bottleneck reconciliation
-> bounded package with explicit evidence ceiling
```

Do not restart completed Packages 1–3 from the post-M25 timing-hardening milestone, and do not infer M26 from technical green tests alone.
