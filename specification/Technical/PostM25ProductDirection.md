# Post-M25 Product Direction

**Status:** Product-direction hypotheses after `M25_PASS`  
**Baseline:** post-merge `main` at `4aabe3f4afd55717452c27564a118c78df4210dd`  
**Prior program:** P17.5 through M25 = completed  
**Authorized next activity:** Human Integrated Playability / Product Review  
**M26:** **NOT AUTHORIZED**

---

## 1. Purpose and authority boundary

This document records product opportunities exposed by the completed M4-M25 qualification program.

It is intentionally **not** a new implementation roadmap and does not authorize M26, a new subsystem, or any code-bearing milestone.

The repository has accumulated strong automated evidence that its major authorities compose correctly. M25 established that Relationship, Trait, Combat, Exploration, Knowledge, Faction Reputation, Objective World State, Copy automation, persistence, and bounded Offline settlement can form a coherent complete Merchant District chapter without introducing a chapter engine, chapter-local shadow state, generalized condition DSL, generalized simulation layer, or new save schema.

The remaining question is no longer primarily:

> Can these systems technically compose?

It is now:

> Which parts of this composition are understandable, meaningful, enjoyable, distinctive, and worth deepening for real players?

Therefore the next governing boundary is:

```text
M25 Complete Chapter Vertical Slice: PASS
-> automated post-M17 implementation program: COMPLETE
-> Human Integrated Playability / Product Review: NEXT
-> Product Direction Decision
-> only then may a new roadmap / M26+ be authorized
```

Future ideas in this document remain **hypotheses** until human evidence and explicit product decisions promote them.

---

## 2. Current empirical product boundary

The strongest qualified product chain is now:

```text
meaningful story / gameplay event
-> Relationship Experience / Memory
-> Connection / Bond interpretation
-> Essence and/or learned Trait conditions
-> durable capability
-> intentional active choice
-> travel / combat / quest consequence
-> independently authored Relationship / Knowledge / Faction / World-State consequences
-> later content consumes those canonical authorities
-> understood routine becomes delegatable to a Copy
-> already-running safe routine may continue through bounded offline settlement
-> player returns to higher-order active decisions
```

M25 further demonstrates:

```text
shared systems
!=
shared outcome
```

Two strategically distinct complete routes can use the same runtime authorities while preserving materially different Relationship history, institutional standing, objective Merchant District state, downstream consumers, and conclusions.

The program deliberately does **not** claim:

- human comprehension;
- human pacing;
- emotional impact;
- fun;
- retention;
- final balance;
- campaign scalability;
- generalized chapter authoring;
- generalized Knowledge, Faction, World, Combat, or simulation completeness.

Those evidence gaps should now control what is built next.

---

## 3. Candidate overarching product thesis

A strong synthesis of the currently qualified systems is:

> **Active strategic and relational play creates knowledge, capabilities, relationships, and world consequences; incremental automation takes over only work the protagonist has already understood and mastered.**

This thesis explains the relationship between the active RPG and incremental layers:

```text
NOVEL / MEANINGFUL / IRREVERSIBLE
-> player attention and authority

UNDERSTOOD / ROUTINE / REPEATABLE
-> eligible for deliberate delegation
```

The incremental layer should compress solved repetition rather than replace discovery, interpretation, social choice, tactical choice, or irreversible narrative agency.

This thesis is a candidate product direction, not a newly qualified empirical result.

---

## 4. Priority 0 — Human Integrated Playability / Product Review

This is the only currently authorized next activity.

The repository already contains a narrower methodological precedent in issue #26, which correctly distinguishes automated routed playability from human comprehension of the Willow Relationship / Trait loop. The post-M25 review should generalize that discipline to the complete integrated chapter.

### Core question

> Can a fresh player complete the Merchant District chapter, form a substantially correct causal model of what happened, make meaningful route decisions, understand why important options and conclusions became available, use delegation appropriately, and want to continue playing?

### Review dimensions

Evaluate at least:

1. **Mechanical discoverability** — can the player find the intended actions and surfaces without coaching?
2. **State legibility** — can the player tell what changed?
3. **Causal legibility** — can the player explain why it changed?
4. **Authority legibility** — can the player distinguish Relationship, Knowledge, Faction Reputation, World State, Trait capability, and routine familiarity well enough for meaningful decisions?
5. **Strategic agency** — do route differences feel materially consequential rather than cosmetically branched?
6. **Emotional / narrative coherence** — do long-horizon callbacks and multi-NPC interpretations feel like remembered history rather than hidden condition checks?
7. **Incremental fit** — does Copy delegation feel like earned mastery rather than idle busywork or loss of agency?
8. **Pacing** — do active play, explanation, travel, combat, social consequence, and automation compose at a satisfying cadence?
9. **Desire to continue** — what does the player want more of after the chapter?

