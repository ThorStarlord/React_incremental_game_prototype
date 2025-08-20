Implementation Status: 📋 MVP EVENT BUS ONLY (no turn system yet)

# Combat System MVP Specification

This document defines the minimal combat scaffolding for the prototype: event signaling to support quest objectives and future expansion.

## 1. Overview
- Purpose: Provide a lightweight, UI-agnostic event channel for combat-related outcomes (e.g., kill confirmations) to drive quest progression and notifications.
- Core Loop: Simulated/triggered combat outcome → Emit event → Quest listener updates objective → Optional notification.

## 2. Data & Slice
- Slice key: `combat` (singular)
- Events (action creators):
	- targetKilled({ npcId | enemyType, count=1 })
	- damageDealt({ amount, source, targetId }) — optional for analytics/future balancing
	- damageTaken({ amount, sourceId }) — optional
- State: Minimal or empty (event log optional for debug-only devtools view).

## 3. Integration
- Quests: `processQuestTimersThunk` and/or dedicated quest listeners consume `targetKilled` to advance kill objectives.
- Notifications: Success toast for objective increments when appropriate.
- Player/NPC Stats: Not required for MVP; later versions read from Player/NPC slices.

## 4. UI (Deferred)
- No combat UI in MVP. Future: encounter view, action bar, damage floaters, logs.

## 5. Performance & Safety
- Events are lightweight and idempotent; debounced if emitted rapidly by sim.
- Development-only event log capped to prevent memory growth.

## 6. Roadmap (Deferred)
- Turn/real-time encounter model selection; initiative/speed tie-in.
- Abilities/skills system and resource costs.
- Enemy/NPC stat blocks and AI behaviors.
- Damage formulas, mitigation, crits, and trait/essence interactions.
- Encounter generation, rewards, and loot tables.
