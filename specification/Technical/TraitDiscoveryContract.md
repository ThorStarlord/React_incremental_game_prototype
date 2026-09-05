# Trait Discovery Contract

**Status:** M8 implemented; exact-head requalification pending after documentation reconciliation  
**Scope:** Trait catalogue loading, authored discovery, New Game reset, relationship evidence integration, and player-facing information boundaries  
**Purpose:** Make `Discover -> Equip/Attune -> Assimilate -> Resonate` a real progression lifecycle rather than a nominal gate that catalogue loading satisfied automatically.

---

## 1. Problem

Before M8, `TraitsSlice.loadTraits` treated definition loading as discovery. On an empty `discoveredTraits` array it populated every loaded Trait id.

That created a mismatch between the documented lifecycle and runtime semantics:

```text
claimed:
Discover -> Equip -> Assimilate -> Resonate

actual:
load catalogue -> everything discovered
             -> Equip -> Assimilate -> Resonate
```

`acquireTraitWithEssenceThunk` already rejected an undiscovered Trait, but the predicate was usually vacuous because normal catalogue loading discovered everything.

For relationship-mediated Traits this was especially damaging. A player could know the identity and permanent-acquisition requirements of a pattern before experiencing the person strongly enough to recognize that pattern at all.

M8 separates **definition availability** from **player knowledge**.

---

## 2. Canonical lifecycle

The relationship-mediated Trait lifecycle is now:

```text
Pattern exists in catalogue
-> authored evidence makes the pattern recognizable
-> Trait is discovered
-> player may temporarily Equip / Attune
-> later Experiences build assimilation + compatibility
-> Connection / Memory / prerequisite evidence qualifies Resonance
-> Essence stabilizes the already-qualified pattern permanently
```

The semantic distinctions are:

- **Discovery = recognition.** The player has encountered enough evidence to identify the pattern as something that exists and could potentially be learned.
- **Assimilation = learning/internalization.** The protagonist is becoming able to reproduce the pattern rather than merely recognizing it in another person.
- **Resonance = permanence.** Essence stabilizes a pattern already recognized, learned, and otherwise qualified.

These are separate state transitions. One does not substitute for another.

---

## 3. Discovery modes

`Trait` now supports:

```typescript
type TraitDiscoveryMode = 'initial' | 'authored';

discoveryMode?: TraitDiscoveryMode;
```

### `initial`

The Trait is player-known when the catalogue is loaded.

For migration compatibility, an omitted `discoveryMode` defaults to `initial`.

This preserves existing prototype behavior for ordinary/legacy Traits and avoids forcing an immediate authoring migration across the entire Trait catalogue.

### `authored`

The catalogue contains the definition, but loading it does **not** add the id to `discoveredTraits`.

An explicit authored event must reveal the pattern.

Current production relationship-mediated authored Traits:

- `WillowsWisdom`;
- `ScholarlyInsight`.

---

## 4. Catalogue loading contract

`loadTraits` now does three things independently:

1. loads/replaces Trait definitions;
2. seeds Traits whose discovery mode is `initial`;
3. preserves discoveries already earned in the current save when those ids still exist in the incoming catalogue.

Conceptually:

```text
new discovered set
=
initially-known ids from incoming definitions
UNION
previously-earned discovered ids that still exist
```

This means:

- loading definitions is not discovery;
- reloading definitions does not revoke earned authored discoveries;
- removed Trait ids do not survive as dangling discoveries.

---

## 5. Authored relationship discovery

`RelationshipTraitEffect` now supports:

```typescript
interface RelationshipTraitEffect {
  traitId: string;
  discover?: boolean;
  compatibilityDelta?: number;
  assimilationDelta?: number;
  note?: string;
}
```

When an authored Relationship Experience has `discover: true`, the relationship thunk reveals that Trait pattern if it is not already discovered.

The event may also change compatibility or assimilation, but those are independent effects.

A discovery emits player feedback:

```text
Trait pattern discovered: <Trait Name>.
```

### Discovery is authored evidence, not Connection level

M8 deliberately does **not** say:

```text
Connection I -> discover all NPC Traits
```

Discovery is attached to the event in which the relevant pattern becomes recognizable.

This keeps the causal meaning specific to the fiction rather than making Connection another generic unlock threshold.

---

## 6. Current production discovery beats

### Willow's Wisdom

Discovery mode:

```text
authored
```

Discovery Experience:

**The First Lesson** — `willow_exp_first_lesson`

Willow demonstrates that immediate appearances are poor evidence for slow systems. That is the first point at which the protagonist has actually observed the cognitive pattern represented by `WillowsWisdom`.

The First Lesson therefore both:

- reveals that the Trait pattern exists;
- begins low-rate assimilation/compatibility work.

Later teaching and independent application are still necessary for full assimilation and permanent Resonance.

So:

```text
First Lesson
-> recognize Willow's pattern
!=
master Willow's pattern
```

### Scholarly Insight

Discovery mode:

```text
authored
```

Discovery Experience:

**The Contradictory Footnote** — `elara_exp_contradictory_footnote`

The opening objection establishes that the protagonist can challenge Elara, but it does not yet demonstrate Elara's defining evidence-first habit strongly enough to reveal the Trait.

The Contradictory Footnote does: Elara treats contradictory evidence as a model-breaking problem to investigate rather than something to dismiss to protect the accepted chronology.

That is the first concrete recognition point for `ScholarlyInsight`.

Later mutual correction and independent verification are still required for complete assimilation.

---

## 7. New Game semantics

A fresh New Game must not inherit authored discoveries from the previous in-memory run.

`resetTraitsState` now:

- keeps the already-loaded Trait definitions;
- clears presets/loading/error state as before;
- recomputes `discoveredTraits` from only `initial` Traits.

