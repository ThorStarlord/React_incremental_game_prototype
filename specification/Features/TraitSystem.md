# Trait System Specification

**Implementation Status:** ✅ Core discovery/equip/permanent Trait flow implemented; permanent-Resonance runtime-authority gating + bounded two-profile doctrine composition implemented  
**Relationship migration:** ✅ Willow, Elara, Gronk, and Lyra use authored discovery + evidence/assimilation Resonance; unmigrated Traits retain compatibility behavior  
**Discovery contract:** [`../Technical/TraitDiscoveryContract.md`](../Technical/TraitDiscoveryContract.md)  
**Gameplay doctrine:** [`../Technical/PostM16TraitGameplayReconciliation.md`](../Technical/PostM16TraitGameplayReconciliation.md)  
**Build specialization:** [`../Technical/RelationshipCapabilityConstellation.md`](../Technical/RelationshipCapabilityConstellation.md)

Traits represent internalized capabilities or patterns that can change what the protagonist can perceive, understand, attempt, perform, or passively sustain. Numerical/passive modifiers remain legitimate Trait effects, but they are not the complete product definition of a Trait.

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
- `ScholarlyInsight` — discovered during **The Contradictory Footnote**;
- `ConstraintSense` — discovered during **Measure Twice** with Gronk;
- `AdversarialCalibration` — discovered during **Coercion Reflected** with Lyra.

Discovery is attached to the event where the pattern becomes recognizable, not to Connection level by itself.

### 1.2 Temporary equipping

Discovered non-permanent Traits may occupy the player's limited Trait slots.

Temporary equipping:

- costs no Essence;
- is reversible;
- can provide qualified direct Player-stat effects while slotted;
- stages an equipped non-permanent Trait for NPC/Copy sharing where the target rules allow it;
- supports experimentation before the player commits Essence to permanent Resonance.

Permanent Traits do not require an active slot and are no longer shareable from Player Trait slots.

Undiscovered authored patterns cannot be equipped from the NPC Overview.

Campaign One does **not** treat temporary/equipped Traits as equivalent to permanent learned capability for authored gameplay gates. The finished-game role of temporary slots is therefore bounded: **experiment / temporarily benefit / share before internalization**. Doctrine, not temporary slots, owns current late-game specialization. This does not claim that temporary attunement already has enough human-validated strategic depth to justify presets or a larger loadout system.

### 1.3 Gameplay capability authority

M16 qualifies the following authority chain for Relationship-derived permanent Traits:

```text
Relationship history -> explains / qualifies how the capability was learned
Trait state           -> owns whether the durable capability now exists
Gameplay system       -> decides whether that capability is applicable here
Player                 -> decides whether to use the available capability
Relationship          -> later interprets what the player actually did
```

A strong Relationship, Memory, Affinity value, Connection level, or legacy `connectionDepth` must not substitute for permanent Trait ownership when gameplay is asking whether the protagonist has learned the capability.

M16 production examples:

- permanent `WillowsWisdom` enables the optional **Restore the Underlying Flow** resolution in **The Withering Grove**;
- permanent `ScholarlyInsight` enables the optional **Reopen the Model Around the Contradiction** resolution in **The Impossible Inventory**;
- both problems retain an ordinary valid route without the Trait;
- invalid direct invocation of a permanent-Trait-only resolution is rejected below the UI.

Current qualified quest consumption uses `QuestResolutionOption.requiredPermanentTraitIds`.

The design invariant is:

```text
capability != decision
```

A Trait may reveal or authorize an action without automatically choosing it for the player.

### 1.4 Capability identity

Important Relationship-derived Traits should ideally express a coherent capability identity beyond an interchangeable percentage bonus.

Useful authoring concepts include perceptual, interpretive, procedural, tactical, social, physical, productive, and passive capabilities. These are design categories, not a required runtime enum.

Authoring test:

```text
Because the protagonist internalized [TRAIT],
they can now ____________________________________.
```

Significant uses of the same Trait should be defensible from the same underlying learned pattern rather than behaving as unrelated content keys.

Trait-enabled options should usually expand meaningful solution space rather than become a guaranteed "best" answer. See `PostM16TraitGameplayReconciliation.md` for the full doctrine and evidence/design boundary.

### 1.5 Learned capability vs active doctrine

