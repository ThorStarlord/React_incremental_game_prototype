# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current state

```text
M25 Complete Chapter Vertical Slice: PASS
Post-M25 GameLoop Timing Hardening: COMPLETE / INTEGRATED
Post-M25 Content Intelligence: COMPLETE / INTEGRATED
Three heterogeneous chapter-scale projections: QUALIFIED / INTEGRATED
Player Insight + Product-Depth Packages: COMPLETE / INTEGRATED
Product Direction Decision Readiness: COMPLETE / INTEGRATED
Three-Chapter Friction Audit: COMPLETE / CLOSED
Chapter-Definition Integrity Repair: COMPLETE / INTEGRATED
Human Integrated Playability / Product Review: OPEN HUMAN AUTHORITY GATE / UNPROVEN
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

The repository now has strong deterministic evidence that its RPG, relationship, progression, chapter-scale composition, delegation, persistence, offline, and Timing contracts can coexist. It still does **not** prove fresh-player comprehension, pacing, fairness, enjoyment, retention, final balance, or final Product Direction.

## What the prototype currently demonstrates

The strongest integrated product pattern is:

```text
meaningful active play
-> Relationship / Knowledge / Faction / World consequences
-> understandable causal memory
-> durable relationship-derived capabilities
-> higher-order tactical and social decisions
-> understood routine
-> deliberate Copy delegation
-> bounded offline continuation where explicitly allowed
-> player attention returns to novelty and consequential choice
```

Post-M25 development has added:

- developer-side content integrity, dependency/reachability analysis, and route tracing;
- three heterogeneous chapter-scale projections over canonical domain state: **Merchant District Crisis**, **Archive Inquiry**, and **Enemies in Phase**;
- a bounded Rule-of-Two chapter-requirement helper rather than a generalized `ChapterEngine` or narrative DSL;
- chapter identity derived from canonical definitions plus `chapter:validate` integrity checking for route/reference errors across the bounded runtime dialogue and Relationship content sources;
- read-only **Player Insight** surfaces: Causal Journal, Opportunity Map, and Relationship-Derived Build;
- contextual `Available because` explanations for already-visible dialogue choices without exposing locked future prerequisites;
- cross-domain semantic Trait use, including `ScholarlyInsight` in investigation and tactical combat while baseline solutions remain viable;
- player-authored Copy routine priorities over the existing M20 production-task allowlist, with explicit `Start Preferred` delegation and **no automatic task chaining**;
- a Product Direction Decision Readiness record that compares the demonstrated identities without promoting repository evidence into a final product decision.

The leading synthesis remains a **hypothesis**: incremental automation should compress **understood repetition**, while causal state and relationship-derived capabilities preserve meaningful long-horizon change and irreversible player agency.

## Documentation map

Do not infer authority from file age, folder depth, or detail. Read in this order:

1. [`STATUS.md`](STATUS.md) — current repository state, integrated work, evidence ceiling, and next priorities.
2. [`docs/CURRENT.md`](docs/CURRENT.md) — canonical classification: **CURRENT AUTHORITY / REFERENCE / HISTORICAL EVIDENCE / SUPERSEDED**.
3. [`RUNBOOK.md`](RUNBOOK.md) — setup, validation, CI, diagnostics, exact-head qualification, and integration procedure.
4. [`specification/README.md`](specification/README.md) — technical/product authority map and domain-specific source chain.
5. [`specification/Technical/PostM25ProductDirectionDecisionReadiness.md`](specification/Technical/PostM25ProductDirectionDecisionReadiness.md) — current decision-preparation record; it does not select final Product Direction.
6. [`specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md`](specification/Technical/PostM25ChapterDefinitionIntegrityRepair.md) — integrated result of the closed three-chapter friction audit repair queue.
7. Specific current contract/result documents linked from those indexes.

`README.md` is orientation, not final authority for disputed implementation, product, or evidence questions.

## Current Timing invariants

Two important GameLoop contracts remain integrated:

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

## Stack

- React 18 + Create React App
- TypeScript
- Redux Toolkit / React Redux
- Material UI
- React Router
- Data-driven content and versioned persistence
- Jest / React Testing Library
- Playwright-based UI-only synthetic review tooling

Node.js 20 is the project runtime used by repository CI.

## Local setup

```bash
npm ci
npm start
```

The development app is served at `http://localhost:3000` by default.

## Quick validation

```bash
npm run docs:authority:validate
npm run content:intelligence:validate
npm run chapter:validate
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

`chapter:validate` is included by `content:intelligence:validate`; the standalone command is useful for focused diagnosis. Focused post-M25 and subsystem commands are documented in [`RUNBOOK.md`](RUNBOOK.md).

The authoritative pull-request workflow is:

```text
.github/workflows/build-validation.yml
```

Current merge authority is deterministic Build Validation plus preregistered package/milestone acceptance criteria and any separately declared authoritative gate for the change. AI review is advisory unless explicitly promoted by future policy. The retired Gemini review workflow and `GEMINI_API_KEY` dependency are not part of current repository CI.

## Working rule for future changes

```text
latest main
-> STATUS.md
-> docs/CURRENT.md
-> RUNBOOK.md
-> specification/README.md
-> affected current contract/result documents
-> issue #109 for human Product Review evidence
-> fresh bottleneck reconciliation
-> bounded package with explicit evidence ceiling
```

The three-chapter friction audit's R1–R3 queue is closed. Do not restart completed post-M25 packages from historical records, do not fabricate human Product Review evidence, and do not infer M26 authorization from technical green tests alone.
