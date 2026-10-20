# Trait Identity — Universal Pattern Ontology

**Status:** CURRENT DESIGN AUTHORITY — owner-selected 2026-09-28 universal Trait direction  
**Runtime contract:** [TraitSystem.md](TraitSystem.md)  
**Reconciliation:** [UniversalTraitOntologyReconciliation.md](../Technical/UniversalTraitOntologyReconciliation.md)  
**Catalogue/runtime audit:** [CampaignOneTraitCatalogueAudit.md](../Technical/CampaignOneTraitCatalogueAudit.md)  
**Story context:** [CampaignArchitecture.md](../Narrative/CampaignArchitecture.md), [Synopsis.md](../Narrative/Synopsis.md)

## 1. Core identity

> **A Trait is a discrete, stable, salient pattern of being.**

A Trait may describe a meaningful part of what a being:

- **is** — physiology, morphology, sensory structure, metaphysical composition;
- **knows** — semantic knowledge or a learned model;
- **remembers** — significant subjective episodic memory;
- **can do** — procedural skill, trained response, embodied technique;
- **tends to do or perceive** — cognitive/dispositional pattern;
- **can express supernaturally** — Essence, resonance, elemental, void, or other metaphysical patterns.

Traits are therefore broader than RPG perks and broader than capabilities.

The protagonist's distinctive power is not merely "learn skills from friends." Through resonance with other beings and meaningful sources, patterns that were originally foreign can become legible, gradually assimilated, stabilized with Essence, and selectively expressed as part of the protagonist.

## 2. Universal in-world, selective in runtime

The fictional ontology is universal:

~~~text
a being
= an enormous constellation of patterns
= potentially describable through Traits
~~~

The game representation is deliberately selective.

> **Universal ontology does not require universal serialization.**

Only a pattern that is narratively or mechanically salient should normally become an authored runtime Trait.

The game does **not** need a Trait object for every:

- ordinary memory;
- mundane fact;
- finger, organ, or trivial physical feature;
- passing emotion;
- momentary preference;
- relationship-state update;
- world-state fact.

A runtime Trait is warranted when representing the pattern produces useful identity, gameplay, provenance, or narrative consequence.

## 3. Trait is not Capability

The previous Campaign One implementation often used Trait and capability nearly synonymously. That is now too narrow.

Canonical separation:

~~~text
Trait
= pattern instantiated in a being

Capability
= something one or more currently expressed Traits make possible
~~~

Examples:

~~~text
Trait: Elven low-light sensory pattern
Capability: perceive clearly in darkness

Trait: swordsmanship procedural pattern
Capability: perform a trained counter

Trait: memory of a sealed archive route
Capability: navigate that route from remembered experience

Trait: Scholarly Insight
Capability: reopen a model when contradictory evidence appears
~~~

A Trait may create several capabilities in different contexts. Several Traits may also compose into one capability.

## 4. Trait nature

The following are **authoring lenses, not a required closed runtime enum**.

### 4.1 Physiological / morphological

Stable bodily patterns such as resilient constitution, dense musculature, regenerative tissue, gills, wings, or altered blood chemistry.

### 4.2 Sensory

Patterns that change what can be perceived, such as low-light vision, echolocation, Essence-spectrum perception, or thermal sensing.

### 4.3 Procedural / skill

Knowing **how** to perform a practiced action, such as swordsmanship, forging technique, field surgery, or Battle Hardened combat conditioning.

### 4.4 Semantic knowledge

Knowing **that** something is the case, or possessing an organized body/model of knowledge, such as Dragon-God resonance engineering, forbidden metaphysical theory, regional ecology, or imperial logistics.

### 4.5 Episodic memory

A subjective remembered experience belonging to a mind.

A Memory Trait is not the same authority as a Relationship Memory. See section 10.

### 4.6 Cognitive

A reusable pattern of reasoning, attention, interpretation, or model formation.

Campaign One examples are Willow's Wisdom, Scholarly Insight, Constraint Sense, and Adversarial Calibration.

### 4.7 Dispositional / emotional

A sufficiently stable pattern affecting tendency, regulation, fear, desire, or emotional response.

A passing mood is not automatically a Trait.

### 4.8 Metaphysical

A stable supernatural pattern such as Essence Flow, elemental affinity, void exposure, harmonic resonance, or another supernatural structure.

## 5. Nature and provenance are different dimensions

"What kind of pattern is this?" and "How did this instance originate?" are separate questions.

Example:

~~~text
Night Vision

Nature in source:
sensory / physiological

