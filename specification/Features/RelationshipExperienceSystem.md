# Relationship Experience System

**Design Status:** Canonical target design; runtime implementation pending  
**Scope:** Universal relationship progression architecture  
**Supersedes when implemented:** Affinity-as-XP progression where `affinity >= 100` automatically increments `connectionDepth`

## 1. Purpose

The Relationship Experience System is the translation layer between narrative interactions and persistent progression.

The core design problem is not merely tracking whether an NPC likes the player. The game must be able to answer four separate questions:

1. **What happened between these characters?** — Relationship Experience
2. **Which events became defining moments?** — Memory
3. **What does the relationship mean now?** — Bond Profile
4. **What does that relationship enable?** — Essence generation, dialogue/quest access, Trait assimilation, Resonance, and later Copy mechanics

The canonical causal chain is:

```text
Narrative interaction
  -> Relationship Experience
  -> relationship-dimension changes
  -> Connection Progress
  -> Bond Profile recalculation
  -> optional Memory formation
  -> Essence-rate recalculation
  -> Trait assimilation / Resonance consequences
```

A dialogue choice, quest completion, rescue, argument, betrayal, lesson, shared discovery, or sacrifice can all become Relationship Experiences. Merely clicking dialogue or spending time near an NPC does not automatically qualify.

---

## 2. Canonical vocabulary

### 2.1 Interaction

Any player/NPC contact handled by the game: dialogue, quest activity, trade, gift, challenge, shared travel, combat cooperation, etc.

An Interaction is transient by default. It becomes a Relationship Experience only when it creates a durable relational consequence.

### 2.2 Relationship Experience

A persistent event record representing an interaction that changed how one or both participants understand, value, rely on, or relate to the other.

Experiences are the authoritative event evidence for relationship progression.

### 2.3 Memory

A landmark Relationship Experience that becomes part of how the relationship is interpreted.

Every Memory references an originating Relationship Experience. Most Relationship Experiences do not become Memories.

See `MemorySystem.md`.

### 2.4 Bond Profile

The current derived state of a relationship. It summarizes the accumulated consequences of Experiences and Memories.

A Bond Profile is not a second event log. It answers: **what is this relationship now?**

### 2.5 Affinity

The NPC's current positive or negative disposition toward the player.

Affinity remains useful for short-horizon reactions, prices, service access, dialogue tone, and temporary conflict. It is **not** the experience bar for Connection Level.

A relationship can therefore legitimately have:

```text
Affinity: -25
Connection Level: 4
```

This can represent rivalry, betrayal, ideological conflict, grief, or another deeply significant but currently hostile relationship.

### 2.6 Connection Progress

A readiness measure toward the next Connection Level. It represents accumulated relational significance, not simple approval.

Connection Progress can be increased by positive or adversarial Experiences when those Experiences deepen understanding, shared history, dependence, vulnerability, ideological recognition, or another meaningful dimension.

### 2.7 Connection Level

A qualified measure of how deeply the relationship has become part of the participants' lives and identities.

Connection Level is not permitted to increase solely because Affinity reached a threshold.

### 2.8 Resonance

The process through which a stable pattern embodied by another character becomes integrated into the protagonist.

Trait Resonance is therefore a relationship-mediated transformation rather than a simple currency purchase.

---

## 3. Universal relationship dimensions

The initial universal Bond Profile uses seven dimensions.

| Dimension | Range | Meaning |
|---|---:|---|
| Affinity | -100..100 | Current emotional disposition toward the other character |
| Trust | 0..100 | Confidence in the other character's reliability, competence, or intentions |
| Understanding | 0..100 | Accuracy and depth of mutual comprehension |
| Shared Meaning | 0..100 | Degree to which shared experiences have become significant to identity or worldview |
| Reliance | 0..100 | Practical or emotional dependence |
| Vulnerability | 0..100 | Degree of meaningful exposure, disclosure, or entrusted risk |
| Reciprocity | 0..100 | Degree to which investment and influence run both ways rather than remaining extractive |

These dimensions are intentionally not collapsed into one universal `relationshipPercent`.

NPCs and arcs may define additional custom dimensions such as `RivalRecognition`, `IdeologicalAlignment`, `Duty`, or `Fear`. Custom dimensions must not silently replace the universal ones.

### 3.1 No universal Authenticity meter in v1

Authenticity is represented by event history and the pattern of dimensions rather than a scalar `authenticity = 72`.

