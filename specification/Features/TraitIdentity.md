# Trait Identity

**Status:** CURRENT DESIGN AUTHORITY — Campaign One / 1.0 Trait family identity  
**Runtime contract:** [`TraitSystem.md`](TraitSystem.md)  
**Catalogue/runtime authority:** [`../Technical/CampaignOneTraitCatalogueAudit.md`](../Technical/CampaignOneTraitCatalogueAudit.md)  
**Gameplay doctrine:** [`../Technical/PostM16TraitGameplayReconciliation.md`](../Technical/PostM16TraitGameplayReconciliation.md)  
**Story context:** [`../Narrative/CampaignArchitecture.md`](../Narrative/CampaignArchitecture.md), [`../Narrative/Synopsis.md`](../Narrative/Synopsis.md)  
**Scope note:** This document constrains future Trait authoring and interpretation. It does not reopen Campaign One feature construction, add runtime schema, authorize catalogue expansion, or promote human-validation claims.

## 1. Purpose

The repository already defines how Traits work mechanically and which current effects have runtime authority. This document answers a different question:

> **What should a Trait mean and feel like in this game?**

Campaign One's strongest Trait work has converged on a distinctive identity: the protagonist changes because of what she experiences, understands, survives, practices, and learns from other people. Those internalized patterns later change what she can perceive, interpret, endure, attempt, or perform.

This identity is narrower than "RPG perk" and broader than "relationship reward."

## 2. Core identity statement

> **A Trait is an internalized pattern or transformation that changes how the protagonist can perceive, interpret, endure, act, or operate.**

A Trait should feel like something that has become part of the protagonist rather than an item placed in an inventory.

For identity-bearing Traits, the preferred causal shape is:

```text
source experience
-> recognition
-> practice / assimilation where applicable
-> internalization
-> reusable capability
-> player-owned choice
-> consequence
```

The source may be a relationship, repeated practice, conflict, dangerous knowledge, a place, a relic, metaphysical exposure, or embodied adaptation. Relationship provenance is central to Campaign One's primary product promise, but not every legitimate Trait must come from an NPC.

## 3. Story alignment

Campaign One dramatizes a protagonist who begins by treating connection primarily as leverage and gradually encounters forms of understanding, capability, reciprocity, and strategic resilience that cannot be reduced to control or approval.

The major story tensions relevant to Traits include:

- instrumental connection vs authentic bond;
- control vs vulnerability;
- power vs surrender;
- pragmatism vs idealism;
- manipulation vs mutual calibration;
- immediate leverage vs slower systemic understanding;
- defending a useful model vs revising it from evidence;
- imposing intention vs respecting real constraints;
- isolated competence vs networked capability.

Trait identity should reinforce those tensions rather than merely coexist with them.

The strongest relationship-derived Traits therefore do more than increase effectiveness. They externalize a change in how the protagonist understands or approaches the world.

## 4. The canonical Campaign One capability core

The current identity-defining Trait set is:

| Trait | Source | Internalized pattern | Why it fits Campaign One |
| --- | --- | --- | --- |
| `WillowsWisdom` | Elder Willow | Trace visible symptoms back to slower systemic causes and act on underlying flow. | Counters the protagonist's bias toward immediate leverage and makes patient systemic understanding actionable. |
| `ScholarlyInsight` | Elara | Revise a model when contradictory evidence appears instead of defending the first plausible explanation. | Turns epistemic humility into gameplay capability and challenges strategic overconfidence. |
| `ConstraintSense` | Gronk | Identify load-bearing constraints beneath surface appearance and preserve what actually carries the work. | Converts practical craft judgment into a reusable strategic principle. |
| `AdversarialCalibration` | Lyra | Model an opponent precisely enough to predict, coordinate with, or counter them without requiring agreement or affection. | Transforms rivalry from target reduction into accurate mutual modeling while preserving ideological conflict. |

These four Traits form the canonical relationship-derived capability core for Campaign One.

They are not interchangeable content keys. Each must remain defensible from a coherent sentence:

```text
Because the protagonist internalized [TRAIT],
they can now ____________________________________.
```