### Failure classification

Do not immediately add tutorials or new systems after a weak session. Classify the failure first:

```text
discoverability failure
state-legibility failure
causal-explanation failure
terminology failure
mechanical contradiction
content / dramatization failure
pacing failure
strategic-choice weakness
system-value weakness
```

Prefer the smallest repair layer that addresses the observed failure.

---

## 5. Priority hypothesis H1 — Causal Legibility UX

### Opportunity

The game maintains unusually rich canonical causality. Important options can depend on old Relationship evidence, durable Memories, learned Traits, NPC-specific Knowledge, institutional standing, and objective World State.

If players can understand those causes without reading implementation-level state, causal transparency could become a defining product strength.

### Candidate player-facing expression

Possible surfaces include concise explanations such as:

```text
AVAILABLE BECAUSE
The Patrol He Let You Rewrite
-> established delegated judgment with Valerius
-> permits this operation
```

or:

```text
MERCHANT DISTRICT: HEAVY WATCH PRESENCE
Caused by:
public Watch override
-> patrol redeployment
```

or:

```text
LOCKED
You know the Forge routine,
but Valerius does not yet know what happened there.
```

### Design constraint

Expose the **meaningful causal chain**, not every reducer mutation or raw prerequisite.

The UI should explain the game, not resemble an internal debugger.

### Questions for human review

- Do players know why an option appeared or disappeared?
- Do they confuse Relationship with Faction standing?
- Do they confuse objective World State with what an NPC knows?
- Do they understand why an ending occurred?
- Which existing UI surfaces already explain enough?

### Promotion condition

Promote this into implementation only if human review shows that valuable causal depth exists but players cannot reliably perceive or explain it.

---

## 6. Priority hypothesis H2 — Second Complete Chapter Before a Chapter Engine

### Opportunity

M25 proves one complete chapter can be authored using existing domain authorities without a chapter engine or chapter-local shadow state.

The next scalability question should therefore be content heterogeneity, not automatic abstraction.

### Working principle

> **Do not infer “Chapter System required” from one successful chapter.**

Author a second structurally different chapter first and observe repeated friction.

### Candidate contrast

The Merchant District chapter emphasizes:

```text
institutions
trade
public order
secrecy
social coordination
```

A second chapter should deliberately stress a different center of gravity, for example:

```text
knowledge disagreement
evidence interpretation
competing experts
selective disclosure
Trait-driven investigation
institutional ownership of discovery
```

The objective is not to select this exact theme now. The objective is to force the existing architecture to support a genuinely different chapter shape.

### Rule-of-Two application

Only after two heterogeneous complete chapters repeatedly demand the same authoring mechanism should generic chapter infrastructure become a serious candidate.

Possible repeated friction could justify narrow abstractions such as:

- reusable conclusion condition composition;
- reusable route tracing;
- content package manifests;
- content validation helpers.

It should **not** automatically justify a generalized chapter scripting engine or narrative DSL.

### Promotion condition

Promote a second chapter into the next implementation program if human review shows that the existing core experience is worth extending and content breadth is more valuable than repairing current comprehension/pacing defects.

---

## 7. Priority hypothesis H3 — Content Authoring Intelligence

### Opportunity

The repository increasingly relies on authored identifiers and cross-domain prerequisites:

```text
NPC IDs
Dialogue IDs
Quest IDs
Relationship Experience IDs
Memory IDs
Trait IDs
Knowledge fact IDs
Faction IDs
World-State fields
Location IDs
Copy routine IDs
```

As content volume grows, authoring correctness may become a larger scaling risk than runtime capability.

### Candidate developer tooling

Possible static / test-time tools include:

```text
dangling prerequisite detection
unreachable dialogue detection
mutually impossible prerequisite detection
one-shot decision audits
missing Knowledge acquisition paths
orphaned Relationship Experiences / Memories
invalid Faction IDs
invalid World-State keys/values
route-to-conclusion reachability checks
cross-file duplicate ID detection
content-package manifest validation
```

A higher-value diagnostic could eventually support:

```text
trace-route --conclusion <id>
```

and produce a human-readable causal path through canonical prerequisites.

### Boundary

This is **developer-side authoring intelligence**, not permission to introduce a generalized runtime condition language.

Prefer stronger validation around explicit authored contracts over increasingly magical runtime behavior.

### Promotion condition

