# GC-11 Whole-Game Alpha Result

**Disposition:** `ALPHA_PASS / HUMAN_UNVALIDATED`  
**Qualified candidate:** `4196002bd6ebcc0e2c5cbba72d035c411a61f025`  
**Build Validation:** #381 / run `35536846971` — PASS  
**PR:** #134  
**Merge:** `f49dd6c5df67bad4e0e26832f19ee1bc38561411`  
**Integrated:** 2026-09-20

## What Alpha now proves

A fresh production-equivalent New Game can legally traverse:

```text
New Game
-> Prologue
-> Chapter 1 — Merchant District Crisis
-> Chapter 2 — Archive Inquiry
-> Chapter 3 — Enemies in Phase
-> Chapter 4 — Lattice Under Strain
-> Chapter 5 — The Chrono-Crypt
-> Chapter 6 — Network Under Pressure
-> Chapter 7 — Counterphase
-> Telluric Echo finale
-> state-responsive Epilogue
```

The qualified whole-game path uses ordinary runtime authorities:

- production startup catalogs and New Game reset/seed actions;
- authored travel;
- NPC dialogue interactions;
- Quest start/resolution/turn-in;
- personally practiced routine evidence;
- existing Relationship, Knowledge, Faction and World State consequences;
- canonical save/load and save-code import/export.

The whole-game test does **not** directly inject authored Relationship Experiences, Knowledge facts, World State, permanent Traits, replacement Redux state, or debug-only progression.

## Persistence evidence

The Alpha path qualifies canonical persistence at:

- early campaign;
- mid campaign;
- immediately before the finale;
- campaign complete.

The completed state also round-trips through the canonical encoded save/import migration boundary.

## Breadth and authority evidence

The aggregate Alpha gate also preserves qualified evidence for:

- four durable relationship-derived capability identities across at least three anchors;
- two meaningful cross-domain capabilities;
- two viable late-game build profiles;
- three personally mastered routine identities across multiple contexts;
- explicit Copy task choice and bounded offline routine work;
- no offline narrative/Knowledge/Faction/World State/finale authority;
- chapter/content integrity;
- save-schema compatibility;
- player-surface scope cleanup.

## Qualification findings repaired during Alpha

### 1. Route-trace DAG scalability

Build Validation #377 exposed exponential re-expansion of shared prerequisite subgraphs in the content route tracer. The tracer was cycle-safe but not DAG-safe and exhausted the Node heap before the Alpha Jest suite ran.

Repair:

- each trace node is expanded at most once;
- repeated fan-in emits a lightweight `reference` node;
- a fan-in self-test protects the bounded behavior.

The traced target and campaign graph were not weakened.

### 2. M25 public-order faction composition

Build Validation #379 reached the real production path and exposed an inherited composition contradiction:

```text
Patrol duty                         +10 City Watch
Break the merchant leak            +15 City Watch
Public override                     -10 City Watch
                                     ---
Natural accumulated standing        +15
```

M25 had required the public-order conclusion at City Watch `<= -1`, an assumption inherited from isolated M23 qualification starting at neutral.

Repair:

- preserved all existing faction mutations;
- preserved the explicit public-override consequence;
- repaired only the later M25 conclusion gate to accept the natural accumulated route at `<= +15`;
- retained the required public-override Relationship evidence and heavy-Watch World State.

See `GC11M25FactionCompositionRepair.md`.

## Evidence ceiling

This result proves deterministic structural Alpha only.

It does **not** prove:

- fresh-player comprehension;
- pacing;
- balance;
- accessibility in supported browsers;
- enjoyment or retention;
- Beta readiness.

Issue #109 remains `OPEN / UNPROVEN`. Its human evidence is required for `BETA_PASS`.

## Next package

GC-12 — Content Alpha completion.