## 5. Trait as character transformation

The best Traits answer two questions at once:

1. **What can the protagonist do now that she could not do before?**
2. **What changed in the protagonist for that capability to exist?**

A capability can be mechanically useful without being identity-bearing. Identity-bearing Traits should make the protagonist's development legible through play.

Examples:

```text
Willow
-> stop treating the visible symptom as the whole system

Elara
-> stop defending the first workable model when evidence contradicts it

Gronk
-> stop optimizing the surface while ignoring load-bearing constraints

Lyra
-> stop reducing an opponent to an object of control
   and model another agent accurately enough to coordinate or counter
```

This does not require every Trait to encode moral growth. A Trait may deepen, complicate, darken, or destabilize the protagonist as long as the transformation is coherent.

## 6. Trait source families

The following are useful **authoring lenses**, not required runtime enums.

### 6.1 Relationship-derived

A meaningful relationship exposes and qualifies an internalized pattern.

Examples:

- `WillowsWisdom`;
- `ScholarlyInsight`;
- `ConstraintSense`;
- `AdversarialCalibration`.

Campaign One's primary product identity gives these Traits special importance because they make "who the player learned from" part of build identity.

### 6.2 Practice-derived

Repeated embodied or operational experience produces durable capability.

Examples may include battle conditioning, disciplined focus, or another practice the protagonist personally performs enough to change.

The source should be more than generic XP accumulation when the Trait is intended to be identity-bearing.

### 6.3 Knowledge-derived

Understanding dangerous, rare, or difficult knowledge alters what the protagonist can perceive or attempt.

A knowledge-derived Trait should express the knowledge's actual consequences rather than exist only as an abstract intelligence bonus.

### 6.4 Exposure-derived

Relics, environments, metaphysical phenomena, or other extraordinary exposures may permanently alter the protagonist.

These Traits are especially suitable for capabilities with meaningful costs, distortions, or new perceptions.

### 6.5 Embodied adaptation

Physical changes may legitimately produce direct passive capability.

Not every Trait needs a philosophical identity. Physical resilience or practiced combat capability can remain valid secondary build texture when the runtime effect is real and the fiction is honest.

## 7. Identity-bearing vs secondary Traits

Campaign One deliberately permits two different depths of Trait.

### Identity-bearing Traits

These should usually have:

- a legible source;
- a coherent semantic capability;
- repeated or cross-context meaning;
- a relationship to the protagonist's development;
- authored gameplay consumers where appropriate;
- consequences that do not automatically resolve into a universally correct answer.

### Secondary Traits

These may provide bounded direct/passive texture such as:

- Health;
- Defense;
- Mana;
- regeneration;
- attack/speed;
- critical modifiers.

Secondary Traits can be valid without carrying the narrative weight of the canonical four.

The distinction is:

```text
fits the setting
!=
expresses the game's identity
```

Campaign One does not require every Trait to be identity-bearing. Future expansion should, however, prefer identity-bearing Traits when adding major authored progression.

## 8. Catalogue breadth audit

The current `public/data/traits.json` contains **27 Traits**. They do not all have the same relationship to the modern Trait identity.

### 8.1 Canonical identity core — KEEP / DEEPEN

- `WillowsWisdom`
- `ScholarlyInsight`
- `ConstraintSense`
- `AdversarialCalibration`

These are the strongest expression of the modern Trait ontology.

### 8.2 Runtime-valid secondary texture — KEEP where useful

The current catalogue includes direct-stat Traits whose qualified effects are consumed by the Player stat pipeline. Examples include:

- `BattleHardened`;
- `ResilientConstitution`;
- `ArcaneIntellect`;
- `SwiftStrikes`;
- `IronWill`;
- `LuckyCharm`;
- `HeartOfTheMountain`;
- `WhispersOfTheVoid`;
- `MentalFocus` where its qualified Player-stat fields apply;
- `TomeOfForbiddenKnowledge` where its qualified Player-stat fields apply.

These are compatible secondary RPG texture. They should not silently become the design template for future major authored Traits.