Source provenance:
innate

Protagonist provenance:
relationship-assimilated
~~~

Useful provenance language includes innate, practiced, learned, experienced, relationship-assimilated, exposure-derived, constructed/modified, and metaphysically inherited.

These remain descriptive authoring lenses unless a concrete runtime need warrants schema.

## 6. The protagonist's universal Trait loop

The intended fictional loop is:

~~~text
source possesses / instantiates pattern
        ↓
proximity + attention + relational or emotional significance
        ↓
Resonance makes pattern increasingly legible
        ↓
Recognition / Discovery
        ↓
Assimilation reconstructs pattern within protagonist
        ↓
temporary Expression can become possible
        ↓
continued meaningful evidence
        ↓
Assimilation becomes sufficient
        ↓
Essence Stabilization
        ↓
pattern becomes permanently available
        ↓
Player can Express / Suppress / combine available patterns
~~~

Campaign One does **not** need a generic continuous proximity simulator to tell this story. Authored Relationship Experiences remain a valid bounded representation of meaningful periods of proximity, attention, practice, conflict, teaching, and mutual exposure.

## 7. Resonance

> **Resonance is alignment/contact that permits one pattern to become legible to another being.**

Resonance is not the final permanent purchase.

It may be strengthened by physical proximity, sustained attention, teaching, shared work, trust, vulnerability, dependence, rivalry, obsession, fear, conflict, mutual calibration, or intense shared experience.

Therefore:

~~~text
relationship significance
!= positive Affinity
~~~

A hated rival may create stronger resonance than a casual friend.

Lyra is the canonical Campaign One example: adversarial intensity and accurate mutual modeling can qualify learning without requiring agreement or affection.

## 8. Assimilation

> **Assimilation is the gradual reconstruction/internalization of a foreign Trait pattern.**

Discovery is only recognition.

Assimilation is what makes the pattern increasingly reproducible by the protagonist.

Relationship-mediated Campaign One Traits may continue to use Connection evidence, compatibility, assimilation progress, landmark Memories, and authored Experiences. These represent evidence that the protagonist has had enough meaningful exposure to reconstruct the pattern.

## 9. Stabilization

> **Stabilization uses Essence to make an assimilated pattern durably self-sustaining in the protagonist.**

Canonical distinction:

~~~text
Resonance
= transfer/alignment becomes possible

Assimilation
= foreign pattern is reconstructed

Stabilization
= reconstructed pattern becomes permanently available
~~~

Historical runtime/data identifiers containing "resonance" may remain compatibility names until a later migration is specifically warranted.

## 10. Ownership and Expression

This is the central mechanical consequence of the universal identity.

~~~text
Assimilated
!= always active

Assimilated
= permanently available

Expressed
= currently manifested / active
~~~

The protagonist may hoard many assimilated Traits while expressing only the set allowed by current expression capacity.

Stabilized Traits may be freely expressed or suppressed at will unless a future Trait has a specific authored reason to behave differently.

No generic respec tax or arbitrary cooldown is implied.

### Current compatibility mapping

~~~text
player.permanentTraits
= legacy serialized name for assimilated Trait library

player.traitSlots
= current Trait expression capacity / expression set
~~~

This mapping preserves save compatibility without preserving the old ontology.

## 11. Temporary Expression

A discovered but not-yet-stabilized pattern may currently be expressed temporarily under the bounded existing Trait-slot behavior.

Campaign One currently uses Discovery as the minimum temporary-expression threshold.

That is a bounded implementation choice, not a universal metaphysical claim that first recognition always grants perfect reproduction.

A future content case may justify partial/unstable expression thresholds. Do not build a generalized simulation without evidence.

## 12. Relationship Memory vs Memory Trait

These are different authorities.

### Relationship Memory

Answers:

> **What meaningful history happened between these characters?**

It is evidence/provenance owned by the Relationship system.

Example: The Lesson Made Yours happened between Willow and the protagonist.

### Memory Trait

Answers:

> **What subjective remembered experience is instantiated in this mind?**

Example: Willow's memory of standing beneath an ancient tree during a particular disaster.

Assimilating a Memory Trait does not rewrite history and does not mean the protagonist personally lived the source event.

~~~text
relationship historical evidence
!= transferable episodic mental content
~~~

## 13. Knowledge authority vs Knowledge Trait

The Knowledge system answers:

> **Which NPC currently knows a selected objective fact?**

A Knowledge Trait represents a substantial internalized informational/model pattern.

Example:

~~~text
Knowledge state:
Lyra knows the Echo entered Phase III.