For example, a relationship built through manufactured dependency may have high Reliance and moderate Trust but low Reciprocity and Vulnerability. A reciprocal mentorship may have high Understanding, Shared Meaning, Trust, and Reciprocity.

This distinction is important to the game's existing theme of instrumental connection versus authentic bond.

---

## 4. Relationship Experience schema

```text
EXPERIENCE_ID:       [stable unique id]
Title:               [short event label]
Timestamp:           [game/simulation time]
Primary Target:      [NPC id]
Participants:        [all relevant character ids]
Source Type:         [dialogue / quest / combat / exploration / system / other]
Source ID:           [dialogue node, quest id, encounter id, etc.]
Unique Key:          [optional idempotency key]

Significance:        [Minor / Meaningful / Major / Defining]

Relationship Effects:
  Affinity:          [signed delta]
  Trust:             [signed delta]
  Understanding:     [signed delta]
  Shared Meaning:    [signed delta]
  Reliance:          [signed delta]
  Vulnerability:     [signed delta]
  Reciprocity:       [signed delta]

Custom Effects:      [optional named dimension deltas]
Connection Progress: [signed or zero]
Resonance Tags:      [semantic tags such as Wisdom, Rivalry, Sacrifice, Truth]
Trait Effects:       [optional compatibility/assimilation consequences]
Memory Candidate:    [yes / no]
Interpretation:      [short narrative meaning; may differ by participant]
Consequences:        [dialogue, quest, behavior, Essence, Trait, unlock notes]
Notes:               [authoring/debug context]
```

### 4.1 Significance is not a reward table

`Minor / Meaningful / Major / Defining` describes narrative/system importance. It does not automatically map to a fixed Connection or Essence reward.

A rescue, confession, ideological breakthrough, betrayal, and refusal can all be Major Experiences while changing different dimensions.

### 4.2 Experiences are idempotent when authored as unique beats

A one-time authored Experience must have a stable unique key or otherwise be protected from accidental duplicate application.

Repeatable interactions may create repeatable Experiences only when explicitly designed to do so, and repeated identical actions should have diminishing or zero relationship significance unless new context changes their meaning.

---

## 5. Bond Profile schema

```text
BondProfile:
  sourceCharacterId
  targetCharacterId

  dimensions:
    affinity
    trust
    understanding
    sharedMeaning
    reliance
    vulnerability
    reciprocity
    customDimensions{}

  connectionLevel
  connectionProgress

  bondArchetypes[]
  activeMemoryIds[]
  unresolvedTensions[]
  recentExperienceIds[]

  resonanceProfile:
    tags{}
    quality
    stability

  essenceContribution:
    baseRate
    effectiveRate
    explanation[]
```

The Bond Profile should be derived or recalculated from authoritative relationship state wherever practical. It must not become an independent source of truth that can silently disagree with the Experience ledger.

---

## 6. Connection qualification

### 6.1 Target semantic levels

| Level | Working meaning | Qualification concept |
|---:|---|---|
| 0 | Unknown / Unformed | No meaningful bond yet |
| 1 | Recognized | Persistent awareness and at least one meaningful interaction |
| 2 | Familiar | Repeated meaningful contact; the other person is no longer interchangeable |
| 3 | Significant | Shared history measurably affects choices or expectations |
| 4 | Trusted / Established | A stable relational pattern exists even when Affinity fluctuates |
| 5 | Deep Bond | The relationship can override short-term convenience or prior assumptions |
| 6 | Interdependent | Meaningful mutual reliance or reciprocal transformation |
| 7 | Identity-Relevant | The relationship is part of self-conception or worldview |
| 8 | Profoundly Entangled | Decisions and futures are persistently co-shaped |
| 9 | Metaphysical Bond | Connection has durable supernatural/systemic consequences beyond ordinary proximity |
| 10 | Unity | Exceptional end-state; reserved for rare relationships |

Names are working labels; the semantic distinction is canonical.

### 6.2 Level-up rule

A Connection Level increase requires all of the following:

1. `connectionProgress` reaches the configured threshold;
2. at least one qualifying Experience since the previous level demonstrates the next level's meaning;
3. the current Bond Profile is coherent with the target level;
4. any arc-specific gate is satisfied.

Affinity alone can never satisfy these requirements.

### 6.3 Negative and adversarial progression

A negative Experience may reduce Affinity or Trust while increasing Understanding, Shared Meaning, Rival Recognition, or Connection Progress.

