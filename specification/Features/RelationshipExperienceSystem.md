# Relationship Experience System

**Design status:** Canonical and substantially implemented / empirically qualified through M14  
**Scope:** Universal relationship progression architecture  
**Supersedes for Relationship-authority NPCs:** Affinity-as-XP progression where `affinity >= 100` automatically increments legacy `connectionDepth`

## 1. Purpose

The Relationship Experience System is the translation layer between narrative/gameplay events and persistent relational progression.

It answers four distinct questions:

1. **What happened between these characters?** — Relationship Experience
2. **Which events became defining landmarks?** — Memory
3. **What does the relationship mean now?** — Bond Profile
4. **What does that relationship enable?** — Connection, Essence, Trait learning, dialogue/quest access, later narrative consequence, and future systems

Canonical causal chain:

```text
Story / gameplay interaction
-> Relationship Experience
-> relationship-dimension changes
-> Connection Progress
-> Bond Profile recalculation
-> optional Memory formation
-> Essence / Trait / story consequences
```

A dialogue choice, quest completion, rescue, argument, betrayal, lesson, shared discovery, tactical decision, or sacrifice may become a Relationship Experience when it has durable relational meaning.

Routine contact is not automatically deep relationship progress.

## 2. Canonical vocabulary

### Interaction

Any player/NPC contact handled by the game: dialogue, quest activity, trade, gift, challenge, travel, combat cooperation, shared work, etc.

An Interaction is transient by default.

### Relationship Experience

A persistent event record representing an interaction that changed how participants understand, value, trust, rely on, oppose, expose themselves to, or otherwise relate to one another.

Experiences are authoritative event evidence for Relationship progression.

### Memory

A landmark Relationship Experience that remains durable evidence of how the Relationship became what it is.

Every Memory references an originating Experience. Most Experiences do not become Memories.

See `MemorySystem.md`.

### Bond Profile

The current interpreted state of the Relationship.

It summarizes accumulated Experience/Memory consequences rather than acting as a second independent history.

### Affinity

Current positive or negative disposition.

Affinity can affect short-term reactions, prices, services, tone, or conflict.

**Affinity is not Connection XP.**

A valid Relationship can have, for example:

```text
Affinity: -25
Connection Level: 4
```

when rivalry, betrayal, ideology, dependency, grief, or another deeply significant relationship remains identity-relevant.

### Connection Progress

Readiness toward the next Connection level based on accumulated relational significance.

Positive and adversarial Experiences may both contribute when they deepen meaningful history, understanding, reliance, vulnerability, reciprocity, ideological recognition, or another qualified dimension.

### Connection Level

An evidence-qualified measure of how deeply the Relationship has become consequential to the participants.

Connection cannot increase solely because Affinity reaches a threshold.

### Resonance

The process by which a stable pattern embodied by another character can become integrated into the protagonist.

Relationship evidence can therefore become character transformation, not merely access or currency.

## 3. Universal Bond dimensions

| Dimension | Range | Meaning |
|---|---:|---|
| Affinity | -100..100 | Current emotional disposition |
| Trust | 0..100 | Confidence in reliability, competence, or intentions |
| Understanding | 0..100 | Accuracy/depth of comprehension |
| Shared Meaning | 0..100 | Degree shared history has become identity/worldview-relevant |
| Reliance | 0..100 | Practical or emotional dependence |
| Vulnerability | 0..100 | Meaningful exposure, disclosure, entrusted risk |
| Reciprocity | 0..100 | Degree investment/influence runs both ways |

These dimensions are intentionally not collapsed into one `relationshipPercent`.

Custom dimensions may exist where an arc genuinely requires them, but they must not silently replace the universal dimensions.

## 4. Experience contract

Authored Experiences currently support concepts equivalent to:

```text
id
uniqueKey
primaryTargetId
participantIds
sourceType
sourceId
significance
relationshipEffects
customEffects
connectionProgressDelta
resonanceTags
traitEffects
memoryCandidate
interpretation
```

