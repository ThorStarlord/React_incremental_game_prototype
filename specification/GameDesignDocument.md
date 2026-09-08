# Game Design Document
## React Incremental RPG Prototype

**Status:** Living product document — current through M18  
**Canonical authority note:** Read `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority, `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine, `Technical/PostM17ProductReconciliation.md` for post-M17 product/status alignment, and `Technical/M18ExplorationTravelResult.md` / `Features/ExplorationSystem.md` for the qualified bounded travel layer. The planned execution sequence through M25 lives in `Technical/PostM17MilestoneRoadmap.md`.

---

## Executive Summary

The React Incremental RPG Prototype is an experimental incremental RPG where **relationship history becomes power, access, automation, and narrative causality**.

The game does not treat relationships as a single approval meter. Meaningful dialogue, quests, conflict, shared risk, teaching, betrayal, cooperation, and sacrifice can become durable Relationship Experiences. Landmark Experiences can form Memories; accumulated evidence shapes a Bond Profile and qualified Connection; that state can alter passive Essence generation, Trait-learning conditions, later story availability, and eventually broader world consequences.

### Core innovation

The distinctive progression promise is:

> The protagonist becomes more capable because relationships change what they understand, what they can internalize, what resources they generate, and what later situations become possible.

This replaces the older product assumption that Affinity is relationship XP and that reaching a numeric Affinity threshold automatically increases `connectionDepth`.

M16 qualified a permanent Trait learned through Relationship-mediated progression materially expanding the solution space of ordinary quest gameplay. M17 extended that proof into one bounded deterministic combat encounter: permanent `WillowsWisdom` can expose an optional tactical route while an ordinary no-Trait victory remains viable. M18 now gives those active-play slices a bounded spatial layer: the player can traverse an authored four-location graph through a player-facing travel interface, with route legality enforced below UI and existing `REACH_LOCATION` Quest consequences consuming canonical Player location changes.

---

## Game Concept

### Vision statement

Create an incremental RPG where building consequential relationships is a primary source of progression, allowing the player to learn capabilities, generate metaphysical resources, unlock new solutions, move intentionally through a consequential world, and create a network of delegated agents while the story remembers how those relationships were formed.

### Target experience

Players should feel that:

- characters remember important history;
- different relationships have genuinely different meanings;
- conflict can deepen a relationship without becoming affection;
- capabilities learned through others feel earned rather than purchased from a menu;
- learned capabilities create new ways to perceive and act rather than only larger numbers;
- where the protagonist goes is an objective gameplay fact rather than a hidden story flag;
- passive/incremental growth is downstream of the player's social and strategic history;
- one decision can help one relationship while harming another;
- routine work can eventually be delegated without automating irreversible story choices.

### Unique selling points

1. **Evidence-based Relationship progression** — Experiences, Memories, Bond dimensions, and qualified Connection rather than one universal relationship XP bar.
2. **Relationship-mediated Trait learning** — discovery, temporary attunement, assimilation, Memory evidence, and permanent Resonance for migrated Traits.
3. **Trait-driven gameplay capability** — permanent learned Traits can expose materially different gameplay solutions while baseline progression remains viable.
4. **Relationship-derived Essence** — ongoing passive power generated from meaningful relational significance rather than relationship milestones acting as loot drops.
5. **Narrative causal memory** — persisted Relationship evidence can unlock or alter later story consequences across substantial causal distance.
6. **Multi-NPC social consequence** — one shared event can be interpreted differently by several characters.
7. **Bounded authored travel** — canonical Player location can now be changed through a legal player-facing route graph and consumed by existing gameplay consequences.
8. **Copy network** — growth, loyalty, Trait sharing, roles, and future routine-task automation extend the incremental layer.
9. **Character customization** — permanent and slotted Traits support different gameplay solutions and future builds.

---

## Canonical Gameplay Loop

```text
Discover person / problem
-> participate in meaningful event
-> record Relationship Experience
-> form/alter Bond Profile and possibly Memory
-> qualify Connection and change ongoing Essence / Trait-learning conditions
-> discover / assimilate / Resonate capability
-> travel to an authored location when the problem requires it
-> use capability in gameplay
-> create story / world consequence
-> NPCs interpret the consequence
-> create new Relationship evidence
-> eventually delegate routine work through Copies
```

### Short-session loop

1. Interact with an NPC, quest, location, or active problem.
2. Choose a meaningful action, destination, or response.
3. Travel through legal authored connections when the problem is elsewhere.
4. Receive gameplay consequences and, where relationally meaningful, Relationship evidence.
5. Observe changes to Connection, Bond dimensions, Essence rate, Trait progress, quest availability, story access, location, or capability options.
6. Choose the next action, Trait loadout, destination, or investment.