This is intentional. The system must be capable of modeling Lyra-style adversarial connection without pretending that conflict is affection.

---

## 7. Memory qualification

An Experience becomes a Memory when at least one of these is true:

- it changes the interpretation of the relationship;
- it crosses or qualifies a Connection threshold;
- it establishes, transforms, contests, or retires a Bond archetype;
- it creates durable Trait/Resonance evidence;
- it represents a costly or revealing choice;
- it is explicitly authored as a landmark beat;
- later content needs to reference the event as evidence of why the relationship changed.

Memory formation is deliberately rarer than Experience creation.

See `MemorySystem.md` for the player-facing and persistence rules.

---

## 8. Bond archetypes

Bond archetypes summarize meaning; they do not replace dimensions.

Examples:

- Mentor / Student
- Rival
- Ally
- Protector / Protected
- Co-conspirator
- Dependent
- Instrumental Asset
- Reciprocal Partner
- Ideological Counterpart

An archetype can emerge from several Experiences and Memories rather than from one arbitrary assignment.

For example:

```text
The Seed Preserved
+ Three Nights of Teaching
+ The Lesson Made Yours
-> Mentor / Student (established)
```

An NPC may support more than one simultaneous archetype.

---

## 9. Manipulation and reciprocity

Manipulative relationships are mechanically real.

They may generate Connection Progress, Essence, useful access, and Trait compatibility. The protagonist's initial instrumental worldview must be viable rather than obviously invalid from the first hour.

However, different histories create different Bond Profiles.

Instrumental strategies tend to produce patterns such as high Reliance, managed Affinity, controlled Trust, low Reciprocity, or low voluntary Vulnerability. Reciprocal strategies can produce qualities that asymmetric control alone cannot guarantee.

Later systems may make these histories qualitatively different by unlocking different Resonance outcomes. This should not be implemented as a universal flat penalty to manipulation.

---

## 10. Relationship invariants

1. **Affinity is not Connection XP.**
2. **Connection is not synonymous with affection.**
3. **Every Memory references an Experience.**
4. **Not every Experience becomes a Memory.**
5. **Repeated low-information actions cannot grind deep Connection by themselves.**
6. **Negative events can deepen Connection while damaging positive dimensions.**
7. **Historical Memories are not deleted merely because current Affinity or Trust falls.**
8. **Essence generation is derived from relationship state; a relationship event does not directly harvest Essence.**
9. **Trait Resonance requires relationship evidence in addition to an Essence balance.**
10. **NPC-specific narrative rules should use generic mechanics before introducing hard-coded character exceptions.**

---

## 11. Integration boundaries

### Dialogue System

Dialogue choices may emit Relationship Experiences. Dialogue handlers should eventually stop directly treating `AFFINITY_DELTA` as the complete relationship consequence for important beats.

### Quest System

Quest outcomes may emit Relationship Experiences. Quest rewards should not substitute for relationship meaning.

### Essence System

The Bond Profile supplies relationship-derived inputs to passive Essence generation. See `EssenceResonanceModel.md`.

### Trait System

Experiences and Memories provide semantic evidence and compatibility modifiers for Trait assimilation. See `EssenceResonanceModel.md`.

### Copy System

Copy integration is explicitly deferred until the core relationship model is proven with Elder Willow and Lyra.

---

## 12. First validation sequence

The architecture is not considered validated merely because the schemas are implementable.

It must first pass two narrative tests:

1. **Elder Willow — mentorship/friendly proof:** the player can understand why Willow's Wisdom became Resonatable.
2. **Lyra — adversarial proof:** a low or volatile Affinity relationship can still develop high Connection and strong Resonance through conflict, recognition, and shared meaning.

If Lyra requires character-specific bypass code, the universal model is incomplete.

---

## 13. Cross-references

- `MemorySystem.md` — landmark relationship memories
- `EssenceResonanceModel.md` — relationship-derived Essence and Trait assimilation
- `../Narrative/ElderWillowVerticalSlice.md` — first authored proof
- `NPCSystem.md` — currently implemented Affinity/Connection model to be migrated
- `DialogueSystem.md` — current dialogue effect architecture
- `TraitSystem.md` — currently implemented Discover -> Equip -> Resonate lifecycle
- `EssenceSystem.md` — currently implemented passive Essence generation
- `../Technical/RelationshipSystemMigrationPlan.md` — staged implementation plan