The runtime/types remain the schema authority for exact field names.

### Significance is not a loot tier

`minor / meaningful / major / defining` communicates narrative/system importance. It does not automatically map to fixed Essence or Connection rewards.

### Idempotency

One-time authored Experiences must be protected from accidental duplicate application by stable identity/unique-key behavior.

Repeatable interactions create repeatable relationship evidence only when explicitly authored to do so.

## 5. Bond Profile

The Bond Profile contains current Relationship meaning such as:

```text
dimensions
connectionLevel
connectionProgress
bondArchetypes
activeMemoryIds
unresolved tensions / stability information
recent Experience references
resonance information
essence contribution information
```

Where practical, derived fields should be recalculable from authoritative Relationship state and definitions rather than becoming independent mutable truth.

## 6. Connection qualification

Working semantic levels remain:

| Level | Working meaning |
|---:|---|
| 0 | Unknown / Unformed |
| 1 | Recognized |
| 2 | Familiar |
| 3 | Significant |
| 4 | Trusted / Established |
| 5 | Deep Bond |
| 6 | Interdependent |
| 7 | Identity-Relevant |
| 8 | Profoundly Entangled |
| 9 | Metaphysical Bond |
| 10 | Unity / exceptional end-state |

Names are working presentation labels; semantic qualification is the important rule.

A Connection increase requires the configured combination of:

1. sufficient `connectionProgress`;
2. qualifying Experience evidence since the prior level;
3. a Bond Profile coherent with the target level;
4. any explicitly authored arc-specific rule.

Affinity alone cannot satisfy Connection qualification.

## 7. Negative and adversarial progression

Negative Experience can reduce Affinity or Trust while increasing Understanding, Shared Meaning, custom rival recognition, or Connection Progress.

This is intentional and production-qualified.

M11 demonstrated Lyra as an adversarial/dialectical Relationship whose Affinity remained strongly negative while Connection, Understanding, and Shared Meaning increased.

M14 further demonstrated that one public crackdown could make Silas and Gronk understand the player's reasoning more while trusting/relying on the player less.

## 8. Memory qualification

An Experience may become a Memory when it:

- changes interpretation of the Relationship;
- qualifies/crosses a Connection threshold;
- establishes, transforms, contests, or retires a Bond archetype;
- provides durable Trait/Resonance evidence;
- represents costly/revealing choice;
- is explicitly authored as a landmark;
- is later required as evidence explaining why the Relationship changed.

Memory formation should remain rarer than Experience creation.

## 9. Bond archetypes

Archetypes summarize meaning; they do not replace dimensions.

Examples include:

- Mentor / Student
- Rival
- Ally
- Protector / Protected
- Co-conspirator
- Dependent
- Instrumental Asset
- Reciprocal Partner
- Ideological Counterpart
- Institutional Trust
- Professional Respect

A Relationship may support multiple simultaneous archetypes.

## 10. Manipulation and reciprocity

Manipulative Relationships are mechanically real.

They may create Connection, Essence, access, reliance, and Trait compatibility. The game must not encode a universal hidden morality penalty that makes instrumental strategy nonviable by fiat.

Different histories instead create different Bond profiles.

For example, an instrumental bond may show high Reliance and Understanding with low Reciprocity/Vulnerability; a reciprocal mentorship may show high Understanding, Shared Meaning, Trust, Reciprocity, and voluntary Vulnerability.

Later mechanics may distinguish these histories when specific qualities are actually relevant.

## 11. Production authority and migration

`RelationshipProgressionDefinition.connectionAuthority` determines whether an NPC uses Relationship-domain Connection authority or legacy compatibility behavior.

The current relationship authoring manifest registers production bundles for:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

For those Relationship-authority NPCs, new content must use Relationship Experience/Bond semantics rather than extending `affinity >= threshold -> connectionDepth` as a progression rule.

Legacy fields may remain in NPC state, saves, Traits, Copy mechanics, or UI until deliberately migrated.

