# M26 Provisional Product-Depth Roadmap

**Status:** CURRENT AUTHORITY — AUTHORIZED, PROVISIONAL / HUMAN-UNVALIDATED  
**Authorized:** 2026-09-11  
**Base:** `868a24e6bd415693c313e8ee6a767451b2c64e80`  
**Product Direction:** `PostM25ProvisionalProductDirectionDecision.md`  
**Governance:** `PostM25ProvisionalGovernanceDecision.md` / issue #111  
**Human Product Review:** issue #109 remains OPEN / UNPROVEN

## Objective

Deepen the smallest existing loop that reinforces the provisional product direction without adding canonical gameplay authority:

```text
remembered relationship evidence
-> learned durable capability
-> player can see what taught it
-> personally mastered routine
-> player can see why it is delegatable
-> existing Copy authority determines execution readiness
```

M26 is a product-legibility and provenance milestone, not a new progression-system milestone.

## Package M26.1 — Relationship Capability Provenance

### Goal

Make the existing Relationship-Derived Build projection show the already-player-visible Memories that actually contributed to Trait assimilation.

### Scope

- extend the read-only relationship capability projection with bounded provenance entries;
- source provenance from existing `traitAssimilationByKey.qualifyingMemoryIds`;
- resolve only Memories already marked `playerVisible`;
- include the Memory title/interpretation and its recorded origin Experience title when available;
- never reveal hidden Memories, undiscovered Traits, future requirements, or authored content that the player has not earned;
- render provenance in Player Insight using player-facing language rather than raw memory IDs or tags.

### Non-goals

- no Trait discovery changes;
- no assimilation changes;
- no new Relationship state;
- no new save schema;
- no generic causal graph.

### Acceptance

A discovered/permanent relationship-derived capability can identify its visible qualifying Memories while hidden/unqualified evidence remains absent. Existing developing/resonance-ready/permanent derivation remains unchanged.

## Package M26.2 — Mastered Routine / Delegation Provenance

### Goal

Expose the existing earned-delegation contract as a read-only player model: distinguish **I have learned this routine** from **this particular Copy can execute it now**.

### Scope

- add a read-only routine-mastery projection over `PlayerState.routineFamiliarity` and existing Copy task definitions;
- show the routine name, description, mastery source, and learned timestamp for routines the player has actually learned;
- map the two current familiarity sources into player language:
  - `city_center_forge_assistance` -> personally practiced Forge Assistance in the City Center;
  - `trait_resonance` -> personally completed Trait resonance;
- preserve existing M20 `evaluateCopyProductionTaskEligibility` as the execution authority;
- in Copy Detail, present eligible routines as `Ready to delegate` and ineligible mastered routines as `Mastered by you; this Copy still needs ...`;
- do not auto-start, auto-chain, reprioritize, or otherwise make a player decision.

### Non-goals

- no new routine familiarity IDs;
- no task scheduler changes;
- no Copy autonomy expansion;
- no offline-authority expansion;
- no save migration.

### Acceptance

Mastery provenance is derived entirely from existing player state. Copy-specific readiness remains entirely derived from existing task eligibility.

## Package M26.3 — Integrated Learn-to-Delegate Qualification

### Goal

Prove the M26 surfaces compose while preserving authority separation and spoiler/evidence boundaries.

### Qualification requirements

Add a focused deterministic M26 qualification covering:

1. hidden/undiscovered relationship evidence is not exposed;
2. qualifying player-visible Memories appear as capability provenance;
3. permanent Trait ownership remains the durable capability authority;
4. only recorded routine familiarity appears as mastered work;
5. familiarity source is translated without changing stored values;
6. Copy readiness still uses the existing M20 eligibility evaluator;
7. Player Insight remains read-only and introduces no reducer/slice/dispatch authority;
8. no automatic Copy task chaining is introduced;
9. TypeScript and all existing Build Validation gates remain green.

### CI

Create a focused `m26:validate` command and a Build Validation step before TypeScript so failures are isolated from unrelated historical gates.

## Change budget

M26 should normally touch only:

```text
PlayerInsightSelectors / PlayerInsightPanel
Copy presentation helper or CopyDetailPanel
focused M26 qualification tests
package.json / Build Validation wiring
M26 result + authority documentation
```

If implementation requires a new canonical slice, persistence root, generalized graph/engine, or autonomous Copy policy, stop and revise the roadmap instead of widening M26 silently.

## Evidence ceiling

A green M26 proves only that the chosen provenance/readiness surfaces faithfully project existing state and preserve current authority boundaries.

It does **not** prove that the language is understandable, that the UI is enjoyable, that delegation feels satisfying, or that the provisional Product Direction is correct.

## Stop condition

M26 stops when Packages M26.1–M26.3 are integrated and exactly qualified, or earlier if implementation reveals that the provisional direction requires authority expansion beyond this roadmap.

After M26, do not infer M27. Reconcile repository evidence and issue #109 before authorizing another product-depth milestone.