Knowledge Trait:
Dragon-God Resonance Engineering
~~~

Do not serialize every learned fact as a Trait.

## 14. Skill Trait vs routine familiarity

A procedural/Skill Trait describes **knowing how**.

Routine familiarity answers:

> **Has the protagonist personally performed this repeatable work enough for the current delegation contract?**

They can interact without collapsing:

~~~text
procedural Trait
!= mastered routine identity
~~~

Generic Skills remain unnecessary as a parallel Campaign One subsystem because procedural skills may be represented through Traits where materially useful.

## 15. Relationship state is not a Trait

Affinity, Connection, trust, dominance/reciprocity, secrecy/transparency, and shared history remain Relationship authority.

A stable dispositional pattern in a person may be a Trait.

"This NPC currently trusts the protagonist" is relationship state, not a Trait.

## 16. Faction and World State are not Traits

Institutional standing and objective regional/world conditions remain separate causal authorities.

Universal Traits do not become a universal condition engine.

## 17. Expression owns active effects

Under the current universal implementation:

- direct Player-stat Trait effects apply while the Trait is expressed;
- semantic authored Trait capabilities are available while the Trait is expressed;
- shared projection to NPCs/Copies requires current expression;
- suppressing an assimilated Trait removes its active expression without deleting ownership;
- relationship deterioration does not normally remove a stabilized Trait from the assimilated library.

The design invariant remains:

~~~text
capability != decision
~~~

Expression may make an action possible without choosing it for the player.

## 18. Sharing

Sharing projects a **currently expressed** Trait pattern to another supported target.

~~~text
Player expresses Trait
-> Player may share/project pattern
-> target receives bounded shared runtime effect
~~~

Sharing does **not** automatically mean the target permanently assimilates the Trait.

Stabilized Player Traits remain shareable while expressed because stabilization changes ownership durability, not whether the pattern can be projected.

## 19. Doctrine

A Doctrine is not a Trait and not the universal Trait ontology.

> **Doctrine is a higher-order strategic synthesis of assimilated cognitive/operational patterns that are currently expressed and deliberately foregrounded.**

Current Campaign One doctrines remain Structural Steward and Countermodeler.

Current doctrine activation requires the component Traits to be:

~~~text
assimilated
+ expressed
+ foregrounded
~~~

Doctrine adoption may express missing assimilated components into available open expression slots, but it must not silently evict unrelated expressed Traits.

## 20. Essence identity

The universal Trait ontology gives Essence a clear role:

> **Essence stabilizes reconstructed patterns that were not originally self-sustaining in the protagonist.**

This allows:

~~~text
relationship / exposure
-> pattern legibility

assimilation
-> reconstruction

Essence
-> durable stabilization
~~~

Essence cannot replace the evidence needed to discover or assimilate a relationship-mediated Trait.

## 21. Campaign One canonical cognitive core

The four relationship-derived cognitive Traits remain excellent Campaign One content. Their importance does not mean all Traits are cognitive.

| Trait | Source | Pattern |
| --- | --- | --- |
| Willow's Wisdom | Elder Willow | Trace visible symptoms to slower systemic causes. |
| Scholarly Insight | Elara | Revise a model when contradictory evidence appears. |
| Constraint Sense | Gronk | Identify load-bearing constraints beneath surface appearance. |
| Adversarial Calibration | Lyra | Model an opponent precisely without requiring agreement or affection. |

They remain the strongest current expression of relationship-mediated cognitive assimilation.

## 22. Cross-category production proof

The current catalogue carries optional authoring metadata demonstrating that one Trait ontology can describe materially different pattern natures:

- Willow's Wisdom — **cognitive**;
- Resilient Constitution — **physiological**;
- Battle Hardened — **procedural**;
- Tome of Forbidden Knowledge — **semantic knowledge**;
- Essence Flow — **metaphysical**.

This is a bounded ontology proof, not a mandate to expand Campaign One content.

No production Memory Trait is introduced merely to fill a category.

## 23. Current 27-Trait breadth interpretation

The catalogue remains mixed historical material. Universal ontology improves the test applied to it; it does not automatically validate every old effect.

### Strong current universal-pattern fits

