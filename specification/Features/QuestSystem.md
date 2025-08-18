# Quest System Specification

Implementation Status: ✅ FOUNDATION IMPLEMENTED (slice + selectors + thunks + basic QuestLog UI)

Implementation Notes:
- Feature directory: `src/features/Quest/` (singular)
- Redux slice key: `quest` (singular, camelCase)

This document outlines the design for the quest system, including types, structure, progression, and rewards.

## 1. Overview

*   **Purpose:** Provide goals, narrative progression, challenges, and rewards for the player. Guide player activity and world exploration.
*   **Core Loop:** Discovery -> Acceptance -> Progress Tracking -> Completion -> Rewards.

### Current Implementation (Foundation)
- Redux slice with basic reducers for adding quests, updating objective progress, and completing quests.
- Selectors targeting `state.quest` for active quests and lookups.
- Thunks prefixed with `quest/*` for starting/turning-in quests (basic scaffolding).
- Quest Log UI component renders a simple list of active quests.

Deferred (Planned next phases):
- Full acceptance/turn-in UX flows and NPC hand-in rules (auto-complete vs. return-to-giver).
- Dynamic/repeatable generation, rewards payout integration, and notifications.
- Map markers and richer objective types.

## 2. Quest Types

*   **Main Story Quests:** Drive the central narrative. Often linear or branching chains.
*   **Side Quests:** Optional quests offering rewards, lore, or relationship changes. Found through exploration or NPC interaction.
*   **Repeatable Quests:** Simple tasks that can be completed multiple times for smaller rewards (e.g., resource gathering, bounty hunting).
*   **Dynamic/Radiant Quests:** (Future) Procedurally generated quests based on game state (e.g., defend location, retrieve item from random dungeon).
*   **Tutorial Quests:** Guide new players through core mechanics.

## 3. Quest Structure

*   **Quest Object:** Data structure containing:
    *   `id`: Unique identifier.
    *   `title`: Display name.
    *   `description`: Narrative text explaining the quest.
    *   `giver`: NPC or source ID.
    *   `type`: (Main, Side, Repeatable, etc.).
    *   `objectives`: Array of tasks to complete.
        *   `objectiveId`: Unique ID within the quest.
        *   `description`: Text describing the task (e.g., "Collect 10 Wood", "Defeat Bandit Leader", "Talk to Merchant").
        *   `type`: (Gather, Kill, Talk, ReachLocation, UseItem, etc.).
        *   `target`: ID or type of target (e.g., 'wood', 'bandit_leader_01', 'npc_merchant').
        *   `requiredCount`: Number needed for gather/kill objectives.
        *   `currentCount`: Player's progress.
        *   `isHidden`: (Optional) Objective not revealed initially.
    *   `prerequisites`: Conditions to start the quest (e.g., level, previous quest, relationship).
    *   `rewards`: Items, XP, Gold, Essence, Reputation changes, Traits granted.
    *   `status`: (NotStarted, Accepted, InProgress, ReadyToComplete, Completed, Failed).
    *   `isAutoComplete`: Does the quest complete automatically when objectives are met, or require returning to the giver?

## 4. Quest Progression & Tracking

*   **Discovery:** How players find quests (NPC dialogue, item interaction, entering areas).
*   **Acceptance:** Player choice to accept or decline.
*   **Tracking:**
    *   Quest Log UI: Displays active quests, objectives, descriptions, rewards.
    *   Map Markers: (Optional) Indicate quest locations or objectives.
    *   Objective Updates: Game systems notify the Quest System when progress is made (e.g., item gathered, enemy killed).
*   **Completion:** Turning in the quest to the giver or automatic completion.
*   **Failure Conditions:** Time limits (rare), essential NPC death, specific player actions.

Implementation (current): Foundation supports adding/tracking/completing quests and rendering in a basic Quest Log.

## 5. Rewards

*   **Experience Points (XP):** For player leveling.
*   **Currency (Gold):** Standard monetary reward.
*   **Essence:** Core metaphysical resource.
*   **Items:** Equipment, consumables, crafting materials.
*   **Reputation:** Changes with NPCs or factions.
*   **Traits:** Specific traits granted upon completion.
*   **Unlocked Content:** New areas, features, dialogue, or quests.

## 6. UI/UX Considerations

*   Quest Log interface (filterable, sortable).
*   Clear indication of new/available quests (e.g., NPC markers).
*   Notifications for quest acceptance, progress updates, completion.
*   Dialogue interface for quest interactions.
*   Map integration for quest locations.

## 7. Integration with Other Systems

*   **NPC System:** Quest givers, dialogue, relationship prerequisites/rewards.
*   **Combat System:** Kill objectives.
*   **Inventory/Item System:** Gather objectives, item rewards.
*   **Trait System:** Trait rewards, trait prerequisites.
*   **Essence System:** Essence rewards.
*   **Player System:** Level prerequisites.

## 8. Balancing Notes

*   Reward scaling based on quest difficulty and type.
*   Pacing of main story quests vs. side content availability.
*   Clarity of objectives and descriptions.
*   Avoid overly grindy repeatable quests unless intended for specific resource loops.
