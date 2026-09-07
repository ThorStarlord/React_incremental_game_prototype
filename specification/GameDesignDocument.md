# Game Design Document
## React Incremental RPG Prototype

**Status:** Living product document — reconciled after M17  
**Canonical authority note:** Read `Technical/PostM14ProductReconciliation.md` for broad domain/migration authority, `Technical/PostM16TraitGameplayReconciliation.md` for Trait-to-gameplay doctrine, and `Technical/PostM17ProductReconciliation.md` for current post-M17 product/status alignment. The planned execution sequence through M25 lives in `Technical/PostM17MilestoneRoadmap.md`.

---

## Executive Summary

The React Incremental RPG Prototype is an experimental incremental RPG where **relationship history becomes power, access, automation, and narrative causality**.

The game does not treat relationships as a single approval meter. Meaningful dialogue, quests, conflict, shared risk, teaching, betrayal, cooperation, and sacrifice can become durable Relationship Experiences. Landmark Experiences can form Memories; accumulated evidence shapes a Bond Profile and qualified Connection; that state can alter passive Essence generation, Trait-learning conditions, later story availability, and eventually broader world consequences.

### Core innovation

The distinctive progression promise is:

> The protagonist becomes more capable because relationships change what they understand, what they can internalize, what resources they generate, and what later situations become possible.

This replaces the older product assumption that Affinity is relationship XP and that reaching a numeric Affinity threshold automatically increases `connectionDepth`.

M16 qualified a permanent Trait learned through Relationship-mediated progression materially expanding the solution space of ordinary quest gameplay. M17 now extends that proof into one bounded deterministic combat encounter: permanent `WillowsWisdom` can expose an optional tactical route while an ordinary no-Trait victory remains viable.

---

## Game Concept

### Vision statement

Create an incremental RPG where building consequential relationships is a primary source of progression, allowing the player to learn capabilities, generate metaphysical resources, unlock new solutions, and create a network of delegated agents while the story remembers how those relationships were formed.

### Target experience

Players should feel that:

- characters remember important history;
- different relationships have genuinely different meanings;
- conflict can deepen a relationship without becoming affection;
- capabilities learned through others feel earned rather than purchased from a menu;
- learned capabilities create new ways to perceive and act rather than only larger numbers;
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
7. **Copy network** — growth, loyalty, Trait sharing, roles, and future routine-task automation extend the incremental layer.
8. **Character customization** — permanent and slotted Traits support different gameplay solutions and future builds.

---

## Canonical Gameplay Loop

```text
Discover person / problem
-> participate in meaningful event
-> record Relationship Experience
-> form/alter Bond Profile and possibly Memory
-> qualify Connection and change ongoing Essence / Trait-learning conditions
-> discover / assimilate / Resonate capability
-> use capability in gameplay
-> create story / world consequence
-> NPCs interpret the consequence
-> create new Relationship evidence
-> eventually delegate routine work through Copies
```

### Short-session loop

1. Interact with an NPC, quest, location, or active problem.
2. Make a meaningful decision or perform an action.
3. Receive gameplay consequences and, where relationally meaningful, Relationship evidence.
4. Observe changes to Connection, Bond dimensions, Essence rate, Trait progress, quest availability, story access, or capability options.
5. Choose the next action, Trait loadout, destination, or investment.

### Mid-session loop

1. Deepen or complicate several Relationships.
2. Complete quests and authored resolution choices.
3. Accumulate passive Essence.
4. Discover and assimilate useful Traits.
5. Spend Essence to stabilize qualified Traits permanently.
6. Use learned capabilities to solve later problems differently.
7. Develop Copies for routine/automated work as that system matures.

### Multi-session loop

1. Build a diverse Relationship network.
2. Accumulate Memories and long-horizon callbacks.
3. Develop specialized permanent capabilities and, later, coherent Trait combinations.
4. Build an increasingly capable Copy network.
5. Expand the bounded active-play slices into travel, broader combat, factions, and durable world consequences.
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

