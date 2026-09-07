# Post-M17 Milestone Roadmap

**Status:** Planned execution program after qualified M17  
**Baseline when authored:** `main` = `7262024388fca1827c69794ee193f31c287e953d`  
**Baseline tree:** `5b8c47a659305b6cd005022dbee499f526e44e7f`  
**Scope:** P17.5 through M25, including Checkpoints B/C and final human playability review  
**Authority note:** This document is a roadmap and experiment plan. Individual milestone semantics become authoritative only when that milestone is preregistered against the actual then-current repository state and qualified.

---

## 1. Qualified foundation through M17

The current program builds on these qualified results:

- **M13:** persisted Relationship evidence can cause later story/gameplay consequences;
- **M14:** one shared event can produce different/conflicting consequences across several Relationships;
- **M15:** old and newer Relationship evidence can remain jointly causal across intervening content and save/load;
- **M16:** a Relationship-derived permanent Trait can materially expand ordinary gameplay solution space;
- **Checkpoint A:** Trait-to-gameplay doctrine was reconciled: Relationship qualifies learning, Trait owns durable capability, gameplay determines local applicability, and the player decides whether to use it;
- **M17:** one bounded deterministic combat encounter proved that permanent `WillowsWisdom` can create an optional tactical route while ordinary no-Trait victory remains viable and combat victory feeds the existing Quest `KILL` event bridge.

Current proven chain:

```text
Relationship
-> learning
-> permanent capability
-> gameplay decision
-> combat / quest consequence
```

The remaining program expands this outward into space, presence, automation, elapsed time, knowledge, institutions, and objective world consequences before integrating them into one complete chapter.

---

## 2. Program sequence

```text
POST-M17 RECONCILIATION
        ↓
M18 — Exploration / Travel
        ↓
M19 — World-Derived Tether
        ↓
CHECKPOINT B — Active RPG Loop
        ↓
M20 — Copy Task Automation
        ↓
M21 — Offline Progress
        ↓
CHECKPOINT C — Incremental Integration
        ↓
M22 — Social Knowledge Propagation
        ↓
M23 — Faction Reputation
        ↓
M24 — Objective World State
        ↓
M25 — Complete Chapter Vertical Slice
        ↓
HUMAN PLAYABILITY / PRODUCT REVIEW
```

Milestone numbering is only frozen once the milestone is preregistered. Recon may legitimately reveal a prerequisite defect or justify changing sequence.

---

## 3. Program-wide execution discipline

Every code-bearing milestone should use the qualification discipline proven in M15–M17.

### Before behavior changes

1. Verify current `main` SHA/tree.
2. Create a fresh milestone branch.
3. Create and commit a preregistration/qualification document before behavior changes.
4. Recon the current implementation rather than trusting roadmap assumptions.
5. Run prerequisite and semantic-fit gates.
6. Apply Rule-of-Two before introducing generic abstractions.

### During implementation

7. Implement the smallest production case that can answer the scientific question.
8. Implement an explicit control case.
9. Enforce authority below the UI as well as in the UI.
10. Test the relevant persistence boundary.
11. Reuse existing downstream contracts instead of inventing duplicate bridges.
12. Add a dedicated milestone qualification suite.
13. Add the suite to accumulated Build Validation.

### Qualification and merge

14. Freeze the first complete behavioral SHA/tree.
15. Open a draft PR.
16. Run Build Validation on the exact behavioral head.
17. Treat a clean FAIL as evidence; do not normalize it into a pass.
18. Record actual results, architecture findings, non-findings, and evidence ceiling.
19. Freeze a documentation-complete final SHA/tree.
20. Re-run Build Validation on the exact final head.
21. Mark the PR ready only after exact-head qualification passes.
22. Verify the head has not moved.
23. Merge with an expected-head SHA guard.
24. Verify the integrated `main` tree matches the qualified tree.
25. Claim post-merge CI only when an actual merge-commit workflow run exists.
26. Stop at the milestone boundary.

**Merge authority:** Build Validation + preregistered criteria. Repository Gemini review is not merge authority.

If a milestone exposes a prerequisite defect, stop the milestone, preserve the finding, repair/qualify the prerequisite separately, then restart from the corrected baseline.

---

# P17.5 — Post-M17 Product / Documentation Reconciliation

## Purpose

