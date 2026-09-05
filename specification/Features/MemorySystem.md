# Memory System

**Design Status:** Canonical target design; runtime implementation pending  
**Scope:** Universal landmark-memory layer for relationship progression

## 1. Purpose

A Memory is the curated, durable subset of the Relationship Experience ledger that the player and narrative can treat as a defining rung in a relationship arc.

The system preserves a strict separation:

```text
Relationship Experience = what happened and what changed
Memory                  = which events became defining
Bond Profile             = what the relationship is now
```

Every Memory references one originating Relationship Experience. Most Experiences never become Memories.

The Memory layer exists for three reasons:

1. **Narrative legibility:** the player can understand why a relationship changed;
2. **Mechanical evidence:** Resonance and Connection qualifications can point to actual history rather than hidden numbers;
3. **Continuity:** later dialogue and quests can refer to shared history without inventing justification after the fact.

---

## 2. Memory is not an achievement badge

A Memory is not awarded merely because a quest was completed or a numeric threshold was reached.

It must encode a meaningful interpretation of an Experience.

For example:

```text
Quest complete: The Ancient Seed
```

is not, by itself, a Memory.

A valid Memory might instead be:

```text
The Seed Preserved
You gave up an immediate advantage to protect something whose value
Willow had taught you to see.
```

The quest is the delivery mechanism. The relational meaning is the Memory.

---

## 3. Memory schema

```text
MEMORY_ID:             [stable unique id]
Title:                 [short player-facing landmark name]
Origin Experience:     [EXPERIENCE_ID]
Timestamp:             [game/simulation time]
Participants:          [character ids]
Primary Target:        [NPC id]

Memory Type:           [Shared / Target / Protagonist / Asymmetric]
Significance:          [Meaningful / Major / Defining]
Player Visible:        [yes / no]

Meaning:
  Summary:             [one or two sentences]
  Protagonist View:    [optional]
  Target View:         [optional]

Relationship Imprint:
  Affinity:            [qualitative or numeric contribution]
  Trust:
  Understanding:
  Shared Meaning:
  Reliance:
  Vulnerability:
  Reciprocity:
  Custom Dimensions:  [optional]

Resonance Tags:        [semantic tags]
Bond Contribution:    [archetype established/advanced/contested/etc.]
Trait Relevance:       [trait ids or trait-tag families]

Persistence:           [Stable / Contested / Reinterpretable]
Current Interpretation:[optional current meaning if reinterpreted]

Unlocks:               [dialogue / quest / behavior / Resonance hooks]
Narrative Notes:       [authoring context]
```

---

## 4. Memory types

### Shared

Both participants recognize the event as meaningful, even if they interpret it differently.

Example: the player and Willow both remember the choice surrounding the Ancient Seed.

### Target

The event is especially meaningful to the NPC, while the protagonist may still regard it instrumentally.

This supports early-game manipulation without pretending reciprocity already exists.

### Protagonist

The event meaningfully changes the protagonist even if the NPC does not yet recognize that change.

This is especially useful for Trait assimilation and the protagonist's gradual ideological arc.

### Asymmetric

Both parties remember the event, but its meaning is substantially different to each.

This should be common in rivalry, manipulation, betrayal, and ideologically contested relationships.

---

## 5. Landmark qualification

A Relationship Experience should become a Memory if one or more of the following is true:

- it establishes a new interpretation of the relationship;
- it demonstrates a Connection-Level qualification;
- it establishes or changes a Bond archetype;
- it creates durable evidence for Trait Resonance;
- it represents a costly choice, meaningful refusal, sacrifice, disclosure, or irreversible commitment;
- later authored content needs to cite the event as relational evidence;
- it is a thematic beat the audience should remember as an arc rung.

The game should avoid making routine rewards, generic compliments, repeated gifts, or low-information dialogue into Memories.

### 5.1 Memory density guideline

For a compact relationship vertical slice, approximately **2–4 Memories across 6–10 meaningful Experiences** is a useful starting ratio.

This is an authoring heuristic, not a runtime rule.

---

## 6. Memory persistence and reinterpretation

Historical events do not disappear because the relationship later worsens.

A betrayal should not delete an earlier rescue. Instead, it may change what that rescue means.

Example:

```text
Memory: The Promise at the Tree
Persistence: Reinterpretable

Original interpretation:
"She entrusted me with something she could not protect alone."

After betrayal:
"She entrusted me because I had already made myself indispensable."
```

The originating Experience remains immutable. `Current Interpretation` may change when later events justify reinterpretation.

This lets the relationship have history rather than functioning as a stat snapshot.