`useGameActions.handleNewGame` explicitly dispatches this reset alongside Player, Essence, Inventory, Quest, NPC, and Copy reset work.

Therefore:

```text
previous run discovered Willow's Wisdom
-> New Game
-> Willow's Wisdom definition still exists
-> Willow's Wisdom is no longer discovered
-> The First Lesson can reveal it again
```

This is necessary for repeatable onboarding and for honest fresh-game qualification.

---

## 8. Save/reload compatibility

### Definition reload

If a save already contains an authored Trait id in `discoveredTraits`, `loadTraits` preserves it.

This prevents normal catalogue refresh from taking away already-earned knowledge.

### Older relationship save repair

An intermediate save can contain the authored Relationship Experience but lack the newer explicit discovery flag because the Experience existed before M8.

`recordAuthoredRelationshipExperienceThunk` therefore applies discovery effects even when the Experience is already idempotently recorded.

In that replay case:

- the Experience is **not** duplicated;
- the Memory is **not** duplicated;
- missing additive Memory state may still be repaired by the existing migration path;
- missing Trait discovery is silently restored;
- no duplicate discovery notification is emitted.

This yields a conservative migration rule:

> If the save already contains the causal authored evidence, the newer derived discovery state may be repaired from that evidence without fabricating a new event.

M8 does not attempt a broader pre-Relationships historical reconstruction.

---

## 9. Player-facing information boundary

Discovery is meaningful only if undiscovered patterns are not fully revealed elsewhere.

### NPC Overview

The innate Trait section now shows only discovered Trait patterns.

Before discovery, an authored hidden Trait:

- is not named;
- cannot be temporarily equipped from Overview.

After discovery, the NPC can expose the recognized pattern for temporary attunement as before.

### NPC Traits / Resonance

An undiscovered available Trait is represented only as:

```text
Undiscovered Pattern
Meaningful relationship evidence may reveal a Trait pattern here.
```

The UI does not reveal:

- Trait name;
- description;
- Essence cost;
- Connection requirement;
- assimilation percentage;
- compatibility;
- required Memory tags.

The action is disabled as `Undiscovered`.

Once the authored discovery event occurs, the full existing Resonance gate becomes visible.

This preserves the information lifecycle:

```text
unknown pattern
-> recognized pattern
-> understandable gate
-> assimilated pattern
-> permanent pattern
```

---

## 10. Qualification

### Dedicated state/relationship suite

`TraitDiscovery.test.ts` verifies:

1. catalogue loading keeps a legacy/simple Trait initially known;
2. an `authored` Trait definition loads without being discovered;
3. reloading definitions preserves an earned authored discovery;
4. duplicate preservation does not duplicate ids;
5. reset retains definitions while clearing authored discoveries;
6. production `WillowsWisdom` and `ScholarlyInsight` declare authored discovery;
7. their production Relationship Experiences declare `discover: true`;
8. Willow's opening question does not reveal `WillowsWisdom`;
9. The First Lesson does reveal it;
10. Elara's opening challenge does not reveal `ScholarlyInsight`;
11. The Contradictory Footnote does reveal it;
12. replaying a discovery event remains idempotent;
13. an older-save-style recorded Experience can repair missing discovery without duplicating history.

### Existing integration proofs strengthened

The routed Willow M5 fixture now marks `WillowsWisdom` as authored discovery and reveals it only in the First Lesson.

The complete UI path must therefore successfully discover the Trait before it can later inspect/Resonate it.

The production-data-backed Elara M7 suite now additionally proves:

- `ScholarlyInsight` starts undiscovered;
- enough Essence cannot bypass that state;
- the first challenge alone does not discover it;
- The Contradictory Footnote does;
- the rest of the collaborative path can then assimilate and permanently Resonate it.

### Code candidate result

Build Validation **#102** on code candidate `ce1553763d1f13afc267bb83f5203e50c7babbfc` passed:

- `npm ci`;
- `npx tsc --noEmit`;
- Willow/M4 regression;
- routed Willow/M5;
- Lyra/M6;
- Elara/M7;
- M8 Trait discovery suite;
- production build.

The first M8 red run was a TypeScript-only test-fixture literal-widening issue (`'authored'` inferred as `string`); the runtime model was unchanged. The fixture was corrected to preserve the literal type and then requalified.

Because this document and feature-spec reconciliation create later commits, final exact-head qualification must be taken from the Build Validation run after those documentation changes.

---

## 11. Evidence ceiling

M8 does **not** claim:

- every Trait in the game now has authored discovery content;
- legacy/simple Traits have been redesigned;
- all possible discovery sources must be relationship Experiences;
- historical pre-Relationships saves can reconstruct discovery provenance perfectly.

The compatibility choice is intentional:

> Omitted discovery mode means initially known until that Trait is deliberately migrated.

Future Traits may be discovered by quests, exploration, combat, research, items, or other explicit sources. The invariant is not “relationships discover all Traits.”

The invariant is:

> **Definition availability is not automatically player knowledge when a Trait declares an authored discovery lifecycle.**

---

## 12. M8 conclusion

Before M8, `Trait discovered` was present in the Resonance gate but usually satisfied by infrastructure startup.

After M8, relationship-mediated discovery has an actual causal event and an actual information boundary.

The complete relationship-mediated progression is therefore now:

```text
Meet a person
-> observe a meaningful pattern
-> DISCOVER it
-> temporarily attune to the recognized pattern
-> learn through relevant Experiences
-> ASSIMILATE it
-> satisfy Connection + Memory evidence
-> spend Essence
-> RESONATE it permanently
```

**Discovery is recognition. Assimilation is learning. Resonance is permanence.**