Promote specific tooling only when a second content slice or human-review repair exposes repeated authoring mistakes, discovery cost, or route-debugging friction.

---

## 8. Priority hypothesis H4 — Relationship-Derived Traits as the Player Build

### Opportunity

The strongest differentiated progression idea may be:

```text
Relationship
-> learning
-> durable capability identity
-> reusable application across gameplay domains
-> player build
```

rather than:

```text
Trait
-> interchangeable numeric bonus
```

### Candidate capability identities

Examples for exploration, not commitments:

#### Willow's Wisdom

Identity: slow patterns, cycles, feedback structures, systemic causation.

Possible applications:

```text
combat        -> recognize repeating tactical cycle
investigation -> infer slow causal process
world problem -> repair underlying feedback rather than symptom
social/system -> recognize institutional reinforcing loop
```

#### Scholarly Insight

Identity: contradiction detection, evidence revision, model correction.

Possible applications:

```text
research      -> identify inconsistent evidence
investigation -> reopen a flawed model
social        -> challenge a false premise
systems       -> detect impossible accounting / logistics pattern
```

#### Future Lyra-derived capability

A future adversarial capability could focus on extracting useful calibration from opposition rather than granting a conventional damage bonus.

### Design constraints

- Trait availability must not make the player's decision automatically.
- A capability should usually expand solution space rather than delete baseline viability.
- A Trait should retain recognizable semantic identity across contexts.
- Relationship history should explain how the capability was learned; Trait state should remain the durable capability authority.

### Promotion condition

Promote buildcraft depth if human review identifies learned capabilities as one of the most compelling parts of the experience and players want broader opportunities to apply them.

---

## 9. Secondary candidate — World State as Gameplay Affordance

### Opportunity

M24 qualifies bounded objective Merchant District conditions and M25 proves they can participate in chapter causality.

A future direction could make objective state affect gameplay texture, for example:

```text
tradeFlow = strong
-> different merchant inventory / prices / logistics opportunities

watchPresence = heavy
-> different public-space access / criminal-contact behavior / encounter pressure
```

### Expansion risk

Do not infer that World State requires a simulated city economy, population model, patrol AI, ecology, or generalized event simulation.

Prefer explicit high-value affordances attached to already meaningful objective conditions.

---

## 10. Secondary candidate — Faction Reputation as Strategic Institutional Access

### Opportunity

M23 proves personal Relationship and institutional standing are independent.

Future institutional consequences could include:

```text
restricted contacts
institutional resources
permission / clearance
contract access
protection
hostility
service terms
```

### Expansion risk

Do not collapse Faction Reputation into another universal XP ladder or mirror personal Relationship state.

Institutional standing should answer a different question:

> How does this organization regard and treat the player?

---

## 11. Secondary candidate — Knowledge as Information-Control Gameplay

### Opportunity

M22 proves objective truth and per-NPC awareness can diverge.

A future information game could make the strategic question:

> **Who should know what, and when?**

Useful authored operations might include:

```text
Witness
Tell
Withhold
Verify
Expose
```

Only later evidence should justify richer semantics such as misinformation, confidence, belief revision, forgetting, or rumor propagation.

### Expansion risk

Do not build a generalized epistemic simulation merely because per-NPC Knowledge now exists.

---

## 12. Secondary candidate — Copy Network as Incremental Strategy

### Opportunity

The current doctrine already creates a coherent division of labor:

```text
Player
-> novelty
-> meaning
-> relationships
-> exploration
-> important decisions

Copies
-> understood repetition
-> maintenance
-> known procedures
-> routine logistics
```

A deeper Copy network could eventually introduce specialization, competing routine portfolios, deployment opportunity cost, and broader mastered-work automation.

### Expansion risk

Do not allow Copies or offline settlement to choose irreversible narrative, social, travel, combat, Faction, Knowledge, or World-State decisions for the player.

The incremental fantasy should be **earned delegation**, not removal of the active game.

---

## 13. Secondary candidate — Combat Breadth

### Opportunity

M17 proves one meaningful Trait-sensitive encounter and M25 proves Combat can live inside a larger chapter.

Possible future growth:

- a small set of enemy archetypes;
- more Trait-sensitive tactical problems;
- a few distinct decision patterns;
- clearer integration between learned capabilities and encounter tactics.

### Expansion risk

Do not turn the project into a conventional combat RPG with the relationship architecture reduced to a peripheral buff system.

Broader Combat should be justified by human evidence that tactical play is central to the desired experience.

---

## 14. Secondary candidate — Time / Presence Opportunity Cost

### Opportunity