M13 qualified this causal loop. M14 qualified a shared decision producing distinct consequences across multiple NPC Relationships. M15 qualified old and newer Relationship evidence composing across intervening content and save/load. M16 qualified a learned permanent Trait changing a later gameplay solution and producing different Relationship evidence.

### Copy System

Copies are delegated entities with growth, loyalty, roles, Trait inheritance/sharing, and passive Essence interactions.

Current implementation is substantial but incomplete. Copy relationship prerequisites and some parent-NPC calculations still contain legacy compatibility assumptions and must be migrated deliberately rather than treated as new canon.

The intended future Copy role is **routine automation**: gathering, scouting, crafting support, patrols, research, and other repeatable work.

Copies should not silently make irreversible narrative decisions for the player.

### Combat

Combat now includes a **bounded qualified vertical slice**, not merely the original event-bus scaffold.

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

The prototype has canonical player location and location-sensitive quest-event support but not yet a complete player-facing travel/world layer.

The next code-bearing milestone is planned as M18, a bounded exploration/travel qualification focused on a small authored location graph, authoritative route validation, player-facing movement, persistence, and reuse of existing `REACH_LOCATION` Quest handling.

Future exploration may later make travel time, resource acquisition, encounters, NPC presence, and Tether mechanically meaningful, but M18 should not assume all of those semantics before evidence warrants them.

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

## Current Product Maturity After M17

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
- shared permanent-Trait capability-requirement semantics reused by Quest and Combat without a generalized ability DSL.

### Functional foundation but incomplete product loop

- Quest system beyond bounded authored slices;
- Trait catalogue/loadout beyond migrated examples;
- Essence economy/presentation;
- Combat beyond the bounded M17 encounter;
- Copy management and production task/deployment depth;
- inventory/equipment integration;
- relationship-facing UI polish.

### Major future product gaps

- player-facing exploration/travel;
- world-derived Tether;
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

### Immediate next code-bearing candidate — M18

**Narrow Exploration / Travel Vertical Slice**

Planned question:

> Can the player intentionally traverse a small authored world graph through a player-facing travel interface, with canonical player location producing ordinary gameplay consequences, without duplicate location flags or a generalized world simulation?

### Planned subsequent sequence

1. M18 — exploration/travel;
2. M19 — world-derived Tether;
3. Checkpoint B — active RPG loop;
4. M20 — Copy task automation qualification;
5. M21 — offline progress;
6. Checkpoint C — incremental integration;
7. M22 — social knowledge propagation;
8. M23 — faction reputation;
9. M24 — objective world-state consequences;
10. M25 — complete chapter vertical slice;
11. human integrated playability review.

Do not treat the numbering alone as authority to implement the next milestone if the previous checkpoint exposes a prerequisite defect or product weakness.

---

## Success Criteria

The project succeeds as a game when players can understand and feel this causal chain:

```text
I formed a consequential relationship
-> I learned something real from that character
-> it became part of my build
-> I used it to solve a problem differently
-> the world and other characters reacted
-> that reaction changed my future progression
```

Technical correctness remains necessary, but later vertical slices must also test player comprehension, pacing, whether Trait-enabled choices remain genuine choices, and whether incremental automation reinforces rather than distracts from the narrative RPG.

---

## Canonical References

1. `Technical/PostM14ProductReconciliation.md` — broad domain/migration authority
2. `Technical/PostM16TraitGameplayReconciliation.md` — Trait-to-gameplay doctrine after M16
3. `Technical/PostM17ProductReconciliation.md` — product/status reconciliation after M17
4. `Technical/PostM17MilestoneRoadmap.md` — planned execution program from M18 through M25
5. `Features/RelationshipExperienceSystem.md`
6. `Features/EssenceResonanceModel.md`
7. `Features/TraitSystem.md`
8. `Features/QuestSystem.md`
9. `Features/CombatSystem_MVP.md`
10. milestone-specific qualification documents under `Technical/`

When older documentation conflicts with this authority chain, treat the conflict as migration/documentation debt rather than reviving the legacy model.