Permanent learning and current specialization are separate authorities.

```text
player.permanentTraits
= durable learned capability

player.doctrineFocus
= permanently learned principles currently foregrounded together

derived active doctrine
= emergent interpretation of that focus
```

Campaign One currently qualifies only two established two-Trait profiles:

- **Structural Steward** — `WillowsWisdom + ConstraintSense`;
- **Countermodeler** — `ScholarlyInsight + AdversarialCalibration`.

A doctrine is not a separately acquired Trait and is not independently persisted as a boolean. Runtime selectors derive it only when all required Traits are both permanently learned and foregrounded.

Quest and Dialogue authoring may use `requiredActiveDoctrineIds` where a choice specifically depends on current specialization. The player-facing Doctrine tab now qualifies explicit Adopt / Switch / Clear control for eligible learned pairs, and Player Insight projects the active doctrine read-only. GC06 establishes the first specialization gate; GC08 preparation and GC10 finale routes now reuse active doctrine where the player is explicitly choosing or carrying a strategic posture. GC07 and GC09 intentionally retain permanent-Trait-pair gates so learned capability remains useful without forcing repetitive menu switching every chapter.

See `RelationshipCapabilityConstellation.md` for the bounded Redux, persistence, consumption, and evidence contract.

### 1.4 Permanent Resonance runtime authority

A discovered Trait is not automatically a legal permanent Essence purchase merely because it has historical effect metadata.

`summarizeTraitAuthority` distinguishes:

```text
direct_player_stat
named_runtime
semantic_capability
deferred_legacy
```

Permanent Player Resonance requires at least one **durable Player authority**:

- a direct Player-stat effect consumed by the Player stat pipeline; or
- a semantic capability consumed by authored gameplay requirements.

A `named_runtime` effect may be real without being a permanent Player effect. The production example is `EssenceFlow.essenceGenerationMultiplier`: it is consumed by Copy Essence generation when the Trait is shared/inherited by a Copy, so the Trait remains meaningful as temporary/shareable content but cannot consume Essence to become a permanent Player Trait.

A Trait whose effects are entirely `deferred_legacy` cannot be permanently Resonated. This prevents obsolete JSON metadata from charging the player for a capability the current game does not execute.

The shared readiness projection exposes these blockers to the Management/Codex surfaces and the acquisition thunk reuses the same fail-closed authority before any Essence is spent.

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

### 5.3 Qualified gameplay identity

M16 uses Willow's Wisdom as a bounded interpretive/systemic capability: the player can recognize that visible grove corruption is a symptom of an underlying slow Essence-flow imbalance and may choose a restoration route.

This does not imply that every future Willow's Wisdom use is automatically correct or superior. Future uses should remain coherent with the underlying slow-pattern/systemic-causation identity.

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

M16 then reused that same semantic identity in **The Impossible Inventory**, where permanent `ScholarlyInsight` allows the protagonist to reopen a model around mutually incompatible records rather than accept the first plausible reconstruction.

## 7. Transaction order

For migrated Resonance, validation occurs before irreversible state changes.

The thunk:

1. validates Trait definition and discovery;
2. validates source NPC and qualified Connection;
3. validates assimilation and compatibility;
4. validates required Memory evidence and Trait prerequisites;
5. validates that the Trait has qualified durable Player authority for permanent Resonance;
6. validates enough Essence;
7. validates/records the authored final Resonance Experience;
8. spends Essence;
9. adds the Trait to `player.permanentTraits`;
10. frees any temporary player slot containing that Trait;
11. emits success feedback.

The authored event is idempotent, and the permanent-Trait check prevents repeated acquisition from spending Essence twice.

## 8. Save / reload / New Game behavior

### Definition reload

Reloading Trait definitions preserves authored discoveries already present in the save while seeding only `initial` Traits.

### Additive relationship-save repair

If an older relationship save already contains the authored discovery Experience but lacks the later discovery flag, idempotently replaying the authored Experience repairs the missing discovery state without duplicating relationship history.

### New Game

New Game explicitly resets Trait progression while retaining the loaded catalogue.

`resetTraitsState` recomputes discovery from only `initial` Traits, so authored relationship patterns must be recognized again in the new run.