### 8.3 Live but non-permanent Player authority

- `EssenceFlow`

Its current named runtime value exists when shared with or inherited by a Copy. That makes it legitimate temporary/shareable content, but not a permanent Player capability in Campaign One.

### 8.4 Legacy identity debt / compatibility catalogue

The following definitions largely reflect an older generic-perk ontology or cut/deferred systems:

- `BargainingMaster`;
- `QuickLearner`;
- `MentorsInsight`;
- `EssenceSiphon`;
- `RelationshipSage`;
- `CombatReflexes`;
- `GrowingAffinity`;
- `SilverTongue`;
- `MasterCraftsman`;
- `ShadowWalker`;
- `ElementalAffinity`;
- `EssenceAffinity`.

They may remain for save/content compatibility under the existing catalogue audit. Their historical metadata does **not** authorize new systems, and their presence does not establish them as models for future Trait identity.

## 9. Story-fit observations from the breadth audit

### Strong fit

The canonical four fit the story identity directly because each represents a meaningful correction, complication, or expansion of the protagonist's initial strategic worldview.

### Compatible but generic

Direct-stat Traits can fit the setting and build texture without expressing the narrative thesis. They are legitimate but secondary.

### Conceptually promising legacy names

Some legacy concepts may contain future thematic potential if later story/content pulls them into production:

- **Essence Siphon** could express extraction and instrumental power as a dark mirror to reciprocal connection.
- **Mentor's Insight** could potentially express learning-how-to-learn from another person rather than a generic gain multiplier.
- **Whispers of the Void** already suggests insight gained through destabilizing exposure.
- **Tome of Forbidden Knowledge** already suggests capability purchased with transformation or cost.

This document does not authorize those reinterpretations. They are examples of how an older name could become identity-bearing only through a later bounded content decision.

### Strong mismatch with the modern ontology

Generic relationship-growth modifiers such as `RelationshipSage` and `GrowingAffinity` are especially weak fits with the current Relationship model because Campaign One treats relationships as evidence-bearing history rather than a universal XP stream.

Likewise, historical generic Skills/Crafting modifiers do not justify restoring cut systems.

## 10. Capability is not decision

The existing gameplay invariant remains central:

```text
capability != decision
```

A Trait may:

- reveal a possibility;
- make a legal action possible;
- change the information available;
- improve or modify an action;
- expose another strategic route.

A Trait should not normally:

- make an irreversible narrative choice automatically;
- guarantee that its route is morally or strategically correct;
- reward its own use merely because the player used it;
- collapse a problem into "press the Trait button."

Trait-enabled options should usually expand meaningful solution space rather than become automatic golden answers.

## 11. Permanent learning vs temporary attunement

The current distinction is identity-significant.

```text
temporary attunement
= I can currently imitate / borrow / experiment with this pattern

permanent Resonance
= this pattern has become durable part of the protagonist

doctrine focus
= this is what the protagonist is deliberately foregrounding now
```

Do not erase this distinction by letting temporary attunement silently satisfy permanent authored mastery gates without new evidence and an explicit design decision.

Temporary Traits may remain a lighter experimentation/sharing layer even if permanent Traits and doctrine carry more strategic narrative weight.

## 12. Trait vs Doctrine

A permanent Trait represents **learned capability**.

A Doctrine represents **current synthesis / strategic posture** among learned capabilities.

Current Campaign One doctrines are intentionally bounded.

### Structural Steward

```text
Willow's Wisdom
+
Constraint Sense
=
understand slow systemic causality
while preserving the structures that actually carry the work
```

### Countermodeler

```text
Scholarly Insight
+
Adversarial Calibration
=
continually revise an evidence-based opponent model
under active opposition
```

Doctrine should emerge from a meaningful intellectual, tactical, or operational synthesis between Traits.

It should not exist merely because two bonus-bearing Traits can be mathematically combined.

## 13. Doctrine synthesis test

A proposed doctrine should be able to answer:

```text
Trait A teaches ____________________.
Trait B teaches ____________________.

Together, foregrounding them creates a coherent posture:
____________________________________.
```

