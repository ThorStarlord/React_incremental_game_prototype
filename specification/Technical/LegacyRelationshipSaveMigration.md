# Legacy Relationship Save Migration

**Status:** M9 implemented and qualified; M10 now owns persistent save-schema migration while these Relationship provenance semantics remain authoritative  
**Scope:** Pre-Relationship saves, legacy `connectionDepth`, Bond Profile provenance, load-time runtime reconciliation, passive Essence compatibility, and Main Menu save metadata consistency  
**Purpose:** Preserve legitimate progress from historical saves without inventing modern Experience/Memory evidence that those saves never recorded.

---

## 1. Problem

The Relationship redesign changed the meaning of progression from a simple scalar pipeline:

```text
Affinity -> connectionDepth -> Essence -> Trait Resonance
```

to an evidence-bearing model:

```text
Experience
-> relationship dimensions
-> Connection qualification
-> optional Memory
-> Bond Profile
-> passive Essence
-> Trait assimilation / Resonance
```

Historical saves can therefore contain valid player progress that cannot be reconstructed honestly into the new ontology.

A legacy save may know:

```text
affinity = 37
connectionDepth = 5
```

but it does **not** know which conversations, choices, disagreements, teaching sessions, landmark Memories, or Trait-learning events caused that state.

The migration must not convert missing history into invented certainty.

---

## 2. Canonical migration invariant

> **Preserve legacy progress; never fabricate modern relationship history.**

Legacy `connectionDepth` may preserve a compatibility Connection baseline. It is not evidence that any specific modern Experience, Memory, semantic dimension, Connection qualification, or Trait-assimilation event occurred.

Therefore Relationship reconciliation may preserve:

- legacy Affinity;
- a bounded compatibility Connection level;
- the original legacy depth as provenance.

It must not fabricate:

- Experiences;
- Memories;
- Connection Progress;
- Connection qualification evidence;
- Trust;
- Understanding;
- Shared Meaning;
- Reliance;
- Vulnerability;
- Reciprocity;
- Trait assimilation;
- Trait compatibility;
- authored Trait discovery evidence.

---

## 3. Relationship migration authority

Relationship reconciliation applies only to NPCs whose current relationship progression declares:

```text
connectionAuthority = relationships
```

The runtime loads the current relationship authoring manifest and evaluates only those NPCs.

This prevents M9 from globally rewriting legacy NPCs that have not yet moved to the modern Relationship system.

If an NPC already has a modern `BondProfile`, reconciliation does not overwrite it.

That is the principal idempotency boundary:

```text
modern Bond Profile exists -> preserve it exactly
modern Bond Profile absent -> legacy compatibility reconciliation may seed one
```

---

## 4. Connection mapping

Legacy depth is not copied without limit.

For each relationship-authoritative NPC:

```text
authored ceiling = highest Connection level present in current qualification rules
mapped level = min(floor(max(legacyDepth, 0)), authored ceiling)
```

This prevents a historical scalar such as:

```text
legacy connectionDepth = 9
```

from creating:

```text
Connection IX
```

when the current authored relationship only defines progression through Connection II.

The original value remains available in provenance even when the playable compatibility level is capped.

---

## 5. Bond Profile provenance

`BondProfile` contains explicit provenance:

```typescript
interface BondProfileProvenance {
  legacyDerived: boolean;
  legacyConnectionDepth?: number;
}
```

A raw legacy Relationship reconciliation produces, conceptually:

```typescript
{
  connectionLevel: boundedLegacyLevel,
  connectionProgress: 0,
  dimensions: {
    affinity: preservedLegacyAffinity,
    trust: 0,
    understanding: 0,
    sharedMeaning: 0,
    reliance: 0,
    vulnerability: 0,
    reciprocity: 0,
    custom: {}
  },
  connectionQualificationEvidence: {},
  provenance: {
    legacyDerived: true,
    legacyConnectionDepth: originalLegacyDepth
  }
}
```

No fake event ids are inserted to justify the preserved level.

### Older modern saves

Some saves can contain an actual Relationship `BondProfile` from M3-M8 but predate the provenance field.

Selectors/default normalization treat those profiles as:

```typescript
provenance: { legacyDerived: false }
```

They are modern Relationship state with an older representation, not raw legacy-depth state, and must not be relabeled as historical-depth migrations.

---

## 6. Load-time sequence after M10

M10 introduced an explicit persistent save-schema layer. The normal Main Menu path is now:

```text
read serialized save
-> detect/migrate persistent save schema to CURRENT_SAVE_SCHEMA_VERSION
-> replaceState(migratedState)
-> initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true })
-> register current progression definitions
-> seed only missing legacy-derived Bond Profiles
-> recalculate passive Essence generation rate
-> continue into the game
```

This supersedes M9's original description in which Relationship migration was the first migration concept at the load boundary.

The phases are now deliberately separate:

### Persistent schema migration — M10

Transforms the saved representation before Redux state installation.

### Relationship runtime reconciliation — M9

Interprets migrated state against **current authored Relationship definitions** after installation.

The Relationship step remains post-load because its bounded Connection mapping depends on today's authored Connection ceiling.

### Failure boundaries

An unsupported or invalid persistent schema fails before `replaceState`.

A relationship-authoring fetch/reconciliation failure occurs later and does not retroactively turn a successfully decoded current-schema save into corrupted bytes.

The runtime logs that additive reconciliation failure separately.

See:

```text
specification/Technical/SaveSchemaMigrationSystem.md
```

for the canonical persistent migration contract.

---

## 7. Passive Essence behavior

A preserved Connection baseline may continue to generate passive Essence because that progress represented real historical gameplay.

However, reconciliation seeds no positive semantic dimensions. As a result:

- Resonance Quality begins in the weak band;
- Stability may remain conservative because Trust is unknown/neutral;
- the resulting relationship contribution is materially weaker than a modern evidence-rich Bond of the same Connection level.

This is intentional.

The migration preserves **progress continuity**, not a fictional claim that the old save possessed the same semantic bond quality as a fully authored modern route.

Runtime reconciliation recalculates the **generation rate** only. It does not mint current Essence balance.

---

## 8. Trait progression boundary

Preserved Connection level is not sufficient to reconstruct Trait learning.

For relationship-mediated Traits such as `WillowsWisdom`, the modern gate still requires the normal evidence chain, including as applicable:

- discovery;
- source NPC;
- Connection level;
- assimilation progress;
- compatibility;
- Memory/evidence tags;
- prerequisites;
- sufficient Essence.

A legacy save can therefore satisfy the Connection-level portion of a gate while still failing because it has no fabricated assimilation or Memory evidence.

This is the required behavior.

> Legacy Connection preserves relationship progress; it does not retroactively prove that the protagonist learned a Trait.

---

## 9. Player-facing disclosure

A legacy-derived Bond Profile is visible as such in the normal Relationship UI.

The player is told that:

- the current Connection level was preserved from the legacy relationship system;
- the original legacy depth is shown when available;
- migration did not invent Experiences, Memories, or qualification evidence;
- future authored interactions will build modern history from that point onward.

The UI therefore does not present a migrated level under the normal heading:

```text
Why this Connection level was earned
```

as though current event evidence existed when it does not.

Provenance is not merely debug metadata; it prevents epistemic misrepresentation in the player-facing model.

---

## 10. Main Menu save metadata repair

M9's load-path audit found a separate but directly blocking consistency defect.

The live Main Menu previously used two incompatible save protocols:

### Old Main Menu listing/deletion hook

```text
scan localStorage keys beginning with savegame_
```

### Canonical save utilities

```text
metadata: saved_games
state:    game_save_${saveId}
```

The Main Menu hook was reconciled to consume:

```text
getSavedGames()
deleteSavedGame(saveId)
```

from `saveUtils`.

M10 builds on that single storage authority and adds explicit `schemaVersion` to newly created save metadata and envelopes.

---

## 11. Implementation surfaces

Primary M9 runtime surfaces:

```text
src/features/Relationships/state/RelationshipTypes.ts
src/features/Relationships/state/RelationshipSlice.ts
src/features/Relationships/state/RelationshipThunks.ts
src/features/Relationships/components/MigratedRelationshipSummary.tsx
src/pages/MainMenu/hooks/useGameActions.ts
src/hooks/useSavedGames.ts
```