---

## 7. Memory and Bond archetypes

A single Memory may suggest an archetype; a stable archetype normally emerges from a pattern.

Example:

```text
Memory: The Seed Preserved
Memory: Three Nights of Teaching
Memory: The Lesson Made Yours

=> Mentor / Student established
```

A later Memory can contest or transform that archetype:

```text
Memory: The Lesson You Rejected

=> Mentor / Student contested
=> Ideological Counterpart emerging
```

The Bond Profile stores the current archetypes; Memories provide the evidence.

---

## 8. Memory and Trait Resonance

Memories can provide Trait-relevant evidence without directly granting the Trait.

Example:

```text
Trait: Willow's Wisdom
Relevant Memories:
  [x] The Seed Preserved
  [x] The Lesson Made Yours
  [ ] Beneath the Old Tree
```

A qualifying Memory can:

- increase compatibility with a Trait's semantic tags;
- satisfy a required evidence condition;
- increase assimilation efficiency;
- unlock a Resonance attempt;
- change the meaning of the final Resonance scene.

A Memory never substitutes for all other requirements. Connection, assimilation, and Essence cost remain separate concerns.

---

## 9. Player-facing Memory Cards

The target UI should show only player-visible landmark Memories.

A Memory Card should favor evocative meaning over raw simulation details.

Example:

```text
THE SEED PRESERVED
Elder Willow

You chose to protect something whose value you could not yet prove.
Willow stopped treating your questions as mere appetite for power.

Relationship impact:
  Understanding: Major increase
  Trust: Moderate increase
  Shared Meaning: Major increase

Resonance:
  Wisdom compatibility strengthened
```

The detailed Experience deltas belong in debug/authoring surfaces, not necessarily in the normal player UI.

---

## 10. Hidden memories

Not every Memory must be immediately player-visible.

A hidden Memory may exist when:

- only the NPC recognizes the significance;
- revealing it would spoil an interpretation;
- it should surface through later dialogue;
- it represents a protagonist transformation the player should infer before the system confirms it.

Hidden Memories still participate in Bond and Resonance logic if authored to do so.

---

## 11. Memory invariants

1. Every Memory references a valid Relationship Experience.
2. A Memory does not duplicate the Experience ledger; it summarizes significance.
3. Memory formation is rarer than Experience creation.
4. Memories remain historical evidence even when current relationship dimensions decline.
5. Reinterpretation may change meaning, not rewrite the originating event.
6. Memory visibility is independent from mechanical existence.
7. A Memory can support multiple Resonance tags or Bond archetypes.
8. Memory titles should be short landmark labels, not chapter names.
9. Numeric relationship state must not be used as the sole explanation for why a Memory exists.
10. Memory logic should be generic before NPC-specific exceptions are introduced.

---

## 12. Elder Willow starter Memory set

The first vertical slice should aim to prove the system with three candidate Memories:

### The Seed Preserved

**Function:** first strong proof that the protagonist acted on Willow's teaching rather than merely hearing it.  
**Primary tags:** Wisdom, Stewardship, Patience, CostlyChoice  
**Bond contribution:** Mentor / Student emerging

### The Lesson Made Yours

**Function:** demonstrates independent application of Willow's cognitive pattern.  
**Primary tags:** Wisdom, Understanding, Application, Transformation  
**Bond contribution:** Mentor / Student established  
**Trait relevance:** strong evidence for `WillowsWisdom`

### Beneath the Old Tree

**Function:** optional later vulnerable/reciprocal beat used to distinguish extraction from mutual relationship.  
**Primary tags:** Vulnerability, Reciprocity, SharedMeaning  
**Bond contribution:** tests whether the bond remains purely instrumental

See `../Narrative/ElderWillowVerticalSlice.md` for the complete sequence.

---

## 13. Lyra generalization requirement

The Memory System is not validated if all useful Memories are positive or affectionate.

Lyra's future proof should include memories such as:

- a duel outcome that changes mutual recognition;
- an argument where each side accurately models the other's worldview;
- a refusal that costs one side strategically but establishes credibility;
- forced cooperation that creates shared meaning without immediate Affinity gain.

The same Memory schema must support these without treating rivalry as disguised romance or friendship.

---

## 14. Cross-references

- `RelationshipExperienceSystem.md` — Experience ledger, Bond Profile, Connection qualification
- `EssenceResonanceModel.md` — Memory evidence in Essence and Trait Resonance
- `../Narrative/ElderWillowVerticalSlice.md` — first authored Memory sequence
- `../Technical/RelationshipSystemMigrationPlan.md` — runtime implementation plan