If the final sentence is only "gain both bonuses at once," it is not sufficient evidence for a new doctrine.

Campaign One does not authorize a generic N-way synergy graph.

## 14. Future Trait authoring test

Before introducing a major new Trait, answer:

### Source

What experience, person, practice, knowledge, environment, conflict, or exposure caused this pattern to exist?

### Transformation

What changed in the protagonist?

### Capability

Complete:

```text
Because the protagonist internalized [TRAIT],
they can now ____________________________________.
```

### Reuse

Can at least one meaningful later use be explained by the same underlying capability identity, rather than treating the Trait as an arbitrary content key?

### Choice

Does the Trait create or modify meaningful choice without automatically selecting the correct outcome?

### Authority

Does the claimed effect have an actual named runtime or authored gameplay consumer?

### Story fit

Does this Trait deepen the game's themes, character development, setting texture, or embodied capability rather than merely filling a genre-perk slot?

Not every minor passive Trait must satisfy the strongest narrative test. Major authored Traits should.

## 15. Anti-patterns

Avoid treating these as sufficient justification for a new major Trait:

- "+X% to a system" with no coherent internalized pattern;
- generic relationship XP or passive friendship growth;
- a content prerequisite disguised as a Trait with no reusable meaning;
- a generic Skills/Crafting/equipment hook used to resurrect cut systems;
- arbitrary Trait proliferation to increase catalogue size;
- doctrine combinations created only because two Traits coexist;
- a Trait that automatically chooses irreversible narrative outcomes;
- a Trait route that is universally superior by design;
- flavor metadata presented as runtime authority without a consumer;
- adding runtime schema merely to classify authoring concepts.

## 16. Relationship to the protagonist's arc

Campaign One's relationship-derived Traits can be read as a curriculum of strategic transformation:

```text
Willow
-> perceive slower systems, not only immediate leverage

Elara
-> revise a useful model when evidence contradicts it

Gronk
-> respect load-bearing constraints, not only surface optimization

Lyra
-> model another agent accurately without reducing them to agreement or control
```

The player does not have to become morally identical to these characters.

The stronger promise is:

> The protagonist becomes capable of carrying other people's hard-earned patterns without ceasing to be herself.

This allows Traits to preserve ideological plurality rather than turning relationship progression into simple moral conversion.

## 17. Evidence boundary

Repository evidence currently establishes that:

- authored relationship-derived Trait discovery exists;
- assimilation / compatibility / Memory evidence can qualify permanent Resonance;
- permanent Traits own durable gameplay capability;
- the canonical four have distinct semantic identities;
- those identities are reused in authored gameplay;
- doctrines can derive from foregrounded permanent Traits;
- current doctrine changes legal gameplay options;
- legacy effect metadata is not automatically runtime authority.

Repository evidence does **not** establish that:

- players understand the Trait identity without explanation;
- the canonical four feel equally distinctive in human play;
- doctrine switching is fun or well-paced;
- temporary Trait management has sufficient strategic depth;
- legacy Traits should be removed or redesigned;
- a larger doctrine space is desirable;
- any proposed future reinterpretation is worth implementing.

Those remain Beta / future-content questions.

## 18. Scope and change policy

This identity document is a design constraint, not a construction queue.

It does not authorize:

- adding more Campaign One Traits;
- mass-deleting legacy Traits;
- rewriting save-compatible catalogue IDs;
- creating a new Trait taxonomy enum;
- adding generic capability graphs;
- adding generic synergy engines;
- rebuilding Skills or Crafting;
- changing the recorded FEATURE_COMPLETE maturity state.

A future Trait package must still enter through current product/scope authority and be justified by a concrete content, Beta, expansion, or post-1.0 need.

## 19. Canonical authoring rule

When deciding whether a major future Trait belongs in the game, prefer this question:

> **Does this Trait tell us something meaningful about what the protagonist has internalized—and therefore who she is becoming?**

A Trait that only says "the number is larger" may remain useful secondary texture.

A Trait that changes how the protagonist can understand or act can become part of the game's identity.