Correct post-M17 documentation drift before M18 so future work starts from accurate canon.

The reconciliation should record that Combat is no longer only an event bus: one bounded deterministic encounter is qualified, with Strike/Guard, a Trait-sensitive tactical route, victory/defeat handling, replay protection, and ordinary Quest integration. It should also preserve the evidence ceiling that no general combat system is qualified.

## Expected scope

Documentation only. Likely targets after recon:

- `specification/GameDesignDocument.md`;
- `specification/README.md`;
- roadmap/status references that still call M17 future work.

Do not modify runtime/content unless a real contradiction requires a separately qualified repair.

## Acceptance

- canonical product maturity reflects M17 accurately;
- M18 is identified as the next code-bearing candidate;
- no runtime/content behavior changes;
- exact final head passes Build Validation;
- merge and use that merge as the M18 baseline.

## Evidence ceiling

> Repository canon accurately reflects product maturity through M17.

No new behavior is qualified by P17.5.

---

# M18 — Narrow Exploration / Travel Vertical Slice

## Scientific question

> Can the player intentionally traverse a small authored world graph through a player-facing travel interface, with canonical player location producing ordinary gameplay consequences, without duplicate location flags or a generalized world simulation?

## Existing substrate to preserve

- Player state already owns `location` through `setLocation`.
- Existing listeners already consume location changes for `REACH_LOCATION` Quest objectives.
- Existing qualification tests currently simulate travel by dispatching `setLocation` directly.

M18 should turn that substrate into actual player-facing navigation instead of creating a second location authority.

## Production slice

Start with a very small authored graph, for example:

```text
Merchant District
       |
   City Center
       |
    City Gate
       |
Whispering Woods
```

A minimal initial location contract may be only:

```ts
LocationDefinition {
  id
  name
  connections
}
```

Add travel time, NPC presence, resources, encounters, or activities only if real M18 cases require them.

## Authority boundary

```text
World   -> owns spatial topology / objective place facts
Player  -> owns player current location
NPC     -> owns NPC objective location where applicable
Quest   -> reacts to location facts
Relationship -> does not own location
```

Do not add scattered booleans such as `willowNearby`, `playerAtGrove`, or `silasInMarket` when canonical location facts can answer the question.

## Required controls

1. Connected travel succeeds.
2. Illegal non-adjacent jump is rejected below the UI.
3. A production `REACH_LOCATION` Quest completes through the existing listener after UI travel.
4. Save/load preserves location and allows travel to continue.
5. Direct runtime bypass cannot violate route legality.

## Timing boundary

Real travel duration is not mandatory for M18. Do not introduce a game-clock/offline architecture solely to make travel take time. M18 may qualify topology and intentional movement before temporal travel.

## Stop conditions

Stop/reassess if:

- canonical location is duplicated into a second store;
- basic adjacency requires a generalized pathfinding/world-simulation engine;
- Quest needs a special Travel->Quest bridge despite existing location listeners;
- route legality exists only in UI;
- the bounded graph cannot be represented without broad open-world infrastructure.

## Evidence ceiling

> One bounded authored world graph supports legal player-facing movement, authoritative route validation, persistence, and ordinary location-sensitive Quest consequences.

Does not qualify open-world exploration, travel-time economy, procedural maps, random encounters, or exploration balance.

---

# M19 — World-Derived Relationship Tether

## Scientific question

> Can objective world presence alter the current intensity of Relationship-derived Essence generation without rewriting Relationship history, Connection, or Bond dimensions?

## Existing substrate to preserve

The Essence/Relationship model already uses:

```text
NPC Essence Rate
= Connection Base Rate
x Resonance Quality
x Tether
x Stability
```

Tether states already exist, but production usage is currently bounded/static/authored. M19 should derive a bounded part of Tether from actual M18 world facts rather than reinvent Tether.

## Core invariant

```text
historical significance != current presence

leaving Willow != losing Connection
leaving Willow -> different current Tether -> different current Essence contribution
```

## Initial derivation

Start with spatial proximity only, for example:

```text
same location                    -> Present
adjacent location                -> Nearby
same region but non-adjacent     -> Remote
very distant/disconnected        -> Absent
```

`Engaged` and `Deeply Engaged` may remain authored/contextual unless a real activity supplies them naturally.

## Rule of Two