### Mid-session loop

1. Deepen or complicate several Relationships.
2. Complete quests and authored resolution choices.
3. Move between bounded authored locations as objectives require.
4. Accumulate passive Essence.
5. Discover and assimilate useful Traits.
6. Spend Essence to stabilize qualified Traits permanently.
7. Use learned capabilities to solve later problems differently.
8. Develop Copies for routine/automated work as that system matures.

### Multi-session loop

1. Build a diverse Relationship network.
2. Accumulate Memories and long-horizon callbacks.
3. Develop specialized permanent capabilities and, later, coherent Trait combinations.
4. Build an increasingly capable Copy network.
5. Expand the bounded active-play slices into richer travel, broader combat, factions, and durable world consequences.
6. Revisit old choices when later story situations consume historical evidence.

---

## Core Mechanics

### Relationship System

The canonical Relationship model is defined in `Features/RelationshipExperienceSystem.md`.

#### Relationship Experience

A persistent record of an event that changed how participants understand, value, trust, rely on, oppose, or otherwise relate to one another.

#### Memory

A landmark Experience that remains durable evidence of how the relationship became what it is.

#### Bond Profile

The interpreted current relationship state. Universal dimensions include:

- Affinity;
- Trust;
- Understanding;
- Shared Meaning;
- Reliance;
- Vulnerability;
- Reciprocity.

Custom dimensions may exist when genuinely necessary, but should not replace the universal model.

#### Affinity

Affinity is current positive or negative disposition. It can still affect service access, pricing, dialogue tone, and short-term reactions.

**Affinity is not Connection XP.**

A hostile or rival relationship may have low Affinity while still having high Connection, Understanding, Shared Meaning, or metaphysical significance.

#### Connection

Connection represents evidence-qualified relational significance. Progress toward the next Connection level requires authored relationship evidence and semantic qualification, not merely accumulation of positive points.

Registered Relationship-authority NPCs currently include Elder Willow, Lyra, Elara, Gronk, Silas, and Valerius.

Legacy `connectionDepth` fields remain compatibility surfaces for unmigrated systems and saves; they are not the product rule for new Relationship-authority content.

### Essence System

Essence is the primary metaphysical resource used for advanced progression and permanent Trait Resonance.

Relationship events normally change **future generation conditions**, not the current balance directly.

For Relationship-authority sources with Essence enabled:

```text
NPC Essence Rate
= Connection Base Rate
x Resonance Quality
x Tether
x Stability
```

Total passive generation combines:

```text
Global base rate
+ Relationship-derived NPC contributions
+ qualifying Copy contributions
+ other explicitly justified sources
```

World-derived Tether and campaign-wide economy balancing remain future work.

### Trait System

Traits are internalized capabilities or patterns: durable changes in what the protagonist can perceive, understand, attempt, perform, or passively sustain.

The migrated relationship-mediated lifecycle is:

```text
Discover
-> temporarily Equip / Attune
-> accumulate assimilation + compatibility evidence
-> form required Memory evidence
-> meet qualified Connection requirement
-> spend Essence
-> Resonate permanently
```

Willow's Wisdom and Scholarly Insight exercise this model in production qualification.

M16 qualified permanent Trait ownership as a gameplay capability boundary through a bounded generic quest-resolution gate. M17 independently consumed the same permanent-Trait authority in Combat, justifying a shared pure permanent-Trait requirement predicate while preserving the same ownership chain:

```text
Relationship -> qualifies learning
Trait        -> owns durable capability
Gameplay     -> determines local applicability
Player       -> chooses whether to use it
Relationship -> interprets the result when relationally meaningful
```

A Trait should usually expand meaningful solution space rather than become an automatic best answer. Capability availability must not automatically make irreversible player decisions.

Passive modifiers remain valid, but important Relationship-derived Traits should ideally have a coherent capability identity beyond an interchangeable percentage bonus.

Temporary/equipped Trait gameplay authority beyond existing effects remains deliberately unqualified.

See `Technical/PostM16TraitGameplayReconciliation.md` and `Technical/M17NarrowCombatVerticalSliceResult.md`.

### Quest and Narrative System

Quests own objectives, lifecycle, rewards, authored resolution choices, and local applicability requirements such as M16's permanent-Trait gate.

Relationship state owns the relational meaning of those events.

The bridge is intentionally generic:

```text
Story event
-> Relationship Experience / Memory
-> persisted Relationship evidence
-> later dialogue / quest availability or consequence
```

M13 qualified this causal loop. M14 qualified a shared decision producing distinct consequences across multiple NPC Relationships. M15 qualified old and newer Relationship evidence composing across intervening content and save/load. M16 qualified a learned permanent Trait changing a later gameplay solution and producing different Relationship evidence. M18 demonstrates that ordinary `REACH_LOCATION` objectives can also consume player-facing travel through the existing `setLocation` event/listener path rather than a new Quest bridge.

### Copy System

Copies are delegated entities with growth, loyalty, roles, Trait inheritance/sharing, and passive Essence interactions.

Current implementation is substantial but incomplete. Copy relationship prerequisites and some parent-NPC calculations still contain legacy compatibility assumptions and must be migrated deliberately rather than treated as new canon.

The intended future Copy role is **routine automation**: gathering, scouting, crafting support, patrols, research, and other repeatable work.

Copies should not silently make irreversible narrative decisions for the player.

### Combat

Combat includes a **bounded qualified vertical slice**, not merely the original event-bus scaffold.

M17 qualified one deterministic player-facing `Telluric Echo Fragment` encounter with:

- ordinary `Strike` and `Guard` actions;
- victory and defeat terminal states;
- an optional `WillowsWisdom` tactical sequence (`Trace the Cycle` -> `Disrupt the Feedback`);
- a viable no-Trait control route;
- runtime rejection of missing-Trait, wrong-phase, and post-terminal bypass attempts before mutation;
- ordinary `targetKilled` integration with an existing Quest `KILL` objective;
- transient Combat-owned encounter state rather than a new persistent Combat reducer/save schema.

This does **not** make Combat a complete encounter system. Persistent/mid-combat state, broad Player combat-stat authority, equipment integration, status effects, multi-enemy/party combat, generalized abilities, campaign-scale balance/progression, and human fun/pacing remain unqualified.

See `Features/CombatSystem_MVP.md` and `Technical/M17NarrowCombatVerticalSliceResult.md`.

### Exploration and World

M18 qualifies one bounded player-facing Exploration / Travel vertical slice.

Current authority is deliberately split:

```text
Exploration
-> authored location definitions and direct adjacency

Player
-> canonical live player location

Quest / Story
-> consequences of location facts
```

The qualified graph contains four locations:

```text
Merchant District
      |
  City Center
      |
   City Gate
      |
Whispering Woods
```

`travelToLocationThunk` is the player-facing route authority. It resolves the current/destination locations, validates one authored direct edge, rejects an illegal jump before mutation, and only then dispatches the existing `Player.setLocation` event. `TravelPanel` renders only legal direct destinations, but the runtime thunk independently enforces route legality below UI.

Fresh Player state now uses canonical `location_city_center`. The historical `"City Center"` Player value is supported through a narrow compatibility alias and canonicalizes on the next legal travel. M18 does not migrate Copy/NPC location strings.

M18 adds no Exploration reducer, no second `currentLocation`, no new Travel-to-Quest bridge, and no save-schema version. Existing save/load already persists `Player.location`; the qualification demonstrates saving at City Gate and continuing legally to Whispering Woods after load. Existing `REACH_LOCATION` listener behavior consumes the final `setLocation` event.

M18 does **not** qualify open-world navigation, coordinates, pathfinding beyond direct adjacency, travel duration, random encounters, NPC schedules, Copy travel, offline travel, or world-derived Tether.

See `Features/ExplorationSystem.md` and `Technical/M18ExplorationTravelResult.md`.

---

## Narrative Direction

Canonical narrative reference lives in `Narrative/`:

- `Narrative/Synopsis.md` — macro plot and act structure;
- `Narrative/Characters.md` — character bios, arcs, and hooks;
- `Narrative/WorldLore.md` — factions, cosmology, relics, systemic setting.

### Core themes

- instrumental connection vs. reciprocal transformation;
- power vs. surrender;
- control, vulnerability, and consequence;
- understanding without necessarily agreeing;
- relationships as persistent causes rather than disposable dialogue rewards;
- learning from people as durable character transformation, even when relationships later change.

The Relationship model must support mentorship, alliance, rivalry, ideological opposition, mutual leverage, institutional trust, and other archetypes without requiring a new engine per NPC.

---

## Current Product Maturity After M18

### Strong / empirically qualified

