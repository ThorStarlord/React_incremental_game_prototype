# Post-M25 Product Direction Decision Readiness

**Status:** CURRENT AUTHORITY for Product Direction decision preparation  
**Prepared:** 2026-09-11  
**Product Direction Decision:** NOT YET MADE  
**Human product-quality evidence:** UNPROVEN  
**M26:** NOT AUTHORIZED

## Purpose

The repository has moved beyond the question of whether its major systems can technically compose. M25 and the post-M25 packages demonstrate deterministic composition across Relationship, Trait, Knowledge, Faction, World State, chapter-scale projections, causal explanation, Copy delegation, persistence, offline boundaries, and multiple content shapes.

This document prepares the next Product Direction decision without pretending that repository evidence can answer human product questions.

It does **not** select the final game identity, authorize M26, or claim that players understand, enjoy, or value the implemented systems.

## Decision to be made

The next Product Direction Decision should answer:

> **Which demonstrated product identity deserves disproportionate depth in the next authorized roadmap?**

Four candidate identities are now sufficiently concrete to compare:

1. causal RPG / causal legibility;
2. relationship-derived capability buildcraft;
3. earned delegation / incremental mastery;
4. heterogeneous content composition as an enabling architecture.

These are not mutually exclusive. The decision may select a reinforcing combination, but it should identify a primary product promise rather than treating every implemented system as equally central.

## Candidate A — Causal RPG / causal legibility

### Repository evidence

The game already records and consumes causal state across Relationship Experiences, Memories, Traits, Knowledge, Faction Reputation, objective World State, dialogue eligibility, chapter progress, and conclusions.

Post-M25 implementation adds:

- Causal Journal;
- Opportunity Map;
- Relationship-Derived Build projection;
- contextual `Available because` explanations for already-visible dialogue choices;
- spoiler-safe projection rules that keep hidden/locked authored content fail-closed.

### Potential product value

The game can expose **why** an action, capability, consequence, or conclusion exists using the same canonical evidence that actually caused it. That can make long-horizon state feel remembered rather than arbitrary.

### Risks / unknowns

- explanation may feel like a debugger rather than game language;
- too much causal detail may reduce discovery or dramatic ambiguity;
- terminology may remain difficult even when technically accurate;
- repository tests cannot prove that players form a useful mental model.

### Evidence needed before major expansion

Human review should test whether players can explain important state changes and whether causal explanations improve understanding without overwhelming or spoiling them.

## Candidate B — Relationship-derived capability buildcraft

### Repository evidence

The repository supports the chain:

```text
Relationship Experience
-> Memory / interpretation
-> Trait discovery and assimilation
-> permanent capability ownership
-> semantic application in multiple gameplay domains
```

`ScholarlyInsight` now has qualified use beyond one domain, and Player Insight can show the relationship-derived build state without becoming acquisition authority.

### Potential product value

Relationships can become part of the player's **build identity**, not merely affection meters or quest gates. What the protagonist learns from people can become durable capability.

### Risks / unknowns

- capability acquisition may feel opaque or over-gated;
- the content cost of giving each Trait meaningful semantic applications may be high;
- Traits could drift into interchangeable numeric bonuses if expansion is not disciplined;
- repository tests cannot prove that players perceive relationships as buildcraft.

### Evidence needed before major expansion

Human review should test whether players understand where capabilities came from, whether that origin matters emotionally/strategically, and whether they want to pursue different relationships partly for different capability identities.

## Candidate C — Earned delegation / incremental mastery

### Repository evidence

M20/M21 and post-M25 Copy strategy establish a bounded automation model:

```text
player understands routine
-> routine becomes eligible for delegation
-> player selects/authorizes Copy priorities
-> existing eligibility gates remain authoritative
-> safe repeatable work may continue
-> irreversible narrative/social/world decisions stay with the player
```

Copy routine priority and `Start Preferred` deepen strategy without automatic task chaining or autonomous irreversible planning.

### Potential product value

The incremental layer can represent **mastery compression**: solved repetition leaves the player's attention so higher-order decisions can take its place.

### Risks / unknowns

- automation may feel like idle busywork rather than earned mastery;
- players may not understand when or why delegation becomes available;
- too much delegation can erase active gameplay; too little can make the incremental layer irrelevant;
- repository tests cannot establish satisfying cadence or perceived agency.

### Evidence needed before major expansion

Human review should test whether delegation feels earned, whether players understand its boundaries, and whether it creates anticipation for higher-order play rather than simply reducing clicks.

## Candidate D — Heterogeneous content composition

### Repository evidence

Three chapter-scale projections now exist over the same domain authorities:

- **Merchant District Crisis** — institutions, trade, public order, social coordination;
- **Archive Inquiry** — evidence interpretation, reciprocal revision, independent verification;
- **Enemies in Phase** — adversarial learning, calibrated opposition, necessary cooperation.

The third chapter remains structurally different, and the repository still does not require a generalized ChapterEngine, narrative DSL, or duplicate chapter state.

### Potential product value

The architecture can support content breadth while keeping canonical state in domain systems. This is important leverage for authoring a larger game.

### Risks / unknowns

- architectural heterogeneity is an enabling quality, not automatically a player-facing product identity;
- more chapters can increase authoring/debugging cost even if runtime architecture stays clean;
- chapter count alone does not justify generic infrastructure.

### Evidence needed before major expansion

Use concrete authoring friction, not content count, to justify tooling or abstraction. Human review is needed to determine which content shapes are actually worth multiplying.

## Comparative decision matrix

| Candidate | Repository evidence strength | Distinctive player-facing promise | Main expansion cost | Critical human unknown |
| --- | --- | --- | --- | --- |
| Causal RPG / legibility | High | Consequences remain explainable across long horizons | explanation design + content labeling | do players understand/value the causal model? |
| Relationship-derived buildcraft | Medium-high | people you learn from become part of your build | semantic Trait content across domains | does relationship-origin capability feel meaningful? |
| Earned delegation | High for bounded mechanics | mastery removes solved repetition while agency stays active | pacing + routine portfolio design | does delegation feel earned and satisfying? |
| Heterogeneous composition | High technically | enables varied authored chapters without a giant engine | authoring/debugging/tooling | which content should actually be expanded? |

## Leading synthesis hypothesis — not a decision

The strongest repository-grounded synthesis is currently:

```text
meaningful relationship / world event
-> understandable causal memory
-> learned durable capability
-> intentional higher-order choice
-> repeated understood work becomes delegatable
-> player attention returns to novel / meaningful / irreversible decisions
```

In this synthesis:

- **causal legibility** explains how the world remembers;
- **relationship-derived buildcraft** explains how the protagonist changes;
- **earned delegation** explains how the incremental layer serves mastery;
- **heterogeneous composition** is the architectural enabler rather than the product promise itself.

This is the leading **hypothesis** because the three player-facing ideas reinforce one another in the existing implementation. It must not be promoted to final Product Direction without the evidence required by `PostM25ProductDirection.md`.

## Decision criteria for the eventual Product Direction

When human evidence is available, compare candidates using the following criteria:

1. **Comprehension** — can players form a substantially correct mental model?
2. **Distinctiveness** — does the idea feel meaningfully different from conventional RPG/incremental progression?
3. **Strategic consequence** — does it change decisions rather than merely presentation?
4. **Emotional/narrative reinforcement** — does system behavior strengthen remembered relationships and consequences?
5. **Incremental fit** — does automation compress solved repetition without replacing novelty or agency?
6. **Authoring scalability** — can the content be expanded without disproportionate fragility or boilerplate?
7. **System reinforcement** — does deepening one identity strengthen the others instead of creating an isolated subsystem?
8. **Cost of depth** — what new content, UX, validation, and maintenance burden does the direction create?

## Repository-only work permitted before human review

The following work can increase decision readiness without claiming product quality:

```text
three-chapter authoring-friction audit
chapter-definition integrity qualification
small authoring diagnostics justified by repeated friction
test-fixture or type-safety cleanup justified by current chapter evidence
documentation reconciliation
```

The following should remain blocked absent a new explicit product decision or concrete bottleneck:

```text
M26
generalized ChapterEngine
generalized narrative DSL
large new Trait catalog
autonomous Copy planning
offline narrative progression
open-world/NPC schedule simulation
content-volume expansion by inertia
```

## Human Integrated Playability / Product Review questions

When human validation becomes available, prioritize questions that discriminate between the candidate directions:

- Can a fresh player explain why a consequential option appeared?
- Do players distinguish Relationship history, Trait capability, Knowledge, Faction standing, and objective World State?
- Do relationship-derived capabilities feel earned from a person/history rather than granted by an invisible checklist?
- Does `Available because` help or feel like internal implementation language?
- Does Copy delegation feel like mastery, convenience, or loss of play?
- Which moments do players spontaneously describe as the game's distinctive idea?
- After a chapter, what do players want more of: relationships/capabilities, causal consequences, delegation strategy, tactical systems, or new content?

## Promotion rule

A future Product Direction Decision should explicitly record:

```text
selected primary promise
supporting secondary identities
human evidence used
known counter-evidence
features to deepen
features to hold constant
features to stop expanding
M26 authorization state
```

Until that record exists, **Product Direction remains PENDING and M26 remains NOT AUTHORIZED**.