Use two independent Relationship-authority NPCs so the derivation is not Willow-specific. Exact NPCs/locations are chosen during preregistration recon.

## Required controls

With Relationship history held constant:

- move player only;
- Connection unchanged;
- Bond dimensions unchanged;
- Memories unchanged;
- Tether changes;
- Essence/sec changes accordingly;
- returning restores the derived band;
- save/load preserves the world facts from which Tether is derived.

## Non-goals

No continuous-distance simulation, GPS coordinates, relationship decay from distance, automatic relationship improvement from proximity, or arbitrary Tether scripting language.

## Evidence ceiling

> World presence can influence current Relationship-derived Essence intensity while historical Relationship authority remains unchanged.

---

# CHECKPOINT B — Active RPG Loop

## Question

> Do Relationship, Trait, Combat, Travel, Presence/Tether, Quest, and Essence now feel like one coherent active RPG loop rather than separate technical features?

## Evaluation areas

- **Spatial agency:** does destination choice matter?
- **Capability identity:** does a Trait remain semantically coherent across Quest/Combat/world use?
- **Combat context:** does combat feel embedded in the world rather than detached?
- **Presence:** does Tether make relationships feel embodied without becoming a proximity relationship meter?
- **Opportunity cost:** are there competing reasons to spend time in different places?
- **Economy legibility:** can the player understand why Essence changes?
- **System legibility:** can the player understand `deep relationship + current presence -> stronger current Resonance`?
- **Automation readiness:** would automation enhance the active loop, or merely hide that the active loop is weak?

## Outcome

```text
PASS -> proceed to M20
WEAK -> improve the active RPG loop first
FAIL -> reconsider exploration/Tether design before automation
```

Do not create M20 solely because the milestone number is next.

---

# M20 — Production Copy Task Automation Qualification

## Important prerequisite finding already known

Do **not** treat M20 as greenfield task-system implementation. The Copy slice already contains structured `activeTask` state and reducers for task start, progress, completion, roles, and duration modifiers. M20 should qualify a production automation loop on top of that substrate.

## Scientific question

> Can a Copy perform bounded repeatable world activity on the player's behalf, produce a real ordinary gameplay/world result, and remain prohibited from resolving meaningful irreversible narrative decisions?

## Production probes

Use at least two independent routine tasks, for example:

- **Forge Assistance** — routine production/repair work;
- **Merchant Surveillance** — routine observation/report generation.

Exact rewards/effects should be chosen from current production needs during preregistration.

## Desired loop

```text
player discovers/unlocks task
-> chooses Copy
-> assigns task
-> Copy works over time
-> task completes
-> routine reward/effect applies once
-> Copy becomes available again
```

## Automation boundary

```text
ROUTINE EXECUTION -> Copy may automate
IRREVERSIBLE DECISION -> player authority
```

Safe examples: gather, monitor, repair, craft, research, patrol.

Unsafe examples: betray someone, expose a source, choose a quest ending, change an alliance, define a Relationship, or make an irreversible political decision.

## Location integration

Recon whether existing `Copy.location` can cleanly use the M18 location authority. Do not create a parallel Copy-world coordinate system.

## Required controls

- valid Copy/task starts;
- unmet role/location/maturity/loyalty requirement rejects before mutation when such requirements are actually authored;
- busy Copy rejects conflicting assignment;
- task progresses deterministically;
- completion applies reward exactly once;
- replay/reload cannot duplicate reward;
- save/load preserves active task;
- no Relationship or narrative decision occurs implicitly.

## Evidence ceiling

> Existing Copy task infrastructure can automate at least two bounded routine production activities with persistent progress and safe one-shot completion, without automating player narrative authority.

Does not qualify autonomous agents, strategic delegation, generalized AI, or whole-economy automation.

---

# M21 — Offline Progress

## Scientific question

> Can explicitly offline-safe time-based systems advance deterministically across save/load using elapsed real time, without replay duplication or silently resolving narrative decisions?

## Initial consumers

Use at least two independent offline-safe systems:

```text
passive Essence
+
Copy task progress
```

A third system such as Copy maturity may be included only if recon shows it naturally shares the same time authority.

## Desired settlement

```text
save at T0
-> application inactive
-> load at T1
-> compute bounded elapsed time
-> apply offline-safe progression
-> present return summary
-> resume live game
```

## Safety doctrine