- Relationship Experiences and Memories;
- Bond dimensions and evidence-qualified Connection;
- multiple distinct production Relationship archetypes;
- adversarial Connection with low/negative Affinity;
- Relationship-derived Essence for registered bundles;
- authored Trait discovery, assimilation, and permanent Resonance for Willow/Elara;
- save/load persistence and migration;
- Relationship evidence causing later story consequences;
- one shared story event producing conflicting consequences for multiple NPCs;
- long-horizon Relationship callbacks composing old and newer evidence across save/load;
- permanent Relationship-derived Traits changing bounded quest solution space;
- UI + authoritative thunk enforcement of permanent-Trait quest requirements;
- one bounded deterministic Combat encounter with a viable no-Trait route and an optional permanent-Trait tactical route;
- Combat victory feeding an existing Quest `KILL` objective through the ordinary event bridge;
- shared permanent-Trait capability-requirement semantics reused by Quest and Combat without a generalized ability DSL;
- one bounded four-location authored travel graph with player-facing legal movement;
- runtime rejection of illegal direct travel before Player or Quest mutation;
- save/load continuation of canonical Player location;
- player-facing travel feeding an existing Quest `REACH_LOCATION` consequence through the ordinary `setLocation` listener.

### Functional foundation but incomplete product loop

- Quest system beyond bounded authored slices;
- Trait catalogue/loadout beyond migrated examples;
- Essence economy/presentation;
- Combat beyond the bounded M17 encounter;
- Exploration beyond the bounded M18 direct-adjacency graph;
- Copy management and production task/deployment depth;
- inventory/equipment integration;
- relationship-facing UI polish.

### Major future product gaps

- world-derived Tether from objective presence;
- richer exploration only where evidence warrants it, including possible travel time / NPC presence semantics;
- broader combat architecture only where later evidence warrants it;
- production Copy task automation;
- offline progress;
- NPC knowledge propagation;
- distinct faction reputation;
- reusable objective world-state consequences;
- temporary/equipped Trait gameplay semantics if later warranted;
- one complete chapter-level vertical slice and human playability review.

---

## Near-Term Roadmap

The planned post-M17 execution program is defined in `Technical/PostM17MilestoneRoadmap.md`. Individual milestone semantics remain provisional until each milestone is preregistered against the actual then-current repository state.

### Immediate next code-bearing candidate — M19

**World-Derived Relationship Tether**

The next planned question is whether objective world presence established by M18 can alter current Relationship-derived Essence intensity through Tether without rewriting Connection, Memories, or Bond dimensions.

M19 must be separately preregistered from the actual post-M18 baseline before behavior changes. M18 itself does not derive Tether.

### Planned subsequent sequence

1. M19 — world-derived Tether;
2. Checkpoint B — active RPG loop;
3. M20 — Copy task automation qualification;
4. M21 — offline progress;
5. Checkpoint C — incremental integration;
6. M22 — social knowledge propagation;
7. M23 — faction reputation;
8. M24 — objective world-state consequences;
9. M25 — complete chapter vertical slice;
10. human integrated playability review.

Do not treat the numbering alone as authority to implement the next milestone if the previous checkpoint exposes a prerequisite defect or product weakness.

---

## Success Criteria

The project succeeds as a game when players can understand and feel this causal chain:

```text
I formed a consequential relationship
-> I learned something real from that character
-> it became part of my build
-> I traveled to where a consequential problem existed
-> I used the capability to solve the problem differently
-> the world and other characters reacted
-> that reaction changed my future progression
```

Technical correctness remains necessary, but later vertical slices must also test player comprehension, pacing, whether Trait-enabled choices remain genuine choices, whether spatial decisions are meaningful, and whether incremental automation reinforces rather than distracts from the narrative RPG.

---

## Canonical References

1. `Technical/PostM14ProductReconciliation.md` — broad domain/migration authority
2. `Technical/PostM16TraitGameplayReconciliation.md` — Trait-to-gameplay doctrine after M16
3. `Technical/PostM17ProductReconciliation.md` — product/status reconciliation after M17
4. `Technical/PostM17MilestoneRoadmap.md` — planned execution program from M18 through M25
5. `Technical/M18ExplorationTravelResult.md` — M18 empirical travel result and evidence ceiling
6. `Features/RelationshipExperienceSystem.md`
7. `Features/EssenceResonanceModel.md`
8. `Features/TraitSystem.md`
9. `Features/QuestSystem.md`
10. `Features/CombatSystem_MVP.md`
11. `Features/ExplorationSystem.md`
12. milestone-specific qualification documents under `Technical/`

When older documentation conflicts with this authority chain, treat the conflict as migration/documentation debt rather than reviving the legacy model.
