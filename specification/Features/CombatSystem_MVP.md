# Combat System MVP Specification

**Implementation Status:** 📋 MVP EVENT BUS ONLY — no encounter/turn system yet  
**Future Trait doctrine:** See `../Technical/PostM16TraitGameplayReconciliation.md` before adding Trait-aware combat.

This document defines the minimal combat scaffolding for the prototype: event signaling to support quest objectives and future expansion.

## 1. Overview

- **Purpose:** Provide a lightweight, UI-agnostic event channel for combat-related outcomes (for example kill confirmations) to drive quest progression and notifications.
- **Current core loop:** Simulated/triggered combat outcome -> emit event -> Quest listener updates objective -> optional notification.
- **Current evidence ceiling:** This is infrastructure scaffolding, not a qualified encounter game.

## 2. Data & Slice

- Slice key: `combat` (singular)
- Events (action creators):
  - `targetKilled({ npcId | enemyType, count=1 })`
  - `damageDealt({ amount, source, targetId })` — optional for analytics/future balancing
  - `damageTaken({ amount, sourceId })` — optional
- State: minimal or empty; an event log may exist for debug-only devtools use.

## 3. Integration

- Quests consume combat events such as `targetKilled` through the existing quest-listener path to advance kill objectives.
- Notifications may report objective increments when appropriate.
- Player/NPC combat stat models are not required by the current MVP event bus.

## 4. UI — deferred

There is no production combat UI in the current MVP.

Future encounter work may add an encounter view, actions, feedback/logs, and deterministic tactical state only when a dedicated milestone qualifies them.

## 5. Performance & safety

- Events should remain lightweight.
- Any development-only event log should be bounded to prevent unbounded memory growth.
- Combat outcome events consumed by other domains must not silently become Relationship history; a Relationship Experience requires explicit authored relational meaning.

## 6. Post-M16 combat doctrine

The next candidate code-bearing combat milestone should ask:

> Can an existing Relationship-derived permanent Trait create a meaningful tactical option in one bounded combat encounter without becoming an automatic best action, pure passive stat bonus, or prerequisite for victory?

Future combat should preserve these Checkpoint A constraints:

1. use an existing Relationship-derived permanent Trait where semantically appropriate;
2. give the Trait a tactical expression beyond a flat numerical bonus;
3. retain a viable control strategy without the Trait;
4. require the player to decide when/how to use the available capability;
5. avoid making the Trait route universally dominant;
6. use Trait ownership as capability authority rather than querying source Relationship state as a substitute;
7. emit ordinary combat/gameplay results that Quest, Story, or explicitly authored Relationship bridges may consume;
8. avoid a generalized ability/condition DSL unless repeated independent production cases justify it.

The design invariant is:

```text
Trait capability -> tactical option -> player decision -> combat consequence
```

not:

```text
Trait present -> automatic victory
```

## 7. Roadmap — deferred until preregistration

Potential future combat work includes:

- minimal encounter/turn model;
- initiative/speed semantics;
- bounded action/defense model;
- enemy stat blocks and deterministic behavior;
- Trait-sensitive tactical options;
- damage/mitigation rules only as required by the first production encounter;
- encounter results/rewards and Quest integration.

Do not assume a generalized ability/skills system, mana/cooldowns/status-effect framework, encounter generator, or broad loot system is required before the first bounded combat proof.

Milestone numbering and exact mechanics must be frozen during preregistration against the then-current repository state.
