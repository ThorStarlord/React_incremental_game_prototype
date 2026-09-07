# Game Design Document
## React Incremental RPG Prototype

**Status:** Living product document — reconciled after M14  
**Canonical authority note:** Read `Technical/PostM14ProductReconciliation.md` before extending legacy relationship mechanics.

---

## Executive Summary

The React Incremental RPG Prototype is an experimental incremental RPG where **relationship history becomes power, access, automation, and narrative causality**.

The game does not treat relationships as a single approval meter. Meaningful dialogue, quests, conflict, shared risk, teaching, betrayal, cooperation, and sacrifice can become durable Relationship Experiences. Landmark Experiences can form Memories; accumulated evidence shapes a Bond Profile and qualified Connection; that state can alter passive Essence generation, Trait-learning conditions, later story availability, and eventually broader world consequences.

### Core innovation

The distinctive progression promise is:

> The protagonist becomes more capable because relationships change what they understand, what they can internalize, what resources they generate, and what later situations become possible.

This replaces the older product assumption that Affinity is relationship XP and that reaching a numeric Affinity threshold automatically increases `connectionDepth`.

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
- passive/incremental growth is downstream of the player's social and strategic history;
- one decision can help one relationship while harming another;
- routine work can eventually be delegated without automating irreversible story choices.

### Unique selling points

1. **Evidence-based Relationship progression** — Experiences, Memories, Bond dimensions, and qualified Connection rather than one universal relationship XP bar.
2. **Relationship-mediated Trait learning** — discovery, temporary attunement, assimilation, Memory evidence, and permanent Resonance for migrated Traits.
3. **Relationship-derived Essence** — ongoing passive power generated from meaningful relational significance rather than relationship milestones acting as loot drops.
4. **Narrative causal memory** — persisted Relationship evidence can unlock or alter later story consequences.
5. **Multi-NPC social consequence** — one shared event can be interpreted differently by several characters.
6. **Copy network** — growth, loyalty, Trait sharing, roles, and future routine-task automation extend the incremental layer.
7. **Character customization** — permanent and slotted Traits support different gameplay solutions and future builds.

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
4. Observe changes to Connection, Bond dimensions, Essence rate, Trait progress, quest availability, or story access.
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
3. Develop specialized Trait combinations.
4. Build an increasingly capable Copy network.
5. Expand into travel, combat, factions, and durable world consequences.
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

Traits represent capabilities, patterns, and passive bonuses.

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

Willow's Wisdom and Scholarly Insight already exercise this model in production qualification.

Legacy/simple Traits may still use compatibility behavior until deliberately migrated.

The next major product payoff is not to reimplement assimilation; it is to make Relationship-derived Traits materially change gameplay solutions.

### Quest and Narrative System

Quests own objectives, lifecycle, rewards, and authored resolution choices.

Relationship state owns the relational meaning of those events.

The bridge is intentionally generic:

```text
Story event
-> Relationship Experience / Memory
-> persisted Relationship evidence
-> later dialogue / quest availability or consequence
```

M13 qualified this causal loop. M14 qualified a shared decision producing distinct consequences across multiple NPC Relationships.

### Copy System

Copies are delegated entities with growth, loyalty, roles, Trait inheritance/sharing, and passive Essence interactions.

Current implementation is substantial but incomplete. Copy relationship prerequisites and some parent-NPC calculations still contain legacy compatibility assumptions and must be migrated deliberately rather than treated as new canon.

The intended future Copy role is **routine automation**: gathering, scouting, crafting support, patrols, research, and other repeatable work.

Copies should not silently make irreversible narrative decisions for the player.

### Combat

Combat currently has a lightweight event-bus scaffold, not a complete encounter game.

Future combat should be introduced as a narrow vertical slice whose primary product question is whether Relationship-derived Traits create meaningful tactical differences.

### Exploration and World

The prototype has location and quest-event support but not yet a complete travel/world layer.

Future exploration should make location, travel time, resource acquisition, encounters, NPC presence, and Tether mechanically meaningful without turning the Relationship system into world-state storage.

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
- relationships as persistent causes rather than disposable dialogue rewards.

The Relationship model must support mentorship, alliance, rivalry, ideological opposition, mutual leverage, institutional trust, and other archetypes without requiring a new engine per NPC.

---

## Current Product Maturity After M14

### Strong / empirically qualified

- Relationship Experiences and Memories;
- Bond dimensions and evidence-qualified Connection;
- multiple distinct production Relationship archetypes;
- adversarial Connection with low/negative Affinity;
- Relationship-derived Essence for registered bundles;
- authored Trait discovery and assimilation for Willow/Elara;
- save/load persistence and migration;
- Relationship evidence causing later story consequences;
- one shared story event producing conflicting consequences for multiple NPCs.

### Functional foundation but incomplete product loop

- Quest system;
- Trait catalogue/loadout beyond migrated examples;
- Essence economy/presentation;
- Copy management and task/deployment depth;
- inventory/equipment integration;
- relationship-facing UI polish.

### Major future product gaps

- long-horizon callbacks across substantial intervening content;
- Trait-driven gameplay payoff;
- real combat encounter loop;
- player-facing exploration/travel;
- world-derived Tether;
- production Copy task automation;
- offline progress;
- NPC knowledge propagation;
- distinct faction reputation;
- reusable world-state consequences;
- one complete chapter-level vertical slice and human playability review.

---

## Near-Term Roadmap

### Immediate next milestone — M15

**Long-Horizon Relationship Callback Qualification**

Test whether old Relationship evidence remains causally relevant after unrelated intervening content, additional Relationship changes, and save/load.

### After M15

Move directly toward **Trait-driven gameplay**. The repository already implements relationship-mediated Trait assimilation for Willow and Elara, so a future milestone should prove that such a learned capability materially changes how a real gameplay problem is solved rather than rebuilding assimilation as if it were absent.

Subsequent candidate areas:

1. Trait-driven gameplay;
2. narrow combat vertical slice;
3. exploration/travel;
4. world-derived Tether;
5. Copy task automation;
6. offline progress;
7. social knowledge propagation;
8. faction reputation;
9. world-state consequences;
10. first complete chapter vertical slice.

Milestone numbering after M15 should be frozen during preregistration based on repository evidence at that time.

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

Technical correctness remains necessary, but later vertical slices must also test player comprehension, pacing, and whether incremental automation reinforces rather than distracts from the narrative RPG.

---

## Canonical References

1. `Technical/PostM14ProductReconciliation.md`
2. `Features/RelationshipExperienceSystem.md`
3. `Features/EssenceResonanceModel.md`
4. `Features/TraitSystem.md`
5. `Features/QuestSystem.md`
6. `Features/CopySystem.md`
7. milestone-specific qualification documents under `Technical/`

When older documentation conflicts with this authority chain, treat the conflict as migration/documentation debt rather than reviving the legacy model.