# Trait System Specification

**Implementation Status:** ✅ Core discovery/equip/permanent Trait flow implemented  
**Relationship migration:** ✅ Willow and Elara use authored discovery + evidence/assimilation Resonance; unmigrated Traits retain compatibility behavior  
**Discovery contract:** [`../Technical/TraitDiscoveryContract.md`](../Technical/TraitDiscoveryContract.md)

Traits provide passive modifications to player capabilities and support discovery, temporary equipping, permanent Resonance, NPC sharing, and Copy-related integration.

## 1. Trait lifecycle

```text
Pattern exists in catalogue
-> Discover / recognize
-> temporarily Equip / Attune
-> (for relationship-mediated Traits) Assimilate
-> Resonate permanently
```

The three progression terms must not be collapsed:

- **Discovery = recognition:** the player knows the Trait pattern exists.
- **Assimilation = learning/internalization:** the protagonist can increasingly reproduce the pattern.
- **Resonance = permanence:** Essence stabilizes an already-qualified pattern permanently.

### 1.1 Discovery

A Trait must be present in `traits.discoveredTraits` before permanent Resonance.

Catalogue loading and discovery are now separate concerns.

A Trait may declare:

```typescript
type TraitDiscoveryMode = 'initial' | 'authored';

discoveryMode?: TraitDiscoveryMode;
```

- `initial` — known when definitions load;
- `authored` — definition exists, but an explicit authored event must reveal the pattern;
- omitted — treated as `initial` for legacy/prototype compatibility.

`loadTraits` preserves already-earned discoveries while adding only initially-known Traits. It no longer treats an empty discovery list as permission to discover the entire catalogue.

Current authored relationship discoveries:

- `WillowsWisdom` — discovered during **The First Lesson**;
- `ScholarlyInsight` — discovered during **The Contradictory Footnote**.

Discovery is attached to the event where the pattern becomes recognizable, not to Connection level by itself.

### 1.2 Temporary equipping

Discovered non-permanent Traits may occupy the player's limited Trait slots.

Temporary equipping:

- costs no Essence;
- is reversible;
- can provide Trait effects while slotted;
- may participate in NPC/Copy sharing where existing rules allow it.

Permanent Traits do not require an active slot.

Undiscovered authored patterns cannot be equipped from the NPC Overview.

## 2. Resonance authority

Permanent acquisition is centralized in:

`src/features/Traits/state/TraitThunks.ts#acquireTraitWithEssenceThunk`

The gate depends on whether the Trait's source NPC has migrated to Relationship authority.

### 2.1 Legacy NPC-sourced Traits

For unmigrated NPCs, the compatibility gate remains:

```text
Trait discovered
+ source NPC connectionDepth >= legacy minimum
+ Trait prerequisites
+ enough Essence
-> spend Essence
-> permanent Trait
```

`TRAIT_RESONANCE.MIN_CONNECTION_DEPTH` remains the default legacy threshold.

### 2.2 Relationship-mediated Traits

For a source NPC whose `RelationshipProgressionDefinition.connectionAuthority` is `relationships`, the gate is:

```text
Trait discovered
+ source NPC resolved
+ qualified Bond Connection
+ assimilation threshold met
+ compatibility threshold met
+ required landmark Memory evidence
+ Trait prerequisites
+ enough Essence
+ authored final Resonance event validates
-> spend Essence
-> permanent Trait
```

Essence is the final stabilization cost. It cannot substitute for discovery, relationship evidence, or assimilation.

## 3. Relationship-mediated Trait metadata

A Trait may declare:

```typescript
discoveryMode?: 'initial' | 'authored';
sourceNpc?: string;
minimumConnectionLevel?: number;
resonanceTags?: string[];
requiredMemoryTags?: string[];
assimilationDifficulty?: number;
assimilationThreshold?: number;
minimumCompatibility?: number;
resonanceExperienceId?: string;
```

These fields are optional so ordinary or legacy Traits remain simple.

## 4. Trait assimilation and discovery evidence

Relationship-mediated assimilation is stored by `(sourceNpcId, traitId)`:

```typescript
interface TraitAssimilationState {
  traitId: string;
  sourceNpcId: string;
  progress: number;
  compatibility: number;
  lastUpdatedAt: number;
  qualifyingMemoryIds: string[];
}
```

Progress and compatibility are clamped to `0..100`.

Relationship Experiences may provide:

```typescript
traitEffects: [{
  traitId,
  discover?,
  compatibilityDelta?,
  assimilationDelta?
}]
```

These effects are independent:

- `discover: true` reveals the pattern;
- compatibility evidence says the pattern fits the protagonist/source relationship;
- assimilation evidence says the protagonist is learning to reproduce it.

A single Experience may do more than one, but discovery does not imply mastery.

Landmark Memories whose `traitRelevance` contains the Trait are recorded as qualifying Memory evidence.

## 5. Willow's Wisdom

`WillowsWisdom` declares:

- source: `npc_elder_willow`;
- discovery mode: `authored`;
- discovery Experience: **The First Lesson**;
- permanent Essence cost: `40`;
- minimum qualified Connection: `2`;
- assimilation threshold: `100%`;
- minimum compatibility threshold;
- required Memory tag: `Application`;
- final authored Resonance event: `willow_exp_resonance_wisdom`.

### 5.1 Discovery and assimilation path

The Willow slice uses bounded authored evidence:

1. **The First Lesson** — recognizes the slow-pattern cognition, discovers `WillowsWisdom`, and begins low assimilation.
2. **Three Nights of Teaching** — primary sustained practice segment.
3. **The Lesson Made Yours** — independent application, completing the authored assimilation proof.

The canonical authored path totals 100% assimilation.

The distinction is intentional:

```text
see the pattern
-> discover it
-> practice it
-> apply it independently
-> qualify permanent Resonance
```

### 5.2 Evidence requirement

`The Lesson Made Yours` and/or another qualifying Memory carrying the required `Application` tag matters mechanically.

Having 40 Essence without this evidence is insufficient.

## 6. Scholarly Insight

`ScholarlyInsight` is the second production relationship-mediated Trait and declares:

- source: `npc_scholar_elara`;
- discovery mode: `authored`;
- discovery Experience: **The Contradictory Footnote**;
- permanent Essence cost: `30`;
- minimum qualified Connection: `2`;
- assimilation threshold: `100%`;
- minimum compatibility: `25`;
- required Memory tag: `IndependentVerification`;
- final authored Resonance event: `elara_exp_resonance_scholarly_insight`.

Its semantic pattern is evidence-first model revision:

> Contradictory evidence prompts revision instead of defense of the first plausible explanation.

The first challenge to Elara does not discover this Trait. The Contradictory Footnote does, because that is where Elara actually demonstrates the defining pattern.

Later reciprocal correction and independent verification complete assimilation.

## 7. Transaction order

For migrated Resonance, validation occurs before irreversible state changes.

The thunk:

1. validates Trait definition and discovery;
2. validates source NPC and qualified Connection;
3. validates assimilation and compatibility;
4. validates required Memory evidence and Trait prerequisites;
5. validates enough Essence;
6. validates/records the authored final Resonance Experience;
7. spends Essence;
8. adds the Trait to `player.permanentTraits`;
9. frees any temporary player slot containing that Trait;
10. emits success feedback.

The authored event is idempotent, and the permanent-Trait check prevents repeated acquisition from spending Essence twice.

## 8. Save / reload / New Game behavior

### Definition reload

Reloading Trait definitions preserves authored discoveries already present in the save while seeding only `initial` Traits.

### Additive relationship-save repair

If an older relationship save already contains the authored discovery Experience but lacks the later discovery flag, idempotently replaying the authored Experience repairs the missing discovery state without duplicating relationship history.

### New Game

New Game explicitly resets Trait progression while retaining the loaded catalogue.

`resetTraitsState` recomputes discovery from only `initial` Traits, so authored relationship patterns must be recognized again in the new run.

## 9. NPC Trait UI

### Before discovery

An authored hidden pattern is not fully identified.

`NPCTraitsTab` shows only:

```text
Undiscovered Pattern
Meaningful relationship evidence may reveal a Trait pattern here.
```

It does not expose:

- name;
- description;
- Essence cost;
- Connection requirement;
- assimilation/compatibility values;
- Memory requirements.

The action is disabled as `Undiscovered`.

The NPC Overview also filters innate Traits to discovered patterns and refuses temporary equip of an undiscovered id.

### After discovery

The normal migrated Trait card explains:

- Connection current / required;
- assimilation current / required;
- compatibility current / required;
- required Memory tag status;
- Essence cost.

The Resonate button is enabled only when every applicable gate passes.

Legacy NPC Traits continue to show the older `connectionDepth` requirement.

## 10. NPC innate Trait equipping

The temporary innate-Trait flow remains conceptually separate from permanent Resonance:

- the NPC retains its Trait;
- only discovered patterns are player-visible/equippable;
- the player temporarily equips a usable instance into a player Trait slot;
- no permanent acquisition occurs merely from equipping.

## 11. Trait sharing

Existing sharing behavior remains outside the relationship redesign:

- equipped, non-permanent player Traits may be shared where NPC/Copy slot rules allow;
- listeners remove incompatible shares when a Trait is unequipped, replaced, or made permanent.

M8 does not redesign Copy Trait inheritance.

## 12. Invariants

1. Loading a Trait definition is not automatically discovery when `discoveryMode = authored`.
2. Discovery is recognition, not assimilation or permanence.
3. Undiscovered authored patterns cannot be permanently Resonated.
4. Undiscovered authored patterns cannot be temporarily equipped through the NPC Overview.
5. Player-facing UI must not leak the full hidden Trait contract before discovery.
6. Reloading definitions preserves earned discoveries.
7. New Game clears authored discoveries while preserving definitions and initial knowledge.
8. Permanent Resonance is not equivalent to paying Essence for a Trait.
9. Migrated relationship-mediated Traits require evidence and assimilation.
10. Unmigrated Traits preserve existing compatibility behavior until deliberately migrated.
11. A failed gate spends no Essence and adds no permanent Trait.
12. A successful permanent acquisition spends its Essence cost exactly once.
13. Missing authored final-event data must fail before currency/permanence reducers commit.

## 13. Known limitations / deferred work

- Most legacy/simple Traits still default to initially known; they have not been given authored discovery content.
- Relationship Experiences are only one possible future discovery source; quests, exploration, combat, research, or items may reveal other Traits.
- Historical pre-Relationships saves do not reconstruct perfect discovery provenance; M8 only performs conservative additive repair from existing authored evidence.
- advanced Trait combinations, synergies, and broad Copy redesign remain out of scope.

For the full M8 migration rationale and qualification evidence, see [`../Technical/TraitDiscoveryContract.md`](../Technical/TraitDiscoveryContract.md).
