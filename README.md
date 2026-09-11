# React Incremental RPG Prototype

A React/TypeScript incremental RPG prototype combining active relational/strategic play with earned delegation and bounded offline progression.

## Current state

```text
M25 Complete Chapter Vertical Slice: PASS
Post-M25 GameLoop Timing Hardening: COMPLETE / INTEGRATED
Post-M25 Content Intelligence: COMPLETE / INTEGRATED
Three heterogeneous chapter-scale projections: QUALIFIED / INTEGRATED
Player Insight + Product-Depth Packages: COMPLETE / INTEGRATED
Human Integrated Playability / Product Review: DEFERRED / UNPROVEN
Product Direction Decision: PENDING
M26: NOT AUTHORIZED
```

The repository now has strong deterministic evidence that its RPG, relationship, progression, chapter-scale composition, delegation, persistence, offline, and Timing contracts can coexist. It still does **not** prove fresh-player comprehension, pacing, fairness, enjoyment, retention, final balance, or final Product Direction.

## What the prototype currently demonstrates

The strongest integrated product pattern is:

```text
meaningful active play
-> Relationship / Knowledge / Faction / World consequences
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
- read-only **Player Insight** surfaces: Causal Journal, Opportunity Map, and Relationship-Derived Build;
- contextual `Available because` explanations for already-visible dialogue choices without exposing locked future prerequisites;
- cross-domain semantic Trait use, including `ScholarlyInsight` in investigation and tactical combat while baseline solutions remain viable;
- player-authored Copy routine priorities over the existing M20 production-task allowlist, with explicit `Start Preferred` delegation and **no automatic task chaining**.

The candidate product thesis remains: incremental automation should compress **understood repetition**, not replace discovery, interpretation, tactical choice, social choice, or irreversible player agency.

## Documentation map

Do not infer authority from file age, folder depth, or detail. Read in this order:

1. [`STATUS.md`](STATUS.md) — current repository state, integrated work, evidence ceiling, and next priorities.
2. [`docs/CURRENT.md`](docs/CURRENT.md) — canonical classification: **CURRENT AUTHORITY / REFERENCE / HISTORICAL EVIDENCE / SUPERSEDED**.
3. [`RUNBOOK.md`](RUNBOOK.md) — setup, validation, CI, diagnostics, exact-head qualification, and integration procedure.
4. [`specification/README.md`](specification/README.md) — technical/product authority map and domain-specific source chain.
5. [`specification/Technical/PostM25ImplementationRoadmap.md`](specification/Technical/PostM25ImplementationRoadmap.md) — reconciled accounting of post-M25 hypotheses versus delivered work.
6. Specific current contract/result documents linked from those indexes.

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
npx tsc --noEmit
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

Focused post-M25 and subsystem commands are documented in [`RUNBOOK.md`](RUNBOOK.md).

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
-> PostM25ImplementationRoadmap.md when relevant
-> affected current contract/result documents
-> fresh bottleneck reconciliation
-> bounded package with explicit evidence ceiling
```

Do not restart completed post-M25 packages from historical queues, and do not infer M26 authorization from technical green tests alone.