Permanent Trait ownership is part of saved player progression. M16 qualified permanent `WillowsWisdom` surviving save/load before its gameplay capability was consumed.

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

Gameplay-option presentation is owned by the consuming gameplay system. M16 qualifies hidden unavailable permanent-Trait quest resolutions; visible-but-unavailable presentation remains a future design/UI choice.

## 10. NPC innate Trait equipping

The temporary innate-Trait flow remains conceptually separate from permanent Resonance:

- the NPC retains its Trait;
- only discovered patterns are player-visible/equippable;
- the player temporarily equips a usable instance into a player Trait slot;
- no permanent acquisition occurs merely from equipping.

Temporary equipping must not be silently treated as equivalent to permanent authored gameplay mastery without dedicated evidence.

## 11. Trait sharing

Existing sharing behavior remains outside the relationship redesign:

- only equipped, non-permanent Player Traits may be shared where NPC/Copy slot rules allow;
- both the normal UI and mutation thunks enforce that boundary;
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
14. Relationship history qualifies learning; permanent Trait state owns the currently qualified durable gameplay capability.
15. Capability availability does not automatically make the player's decision.
16. Relationship deterioration does not normally erase an already permanent internalized Trait.
17. Trait-enabled actions are interpreted by their consequences; Trait use does not automatically produce positive Relationship reward.

## 13. Depth-repair authority

The bounded Trait depth repair establishes three additional runtime invariants:

- `player.resonanceLevel` automatically unlocks every Player Trait slot whose documented Resonance-level requirement is met;
- `Trait.essenceCost` is the only authoritative permanent-Resonance price; callers cannot discount or override it;
- `evaluateTraitResonanceReadiness` is the shared player-facing/runtime projection for discovery, Relationship/legacy source gates, prerequisites, Memory evidence, assimilation, compatibility, and Essence affordability.

The general Traits management surface consumes that readiness projection instead of presenting an Essence-only Resonance affordance.

The authored production catalogue also normalizes `ConstraintSense` and `AdversarialCalibration` category/rarity casing and removes stale legacy `requirements.relationshipLevel` fields from Willow/Elara. Modern Relationship authority is expressed only through the explicit Connection/assimilation/compatibility/Memory contract.

The coherence package adds independent semantic use for the two previously pair-dominant source Traits during GC08 distributed preparation:

- permanent `ConstraintSense` may identify and protect the procedure's critical bottlenecks without requiring Structural Steward;
- permanent `AdversarialCalibration` may red-team the distributed procedure without requiring Countermodeler.

Both are local refinements of the distributed preparation path. They do not replace the two-Trait doctrines or manufacture new doctrine identities.

Focused qualification:

```bash
npm run trait-depth:validate
```

This repair does **not** promote the full Trait catalogue to feature-complete status and does not authorize a generic capability graph.

## 14. Known limitations / deferred work

- Most legacy/simple Traits still default to initially known; they have not been given authored discovery content.
- Relationship Experiences are only one possible future discovery source; quests, exploration, combat, research, or items may reveal other Traits.
- Historical pre-Relationships saves do not reconstruct perfect discovery provenance; M8 only performs conservative additive repair from existing authored evidence.
- Temporary/equipped Traits are qualified as reversible experimentation/direct-effect/share staging, but temporary ownership still does not satisfy permanent-capability gameplay gates. Human value of that slot loop remains unproven.
- The two established Campaign One doctrine pairs are the only qualified synergy composition; GC06/GC08/GC10 consume current doctrine while GC07/GC09 preserve permanent-pair capability gates. GC08 now also gives `ConstraintSense` and `AdversarialCalibration` bounded independent uses in GC08 and now repeat them as single-capability GC09 judgment surfaces with finale-aftereffect provenance. A generic capability graph, arbitrary pair lattice, N-way combinations, and broad Copy redesign remain out of scope.
- Permanent-Trait and active-doctrine gates remain explicit bounded fields, not a general stat/skill/ability condition DSL.

For the full M8 migration rationale and qualification evidence, see [`../Technical/TraitDiscoveryContract.md`](../Technical/TraitDiscoveryContract.md).

For the post-M16 gameplay doctrine and evidence/design boundary, see [`../Technical/PostM16TraitGameplayReconciliation.md`](../Technical/PostM16TraitGameplayReconciliation.md).