Offline progression is allowlisted.

Safe candidates:

- passive Essence;
- Copy task progress;
- routine growth/research.

Unsafe candidates:

- dialogue choices;
- quest endings;
- Relationship-defining choices;
- faction alignment decisions;
- major combat decisions.

The first implementation should prefer simply not processing unsafe domains instead of immediately inventing a generalized pending-decision system.

## Time-safety requirements

Preregister:

- authoritative saved timestamp;
- maximum offline interval;
- clock-skew behavior;
- future timestamps;
- zero/negative elapsed time;
- deterministic rounding;
- settlement order.

## Required controls

- zero elapsed -> no meaningful payout;
- normal elapsed -> expected Essence/task progress;
- routine task may complete offline and reward exactly once;
- excessive elapsed -> clamped;
- future timestamp -> no exploit/negative payout;
- repeated normal settlement -> no duplicate elapsed-time reward;
- Relationship/dialogue/irreversible Quest state unchanged.

## Player-facing return summary

Example:

```text
While you were away:
+428 Essence
Forge Assistance completed
Merchant Surveillance: 63%
1 Copy reached maturity threshold
```

## Evidence ceiling

> Two independent offline-safe progression systems can settle bounded elapsed time deterministically and once while narrative authority remains online/player-driven.

Does not qualify arbitrary offline simulation, offline combat, offline story, or background world simulation.

---

# CHECKPOINT C — Incremental Integration

## Question

> Does automation/offline progression support the RPG by removing routine repetition while preserving meaningful active choices, or is it becoming a detached idle game?

## Evaluate whether automation

- reduces repetition;
- preserves important decisions;
- makes relationships/capabilities more valuable;
- gives Copies a coherent reason to exist;
- supplies useful resource flow;
- frees the player to pursue higher-order problems.

Reject or revise if it instead:

- makes manual gameplay irrelevant;
- creates disconnected currencies;
- rewards leaving more than playing;
- turns Copies into passive number generators;
- bypasses narrative consequences.

Preferred doctrine:

```text
player experiences / understands an activity
-> activity becomes routine
-> Copy may automate the routine portion
```

rather than:

```text
menu unlock
-> arbitrary idle task
-> numbers increase
```

---

# M22 — Social Knowledge Propagation

## Scientific question

> Can an event be objectively true while only some NPCs know about it, with later gameplay consuming that knowledge separately from Relationship state?

## Ontology boundary

```text
WORLD        -> what happened?
KNOWLEDGE    -> who knows it happened?
RELATIONSHIP -> what does the history mean between specific people?
FACTION      -> how does an institution regard the player?
```

Core invariant:

```text
event happened != everyone knows event happened
```

## Minimal model

A bounded first model may be only:

```ts
NpcKnowledge {
  npcId
  factIds
}
```

Add provenance such as `witnessed`, `told`, or `reported` only if actual authoring requires it.

Do not introduce belief confidence or epistemic logic in M22.

## Production probes

Use two acquisition paths:

1. direct witnessing;
2. explicit communication/report.

Example structure:

```text
Merchant District event occurs
-> Gronk witnesses it and knows fact
-> Valerius is elsewhere and remains ignorant
-> player/report later informs Valerius
-> Valerius now knows
```

Later content should read knowledge authority rather than a shadow story flag.

## Required controls

- event occurs while non-witness remains ignorant;
- witness learns;
- knowledge persists;
- explicit communication transfers fact;
- Relationship metrics do not automatically change;
- knowing a fact does not imply liking, trusting, or believing the player;
- later content gate consumes canonical knowledge state.

## Non-goals

No rumor graph, misinformation engine, confidence scores, lies/deception simulation, theory-of-mind, forgetting/decay, or global gossip.

## Evidence ceiling

> Objective events and per-NPC knowledge can diverge and later content can consume that distinction.

---

# M23 — Faction Reputation

## Scientific question

> Can the player's standing with an institution differ materially from their personal Relationship with an NPC belonging to that institution?

## Core invariant

```text
Valerius Relationship != City Watch Reputation
```

Valid example:

```text
Valerius Trust      +65
City Watch Standing -20
```

## Initial factions

Prefer two independent institutions, for example:

- City Watch;
- Merchants Guild.

Add a third only if a real production case needs it.

## Minimal state

Potentially:

```ts
FactionStanding {
  factionId
  reputation
}
```

Derived reputation bands are optional and should exist only if actual content consumes them.

## Production evidence

Use at least:

- one event that helps an individual while harming the institution;
- one event that helps the institution without improving the individual Relationship.

## Required controls

- same personal Relationship, different faction standing -> different institutional consequence;
- same faction standing, different personal Relationship -> different interpersonal consequence;
- faction state persists;
- Relationship dimensions do not mirror faction value;
- faction gates read faction authority;
- no averaging NPC Affinity into reputation.

## Non-goals

No faction diplomacy simulation, organizational AI, automatic reputation spread, faction relationship matrix, or aggregation of personal Relationships into institutional standing.

## Evidence ceiling

> Personal Relationship and institutional standing are independently authoritative and can diverge while both affect gameplay.

---

# M24 — Objective World-State Consequences

## Scientific question

> Can player actions alter persistent objective world conditions that later gameplay consumes, without storing those conditions in Relationship, faction reputation, knowledge, or ad-hoc story booleans?

## Bounded region

Prefer the Merchant District because it already has substantial qualified narrative history.

Potential state fields:

```text
tradeFlow
watchPresence
syndicateInfluence
infrastructureCondition
```

Do not make all fields numeric by default. Small enums may be sufficient for the first proof.

Example:

```text
watchPresence: low | normal | heavy
tradeFlow: blocked | disrupted | normal | strong
```

## Authority separation

```text
World State        = what objectively exists now
Faction Reputation = how an institution regards the player
Knowledge          = who knows which facts
Relationship       = what shared history means between people
```

A coherent state may be:

```text
Watch presence: HEAVY
City Watch reputation: -15
Valerius Trust: +60
Silas knows why it happened: YES
Gronk knows why it happened: NO
```

## Rule of Two

Require two independent world-state fields and two real downstream consumers before extracting a generic world-state framework.

Example:

```text
watchPresence -> alters access/encounter
tradeFlow     -> alters merchant availability
```

## Required controls

- same Relationships, different World State -> different consequence;
- same faction standing, different World State -> different consequence;
- world state persists;
- mutation has explicit provenance/event;
- world change does not automatically create a Relationship effect;
- no shadow booleans duplicate structured world conditions.

## Non-goals

No city simulation, macroeconomic simulation, population model, procedural ecology, arbitrary state-expression DSL, or generalized world-rule engine.

## Evidence ceiling

> A bounded region can maintain persistent objective conditions independently of social interpretation, and later gameplay can consume those conditions.

---

# M25 — First Complete Chapter Vertical Slice

## Purpose

M25 should mostly integrate qualified systems and author content. It should not be an excuse to build another large subsystem.

## Scientific/product question

> Can the qualified Relationship, Trait, Combat, Exploration, Tether, Copy, Offline, Knowledge, Faction, and World-State systems compose into one coherent playable chapter in which earlier social history changes capability, capability changes action, action changes world/social consequences, and routine work can be delegated without surrendering important player decisions?

## Recommended chapter

**Merchant District Crisis** remains the leading candidate because it already has qualified history involving Silas, Valerius, and Gronk and naturally supports faction/world/knowledge consequences.

## Target play length

Approximately 45–90 minutes for a first human playthrough.

## Chapter structure

1. **Establish problem** — Merchant District destabilizes; player enters/re-engages relevant NPCs.
2. **Social investigation** — Relationship history and NPC knowledge expose different information/access.
3. **Capability opportunity** — an existing learned Trait changes one investigation, travel, Quest, or tactical option.
4. **Travel** — player intentionally moves among relevant locations.
5. **Combat** — at least one bounded encounter; no requirement for a new full combat architecture.
6. **Shared social decision** — one decision means different things to Silas/Valerius/Gronk using existing Relationship semantics.
7. **Long-horizon callback** — earlier Relationship evidence materially affects later access/interpretation.
8. **World consequence** — resolution changes objective Merchant District state.
9. **Knowledge propagation** — not everyone immediately knows what happened or why.
10. **Faction consequence** — institutional standing changes independently from personal Relationships.
11. **Automation** — routine follow-up becomes Copy-automatable.
12. **Offline return** — routine progress advances while meaningful unresolved decisions remain player-owned.
13. **Conclusion** — relationships, knowledge, factions, world state, capabilities, and future opportunities all reflect the path taken.