M9 qualification:

```text
src/features/Relationships/state/RelationshipLegacySaveMigration.test.ts
.github/workflows/build-validation.yml
```

M10 subsequently adds the persistent migration authority in:

```text
src/shared/utils/saveSchema.ts
src/shared/utils/saveUtils.ts
specification/Technical/SaveSchemaMigrationSystem.md
```

The Relationship reconciliation still reuses the generic relationship manifest and progression definitions. It contains no Willow/Elara-specific branch in generic migration logic.

---

## 12. Dedicated M9 qualification

`RelationshipLegacySaveMigration.test.ts` uses the actual production relationship manifest and bundles.

The suite proves:

1. a pre-Relationship save can have no `relationships` slice at all and still reconcile;
2. legacy Affinity is preserved;
3. excessive legacy depth is capped to the target NPC's current authored Connection ceiling;
4. the original legacy depth remains in provenance;
5. all semantic dimensions other than Affinity begin neutral;
6. Connection Progress remains zero;
7. Connection qualification evidence remains empty;
8. no Experiences are fabricated;
9. no Memories are fabricated;
10. no Trait assimilation or compatibility is fabricated;
11. reconciliation is idempotent;
12. an existing modern Bond Profile is not overwritten;
13. an old modern profile missing the provenance field normalizes as non-legacy;
14. a migrated Connection can retain a weak passive Essence contribution;
15. migration does not mint current Essence;
16. migrated Connection cannot bypass Willow's modern Memory/assimilation Trait gates.

M9 received exact-head qualification before integration, and the integrated M4-M9 mainline was later requalified as a single tree by Build Validation #114 before M10 began.

M10 retains `RelationshipLegacySaveMigration.test.ts` in its Build Validation gate, so save-envelope versioning cannot silently regress the M9 provenance contract.

---

## 13. Evidence ceiling

M9 does **not** claim that:

- historical saves can reconstruct the real scenes that produced old depth;
- legacy Connection automatically satisfies modern Memory or Trait-learning evidence;
- every non-relationship-authoritative NPC has been migrated;
- a legacy-derived Bond is semantically equivalent to a modern authored Bond of the same level.

M9 itself also did not establish a generalized save-schema system. M10 now supplies that architecture, but it does not retroactively create missing Relationship history.

---

## 14. Invariants for future migration work

Future persistent migrations and runtime reconciliations must preserve these rules:

1. **Never manufacture causal evidence to make a schema look complete.**
2. **Preserve known historical facts separately from inferred/default state.**
3. **Make inference provenance explicit when it affects gameplay or explanation.**
4. **Do not overwrite a newer authoritative representation with an older compatibility source.**
5. **A migration may preserve entitlement/progress without claiming semantic history it cannot know.**
6. **Persistent schema conversion and current-runtime reconciliation are separate phases.**
7. **Player-facing explanations must distinguish preserved legacy state from newly earned modern evidence.**
8. **Use the M10 migration registry for representation changes; do not add another ad hoc serialized-state repair path.**

---

## 15. Relationship to the original migration plan

This document implements the Relationship-specific semantics originally described as **Phase I — Save migration** of `RelationshipSystemMigrationPlan.md`.

The required domain semantics remain authoritative:

- preserve Affinity;
- map old `connectionDepth` conservatively;
- initialize unknown dimensions neutrally;
- do not fabricate Experiences or Memories;
- mark legacy-derived profiles explicitly;
- record new authored Experiences from migration onward.

M10 refines the architecture around those semantics by giving the serialized save itself a formal schema identity and migration chain.

---

## 16. Success criterion

M9 succeeds when an old player can continue with recognizable relationship progress while the new system remains honest about what it knows.

The Relationship reconciliation must be able to say:

> "You had meaningful progress with this NPC before the new evidence model existed. I preserved that progress, but I will not pretend to know which modern Experiences or Memories caused it."

M10 adds the preceding representational statement:

> "I also know which save schema these bytes used and which explicit forward transformations made them current before Relationship reconciliation began."

Those two claims are complementary, not interchangeable.
