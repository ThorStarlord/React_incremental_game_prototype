# Relationship System Migration Plan — Historical Record

**Status:** Historical implementation plan; core migration substantially executed and qualified through M14  
**Original target branch:** `feature/relationship-memory-vertical-slice`  
**Current authority:** [`PostM14ProductReconciliation.md`](PostM14ProductReconciliation.md)

## 1. Historical purpose

This document originally planned the migration from the prototype relationship pipeline:

```text
Dialogue / quest effects
-> Affinity changes
-> Affinity threshold
-> legacy connectionDepth increase
-> Essence recalculation
-> Trait Resonance using connectionDepth + Essence
```

toward:

```text
Narrative / gameplay action
-> Relationship Experience
-> durable Experience ledger
-> Bond dimensions
-> Connection qualification
-> optional Memory
-> Relationship-derived Essence
-> Trait discovery / assimilation / Resonance evidence
```

The second architecture is now substantially implemented. The first pipeline remains only where explicitly retained for legacy compatibility.

Do **not** read the old migration sequence as the current product roadmap.

## 2. What was implemented

The staged migration produced:

- a dedicated `Relationships` feature/domain;
- Relationship Experience types, authoring, idempotency, and persistence;
- Memories tied to originating Experiences;
- Bond Profiles and universal dimensions;
- evidence-qualified Connection progression;
- per-NPC `connectionAuthority`;
- data-driven relationship bundles discovered from `/data/relationships/index.json`;
- Relationship-derived Essence contributions;
- authored Trait discovery and relationship-mediated assimilation/Resonance for migrated Traits;
- save reconciliation and explicit schema migration;
- player-facing production relationship routes;
- generic story gates based on Relationship evidence;
- bounded multi-NPC shared consequence fan-out.

## 3. Qualification history

### M4-M10

Established the core migration, Willow/Elara production slices, Trait discovery/assimilation evidence, and save migration/reconciliation.

### M11

Qualified Lyra as an adversarial Relationship using the same generic ontology.

### M12

Qualified Gronk, Silas, and Valerius and showed that repeated production authoring did not require repeated engine changes.

### M13

Qualified persisted Relationship evidence as a cause of later story/gameplay consequences.

### M14

Qualified one shared story decision producing distinct/conflicting Relationship consequences across multiple NPCs, plus an independent second fan-out probe.

## 4. Current production authority

The relationship authoring manifest currently registers:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

For those Relationship-authority NPCs:

- Bond/Connection semantics live in the Relationship domain;
- Affinity is not Connection XP;
- important relational history is represented by Experiences/Memories;
- legacy `NPC.connectionDepth` may remain only as compatibility for unmigrated consumers.

## 5. Legacy compatibility that remains

Migration was intentionally incremental, so several old surfaces may still exist:

- `NPC.affinity` and `NPC.connectionDepth` fields;
- old UI/debug components exposing those fields;
- unmigrated Trait Resonance gates;
- Copy parent/creation/inheritance calculations using legacy NPC fields;
- save migration code for old data;
- older data/content that has not yet moved to Relationship authority.

These are not evidence that the old pipeline remains the target design.

## 6. Current remaining gaps

The Relationship migration itself is no longer the main product bottleneck.

Higher-value remaining work includes:

- long-horizon Relationship callbacks;
- Trait-driven gameplay payoff;
- combat vertical slice;
- exploration/travel;
- world-derived Tether;
- Copy task automation;
- offline progress;
- social knowledge propagation;
- faction reputation;
- explicit world-state consequences;
- a complete chapter vertical slice.

## 7. Current migration rules

When touching a remaining legacy consumer:

1. identify which domain should own the concept;
2. do not remove compatibility fields without save/runtime evidence;
3. do not add new legacy dependencies merely because they already exist nearby;
4. use Relationship Connection/Experience/Memory when deep relational meaning is required;
5. preserve generic runtime contracts before introducing NPC-specific exceptions;
6. add focused qualification and preserve accumulated regression gates.

## 8. Canonical reading order

Use:

1. `PostM14ProductReconciliation.md`;
2. `../GameDesignDocument.md`;
3. `../Features/RelationshipExperienceSystem.md`;
4. `../Features/EssenceResonanceModel.md`;
5. relevant current feature spec;
6. milestone-specific qualification evidence.

This historical migration plan is useful for understanding why compatibility layers exist, but it no longer describes the repository's current state or next roadmap.