## 12. Story integration

### Dialogue

Dialogue choices may emit authored Relationship Experiences.

Dialogue can also require existing Relationship Experience ids for later availability.

### Quest

Quest outcomes may record Relationship Experiences while quest objectives/rewards remain Quest-owned.

### Later story consequence

M13 qualified:

```text
Story event
-> Relationship evidence
-> save/load
-> later story gate
-> new story/gameplay consequence
-> new Relationship evidence
```

### Shared social consequence

M14 qualified:

```text
one shared player decision
-> several independent Relationship Experiences
-> different consequences for multiple NPCs
```

The existing dialogue `effects` array was sufficient for this fan-out; no new social-state engine was required.

## 13. Essence integration

Relationship-authority bundles may enable Relationship-derived Essence.

The effective contribution follows the current Essence/Resonance model:

```text
Connection Base Rate
x Resonance Quality
x Tether
x Stability
```

Relationship Experiences normally change future generation conditions rather than minting one-time Essence directly.

See `EssenceSystem.md` and `EssenceResonanceModel.md`.

## 14. Trait integration

Relationship Experiences and Memories can provide:

- authored Trait discovery;
- assimilation progress;
- compatibility evidence;
- required Memory tags;
- final authored Resonance evidence.

Willow's Wisdom and Scholarly Insight already use relationship-mediated discovery/assimilation/Resonance.

See `TraitSystem.md`.

## 15. Copy integration boundary

Copies are a separate domain.

Copy mechanics may consume Relationship facts when explicitly migrated, but Copy state must not become a second Relationship ledger.

Current Copy parent/creation calculations still contain legacy compatibility assumptions in places. Those should be migrated only with dedicated evidence, tests, and save-safety analysis.

## 16. Relationship invariants

1. Affinity is not Connection XP.
2. Connection is not synonymous with affection.
3. Every Memory references an Experience.
4. Not every Experience becomes a Memory.
5. Repeated low-information actions cannot grind deep Connection by themselves.
6. Negative events can deepen Connection while damaging positive dimensions.
7. Historical Memories are not deleted merely because current Affinity or Trust falls.
8. Relationship Experiences normally change Essence conditions rather than directly harvesting Essence.
9. Migrated Trait Resonance requires relationship/assimilation evidence in addition to Essence.
10. NPC-specific narrative rules should use generic mechanics before hard-coded character exceptions.
11. Relationship state must not become a general-purpose world-state database.
12. Legacy compatibility fields may remain, but new Relationship-authority content must not extend them as canon.

## 17. Empirical qualification history

The architecture has moved beyond the original Willow/Lyra proof proposal.

- **M4-M10:** Relationship migration, Memories, Trait evidence, persistence/save migration.
- **M11:** Lyra adversarial universality.
- **M12:** Gronk/Silas/Valerius production authoring scalability.
- **M13:** Relationship evidence causes later narrative after persistence.
- **M14:** shared event produces distinct/conflicting multi-NPC consequences.

These milestones define the current evidence ceiling. They do not prove arbitrary campaign-scale social simulation or human narrative quality.

## 18. Next unknown

The next highest-value Relationship question is **temporal depth**, not another Relationship dimension:

> Can old Relationship evidence remain causally relevant after unrelated intervening content, additional Relationship change, and save/load?

That is the proposed M15 long-horizon callback qualification.

After that, the product should increasingly test Relationship-derived capabilities in actual gameplay rather than continuing to add ontology for its own sake.

## 19. Cross-references

- `../Technical/PostM14ProductReconciliation.md`
- `MemorySystem.md`
- `EssenceResonanceModel.md`
- `EssenceSystem.md`
- `TraitSystem.md`
- `QuestSystem.md`
- `../Technical/RelationshipSystemMigrationPlan.md` — historical migration plan; consult current reconciliation before treating old sequencing as active roadmap
- milestone-specific qualification documents under `../Technical/`