## Content budget

Target approximately:

```text
3 principal NPCs
1–2 secondary NPCs
4–6 quests
1–2 Trait-sensitive problems
1 combat encounter
3–5 meaningful locations
1 multi-NPC decision
1 long-horizon callback
1 Copy automation opportunity
1 offline-return beat
2 factions
1 bounded world-state cluster
multiple NPC knowledge states
1 coherent chapter ending
```

Avoid uncontrolled expansion.

## Engine-change rule

If M25 suddenly requires a large new generic subsystem, stop and isolate that as a prerequisite qualification rather than hiding it inside the vertical slice.

## Automated qualification

Exercise at least two strategically distinct routes through:

```text
new game / chapter start
-> travel
-> Relationship events
-> Trait use
-> combat
-> shared decision
-> knowledge/faction/world effects
-> Copy task
-> save/load
-> offline settlement
-> chapter conclusion
```

Accumulated M4–M24 qualification remains mandatory.

## Human playability review

Automated tests cannot qualify the remaining product questions. A human review should explicitly evaluate:

- comprehension of why capabilities/options exist;
- whether Trait options are genuine alternatives rather than golden answers;
- whether Relationship causality feels earned;
- whether combat reflects character transformation rather than colored mechanics;
- whether geography creates meaningful decisions;
- whether automation is empowering rather than disengaging;
- whether offline progress rewards return without making active play pointless;
- whether Relationship, Knowledge, Faction, and World State feel like distinct authorities;
- pacing and information load.

## Evidence ceiling

A strong M25 PASS may support:

> One bounded chapter demonstrates the intended integrated product loop: consequential Relationships can produce learned capability, learned capability can alter active gameplay, gameplay can change objective and social conditions, routine work can be delegated and advanced offline, and resulting state remains narratively causal across persistence.

It still would not prove complete campaign scalability, final balance, final combat/economy, commercial viability, player retention, or whole-game narrative quality.

---

# 4. Desired architectural end-state

By M25 the major authorities should remain distinguishable:

```text
WORLD
Where are things?
What objectively happened?
What objective conditions exist?

KNOWLEDGE
Who knows which world facts?

RELATIONSHIP
What does shared history mean between specific people?

TRAIT
What capability has the protagonist actually internalized?

PLAYER
What capabilities/loadout does the protagonist possess?

GAMEPLAY
What can the player attempt here?

QUEST / STORY
What problem is being pursued and what occurred as consequence?

FACTION
How does an institution regard the protagonist?

COPY
What routine work can be delegated?

OFFLINE
Which explicitly safe routine processes may advance while absent?
```

These domains should communicate through explicit contracts/events rather than gradually absorbing one another's authority.

---

# 5. Target integrated game loop

By a successful M25, the following should be demonstrable in one chapter:

```text
Discover person / problem
-> interact meaningfully
-> Relationship Experience
-> Memory / Bond / Connection
-> Essence + learning conditions
-> internalize Trait
-> travel somewhere because a problem exists
-> use learned capability
-> fight / investigate / solve differently
-> objective world changes
-> different NPCs learn different facts
-> individuals interpret events
-> factions react institutionally
-> Relationships evolve
-> new capabilities / opportunities emerge
-> routine work becomes delegatable
-> Copies automate routine work
-> offline progress advances safe work
-> player returns for the next meaningful decision
```

---

# 6. Immediate execution order

1. P17.5 — Post-M17 documentation reconciliation.
2. M18 — Narrow Exploration / Travel.
3. M19 — World-Derived Tether.
4. Checkpoint B — Active RPG Loop.
5. M20 — Production Copy Task Automation Qualification.
6. M21 — Offline Progress.
7. Checkpoint C — Incremental Integration.
8. M22 — Social Knowledge Propagation.
9. M23 — Faction Reputation.
10. M24 — Objective World State.
11. M25 — Complete Chapter Vertical Slice.
12. Human integrated playability review.

Do not freeze M26+ until M25 supplies integrated product evidence.

---

## 7. Governing roadmap rule

Before implementing any capability this roadmap calls "missing," verify whether the repository already contains part or all of the required substrate.

This rule has already prevented duplicate work in Trait assimilation and is expected to remain important for Exploration, Tether, Copy tasks, offline progression, and later social/world systems.
