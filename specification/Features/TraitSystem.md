# Trait System Specification

**Implementation Status:** ✅ Core discovery/equip/permanent Trait flow implemented  
**Relationship migration:** ✅ `WillowsWisdom` uses M4 evidence + assimilation Resonance; unmigrated NPC Traits retain the legacy gate.

Traits provide passive modifications to player capabilities and support temporary equipping, permanent Resonance, NPC sharing, and Copy-related integration.

## 1. Trait lifecycle

```text
Discover
-> temporarily Equip / Attune
-> (for relationship-mediated Traits) Assimilate
-> Resonate permanently
```

### Discovery

A Trait must be present in `traits.discoveredTraits` before permanent Resonance.

The current prototype broadly discovers NPC Traits when their NPC is viewed, so the discovery predicate is enforced but the Willow vertical slice does **not yet prove narratively earned discovery**. That is a known limitation, not part of M4's authority cutover.

### Temporary equipping

Discovered non-permanent Traits may occupy the player's limited Trait slots.

Temporary equipping:

- costs no Essence;
- is reversible;
- can provide Trait effects while slotted;
- may participate in NPC/Copy sharing where existing rules allow it.

Permanent Traits do not require an active slot.

## 2. Resonance authority

Permanent acquisition is centralized in:

`src/features/Traits/state/TraitThunks.ts#acquireTraitWithEssenceThunk`

The gate depends on whether the Trait's source NPC has migrated to Relationship authority.

### 2.1. Legacy NPC-sourced Traits

For unmigrated NPCs, the existing compatibility gate remains:

```text
Trait discovered
+ source NPC connectionDepth >= legacy minimum
+ Trait prerequisites
+ enough Essence
-> spend Essence
-> permanent Trait
```

`TRAIT_RESONANCE.MIN_CONNECTION_DEPTH` remains the default legacy threshold.

### 2.2. Relationship-mediated Traits

For a source NPC whose `RelationshipProgressionDefinition.connectionAuthority` is `relationships`, the new gate is:

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

Essence is the final stabilization cost. It cannot substitute for missing relational evidence.

## 3. Relationship-mediated Trait metadata

A Trait may declare:

```typescript
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

## 4. Trait assimilation state

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
  compatibilityDelta?,
  assimilationDelta?
}]
```

Landmark Memories whose `traitRelevance` contains the Trait are recorded as qualifying Memory evidence.

## 5. Willow's Wisdom — first migrated Trait

`WillowsWisdom` currently declares:

- source: `npc_elder_willow`;
- permanent Essence cost: `40`;
- minimum qualified Connection: `2`;
- assimilation threshold: `100%`;
- minimum compatibility threshold;
- required Memory tag: `Application`;
- final authored Resonance event: `willow_exp_resonance_wisdom`.

### Assimilation path

The Willow slice uses bounded authored teaching/application events rather than relying on raw real-time proximity:

1. **The First Lesson** — initial exposure and low assimilation.
2. **Three Nights of Teaching** — primary sustained practice segment.
3. **The Lesson Made Yours** — independent application, completing the authored assimilation proof.

The canonical authored path totals 100% assimilation for `WillowsWisdom`.

### Evidence requirement

`The Lesson Made Yours` and/or another qualifying Memory carrying the required `Application` tag matters mechanically.

Having 40 Essence without this evidence is insufficient.

## 6. Transaction order

For migrated Resonance, validation occurs before irreversible state changes.

The thunk:

1. validates all gates;
2. validates/records the authored final Resonance Experience;
3. spends Essence;
4. adds the Trait to `player.permanentTraits`;
5. frees any temporary player slot containing that Trait;
6. emits success feedback.

The authored event is idempotent, and the permanent-Trait check prevents a repeated acquisition attempt from spending Essence a second time.

## 7. NPC Trait UI

`NPCTraitsTab` now exposes why a migrated Trait is locked.

For `WillowsWisdom` it shows:

- Connection current / required;
- assimilation current / required;
- compatibility current / required;
- required Memory tag status;
- Essence cost.

The Resonate button is enabled only when every applicable gate passes.

Legacy NPC Traits continue to show the older `connectionDepth` requirement.

## 8. NPC innate Trait equipping

The existing temporary innate-Trait flow remains unchanged:

- the NPC retains its Trait;
- the player temporarily equips a usable instance into a player Trait slot;
- no permanent acquisition occurs merely from equipping;
- this is separate from Resonance.

## 9. Trait sharing

Existing sharing behavior remains outside the M4 redesign:

- equipped, non-permanent player Traits may be shared where NPC/Copy slot rules allow;
- listeners remove incompatible shares when a Trait is unequipped, replaced, or made permanent.

M4 does not redesign Copy Trait inheritance.

## 10. Invariants

1. Permanent Resonance is not equivalent to paying Essence for a Trait.
2. Migrated relationship-mediated Traits require evidence and assimilation.
3. Unmigrated Traits preserve existing compatibility behavior until their source content migrates.
4. A failed gate spends no Essence and adds no permanent Trait.
5. A successful permanent acquisition spends its Essence cost exactly once.
6. A permanent Trait is added at most once.
7. Missing authored final-event data must fail before currency/permanence reducers commit.

## 11. Known limitations / deferred work

- Trait discovery is still broad in the prototype and needs a later narrative-discovery cleanup.
- Only Willow's relationship-mediated Trait path is qualified so far.
- Lyra is the next planned generalization/falsification target.
- advanced Trait combinations, synergies, and broad Copy redesign remain out of scope.