M18/M19 already make objective location and presence meaningful. Future evidence could justify selective temporal consequences such as travel duration, commitments, or scheduled opportunities.

### Expansion risk

Do not introduce NPC schedules, continuous time simulation, pathfinding, autonomous movement, or offline world replay without a concrete player-facing need.

---

## 15. Technical stewardship candidates

Technical modernization is important but should remain separate from product-direction decisions unless it blocks development.

Candidate stewardship work includes:

- React / type-package alignment;
- TypeScript modernization;
- migration away from Create React App / `react-scripts` if warranted;
- Jest / Testing Library modernization;
- CI organization / runtime improvements;
- content-validation performance.

These should not compete conceptually with the question of what game to build next.

Promote technical work when current tooling creates material correctness, security, development-speed, dependency, or maintenance risk.

---

## 16. Anti-expansion controls

Until human review and an explicit post-review product decision occur, do **not** automatically authorize:

```text
M26+
generalized ChapterEngine
generalized narrative condition DSL
open-world simulation
NPC schedule simulation
procedural narrative generation
generalized rumor / belief simulation
generalized faction diplomacy
generalized economy simulation
large combat rewrite
autonomous Copy planning
offline narrative/world simulation
```

A promising idea is not evidence that the corresponding abstraction is necessary.

Apply the repository's existing discipline:

```text
real case
-> observed friction
-> independent second case where relevant
-> smallest justified intervention
-> explicit qualification
```

---

## 17. Questions the Human Integrated Playability Review should settle

The post-M25 review should try to answer these product-direction questions, not merely collect bug reports.

### Core experience

- What does the player think the game is fundamentally about?
- Which moment feels most distinctive?
- Which system feels like bookkeeping rather than play?
- Which causal connections does the player spontaneously notice?

### Relationships and capabilities

- Do players understand that Connection is not Affinity XP?
- Do Memories feel like remembered causes rather than collectibles?
- Do learned Traits feel earned?
- Do Traits feel like capabilities or mostly modifiers?
- Does relationship history feel like part of the player's build?

### Social / strategic state

- Can players distinguish personal Relationship from institutional Faction standing?
- Can they distinguish objective World State from what an NPC knows?
- Is selective Knowledge interesting or merely confusing?
- Do long-horizon callbacks feel rewarding when they fire?

### Active vs incremental play

- Does delegation feel like mastery?
- Is the player happy to stop doing a routine after learning it?
- Does offline progress create satisfying return feedback?
- Does automation preserve the desire to actively play?

### Content direction

- Does the player want more character/relationship content?
- More Trait applications?
- More strategic information / institutions?
- More combat?
- More world consequences?
- More delegation / incremental depth?

The answers should influence the ordering of future work.

---

## 18. Promotion rule for future milestones

A candidate direction may become a future milestone only after:

1. the Human Integrated Playability / Product Review is completed or explicitly judged insufficient for the specific decision;
2. the observed player/product problem or opportunity is recorded;
3. the candidate is compared against competing directions;
4. the smallest testable next question is defined;
5. its authority boundary and non-goals are explicit;
6. a fresh milestone is separately preregistered against the then-current repository state.

Do not retroactively treat this opportunity map as preregistration.

---

## 19. Post-review decision shape

The expected decision boundary is:

```text
Human Integrated Playability Review
        ↓
classify failures + strongest player pull
        ↓
smallest repairs if required
        ↓
fresh human rerun where warranted
        ↓
POST-M25 PRODUCT DIRECTION DECISION
        ↓
new roadmap
        ↓
only then authorize M26+
```

Possible outcomes include, but are not limited to:

```text
causal depth is valuable but incomprehensible
-> prioritize causal-legibility repair

experience is understandable but pacing/content is weak
-> prioritize chapter/content revision

current chapter works and players want more breadth
-> prioritize a heterogeneous second chapter

Traits are the strongest hook
-> prioritize capability/buildcraft breadth

information / institutions are the strongest hook
-> prioritize Knowledge/Faction/World strategic play

delegation is the strongest hook
-> deepen the Copy network while preserving player-owned decisions

combat is not a major source of value
-> do not expand Combat merely because the engine can support it
```

Player evidence should choose the next roadmap rather than a precommitted M26-M35 sequence.

---

## 20. Current decision marker

```text
M25 Complete Chapter Vertical Slice       PASS
Automated post-M17 implementation program COMPLETE
Human Integrated Playability Review       NEXT
Post-M25 product hypotheses                RECORDED HERE
M26                                        NOT AUTHORIZED
```

The repository should now learn what kind of game its qualified architecture is best at becoming before expanding the architecture again.