- Willow's Wisdom — cognitive / relationship-assimilated;
- Scholarly Insight — cognitive / relationship-assimilated;
- Constraint Sense — cognitive-procedural / relationship-assimilated;
- Adversarial Calibration — cognitive-relational / relationship-assimilated;
- Battle Hardened — procedural / embodied combat conditioning;
- Resilient Constitution — physiological;
- Arcane Intellect — cognitive/metaphysical;
- Swift Strikes — procedural/embodied;
- Iron Will — cognitive/embodied;
- Lucky Charm — metaphysical probability-affecting pattern if fiction supports it;
- Tome of Forbidden Knowledge — semantic-knowledge pattern; the historical ID names its source artifact;
- Heart of the Mountain — physiological/metaphysical;
- Whispers of the Void — metaphysical exposure;
- Mental Focus — cognitive;
- Essence Flow — metaphysical.

### Legacy/deferred concepts requiring reinterpretation before promotion

- Bargaining Master;
- Quick Learner;
- Mentor's Insight;
- Essence Siphon;
- Combat Reflexes;
- Silver Tongue;
- Master Craftsman;
- Shadow Walker;
- Elemental Affinity;
- Essence Affinity.

Many names could describe valid universal patterns, but obsolete effect metadata does not itself establish current runtime or Campaign One need.

### Especially weak current ontology fits

- Relationship Sage as a generic relationship-gain multiplier;
- Growing Affinity as passive relationship growth.

Relationships are shared evidence-bearing history, not a meter that should become positive merely because the protagonist owns a Trait.

No mass deletion is authorized solely by this identity revision.

## 24. Authoring test for a new Trait

Before adding an important Trait, answer:

1. **Pattern:** What stable pattern actually exists?
2. **Nature:** What kind of pattern is it?
3. **Source:** In whom or what is it instantiated?
4. **Provenance:** How did the source acquire it? How did the protagonist acquire it?
5. **Salience:** Why is this pattern important enough to represent mechanically?
6. **Assimilation:** What evidence makes the foreign pattern reconstructible?
7. **Expression:** What changes while it is expressed?
8. **Capability:** What does expressing the pattern allow?
9. **Consequence:** Does it create meaningful possibilities without automatically choosing the correct outcome?
10. **Domain boundary:** Is this really a Trait, or should the state remain Relationship, Knowledge, relationship Memory, Faction, World State, routine familiarity, inventory, or another existing authority?

## 25. Anti-patterns

Do not use universality as justification for:

- serializing every fact about every character;
- turning every ordinary memory into runtime Trait data;
- collapsing Relationship state into Traits;
- collapsing Knowledge, Faction, or World State into Traits;
- restoring a generic parallel Skills tree;
- restoring generic Crafting because a procedural Trait exists;
- continuous proximity simulation without demonstrated need;
- automatically extracting every Trait from every nearby NPC;
- personality overwrite as an automatic consequence of assimilation;
- hundreds of Traits merely to demonstrate breadth;
- a generic N-way Trait synergy engine;
- arbitrary swap cooldowns or costs merely because other RPGs use them;
- automatic "best answer" Trait actions.

## 26. Story identity

Universal Traits strengthen the protagonist's story because her original instrumental worldview becomes mechanically literal.

Early framing can be:

> **What can I extract from you?**

But accumulated Traits can transform that question:

~~~text
What can I take from you?
        ↓
What can I learn from you?
        ↓
What parts of you have become part of me?
        ↓
Who am I after carrying all of you?
~~~

The protagonist does not have to become morally identical to her sources.

A stronger identity is:

> **She becomes capable of carrying other beings' patterns without ceasing to be herself.**

That supports affection, rivalry, conflict, teaching, bodily adaptation, dangerous knowledge, and stranger future sources under one ontology.

## 27. Evidence boundary

Repository evidence can establish:

- universal Trait terminology and runtime contracts;
- assimilated ownership vs expression;
- free expression/suppression through available slots;
- stat/capability consumers using expression;
- relationship-mediated assimilation;
- Essence Stabilization;
- sharing of currently expressed patterns;
- save migration;
- bounded cross-category catalogue metadata.

Repository evidence cannot establish without human observation:

- that players understand the universal ontology;
- that Trait hoarding feels exciting;
- that expression capacity creates good build tension;
- that swapping is discoverable;
- that category breadth feels coherent rather than arbitrary;
- that assimilation pacing is satisfying;
- that the current UI communicates ownership vs expression cleanly enough.

Those remain Beta / human-validation questions.

## 28. Canonical authoring rule

When deciding whether something belongs as a Trait, ask:

> **Is this a salient pattern instantiated in a being that meaningfully describes what they are, know, remember, perceive, or can do—and is representing that pattern as transferable/expressible useful to the game?**

If yes, it may belong in the universal Trait ontology.

If the answer is only "it is a number we want to increase," that is not enough.
