# Functional Requirements

This document lists the functional requirements for the React Incremental RPG Prototype, describing *what* the system should do.

## FR-CORE: Core Gameplay Loop

*   **FR-CORE-001:** The system shall allow the player to establish "Emotional Connections" with target NPCs through interaction.
*   **FR-CORE-002:** The system shall passively generate "Essence" based on the number and depth of active Emotional Connections.
*   **FR-CORE-003:** The system shall allow the player to spend Essence on core progression mechanics (Trait Acquisition, Trait Permanence, Accelerated Copy Growth).
*   **FR-CORE-004:** The system shall allow the player character to progress through levels by gaining experience points (XP).
*   **FR-CORE-005:** The system shall provide mechanisms for saving and loading game progress.

## FR-PLAYER: Player Character

*   **FR-PLAYER-001:** The system shall represent the player character with defined stats (e.g., Health, Mana, Attack, Defense).
*   **FR-PLAYER-002:** The system shall represent the player character with defined attributes (e.g., Strength, Dexterity, Intelligence) that influence stats.
*   **FR-PLAYER-003:** The system shall allow the player to allocate attribute points gained through leveling or other means.
*   **FR-PLAYER-004:** The system shall allow the player to equip items into defined equipment slots (Head, Chest, MainHand, etc.).
*   **FR-PLAYER-005:** The system shall calculate final player stats based on base stats, attribute contributions, and bonuses from equipped items and active traits.
*   **FR-PLAYER-006:** The system shall track player playtime.

## FR-TRAIT: Trait System

*   **FR-TRAIT-001:** The system shall define a collection of traits with unique effects, categories, rarities, and potential requirements.
*   **FR-TRAIT-002:** The system shall allow the player to acquire traits from target NPCs by spending Essence (Resonance mechanic).
*   **FR-TRAIT-003:** The system shall track the player's acquired traits.
*   **FR-TRAIT-004:** The system shall provide the player with a limited number of slots to equip acquired traits.
*   **FR-TRAIT-005:** The system shall apply the effects of equipped traits to the player character.
*   **FR-TRAIT-006:** The system shall allow the player to spend a significant amount of Essence to make an acquired trait permanent, freeing up an equip slot while keeping the trait's effects active.
*   **FR-TRAIT-007:** The system shall track the player's permanent traits.
*   **FR-TRAIT-008:** The system shall allow the player to grant "Shared Trait Slots" to target NPCs and Copies based on connection/loyalty levels.
*   **FR-TRAIT-009:** The system shall allow the player to place their acquired/permanent traits into a target's Shared Trait Slot.
*   **FR-TRAIT-010:** The system shall apply the effects of shared traits to the target NPC or Copy.
*   **FR-TRAIT-011:** The system shall provide a UI for viewing trait definitions (Codex).
*   **FR-TRAIT-012:** The system shall provide a UI for managing player equipped traits and slots.

## FR-ESSENCE: Essence System

*   **FR-ESSENCE-001:** The system shall track the player's current Essence amount and total Essence collected.
*   **FR-ESSENCE-002:** The system shall provide actions/reducers to gain and spend Essence.
*   **FR-ESSENCE-003:** The system shall calculate passive Essence generation based on active NPC connections.
*   **FR-ESSENCE-004:** The system shall allow manual Essence generation via a UI button (for testing/prototyping).

## FR-COPY: Copy System

*   **FR-COPY-001:** The system shall allow the player to create a Copy as an outcome of a successful "Seduction" interaction with an NPC.
*   **FR-COPY-002:** The system shall allow the player to choose between "Normal Growth" (time-based) and "Accelerated Growth" (Essence-cost based) for a new Copy.
*   **FR-COPY-003:** The system shall track the state of each Copy, including stats, loyalty, assigned task, growth status, and inherited/shared traits.
*   **FR-COPY-004:** Copies shall inherit traits shared with their parent target at the moment of creation.
*   **FR-COPY-005:** The system shall allow the player to manage Copies through a dedicated UI.
*   **FR-COPY-006:** The system shall allow the player to assign tasks to mature Copies.
*   **FR-COPY-007:** The system shall model Copy loyalty, influenced by shared traits and task outcomes.
*   **FR-COPY-008:** The system shall limit the number of active Copies the player can maintain.

## FR-NPC: Non-Player Characters

*   **FR-NPC-001:** The system shall represent NPCs with basic state (location, name).
*   **FR-NPC-002:** The system shall track the player's relationship value and connection depth with individual NPCs.
*   **FR-NPC-003:** NPC relationship/connection shall influence interactions (dialogue, quest availability, trait acquisition cost).
*   **FR-NPC-004:** NPCs shall possess traits that the player can potentially acquire.

## FR-QUEST: Quest System

*   **FR-QUEST-001:** The system shall define quests with objectives, prerequisites, and rewards.
*   **FR-QUEST-002:** The system shall allow players to accept quests from NPCs or other sources.
*   **FR-QUEST-003:** The system shall track player progress towards quest objectives.
*   **FR-QUEST-004:** The system shall allow players to complete quests and receive rewards.
*   **FR-QUEST-005:** The system shall provide a UI (Quest Log) to view active and completed quests.

## FR-SAVE: Save/Load System

*   **FR-SAVE-001:** The system shall allow the player to manually save the current game state to a named slot.
*   **FR-SAVE-002:** The system shall automatically save the game state at configurable intervals (Autosave).
*   **FR-SAVE-003:** The system shall allow the player to load a previously saved game state (manual or autosave).
*   **FR-SAVE-004:** The system shall allow the player to delete manual save files.
*   **FR-SAVE-005:** The system shall allow the player to export a save file's state into an encoded string/file.
*   **FR-SAVE-006:** The system shall allow the player to import a game state from an encoded string/file, creating a new save slot.
*   **FR-SAVE-007:** The system shall store save game version information and handle basic compatibility checks.

## FR-UI: User Interface

*   **FR-UI-001:** The system shall present the main game interface using a responsive three-column layout (Left: Status, Middle: Interaction, Right: Logs).
*   **FR-UI-002:** The system shall provide clear visual feedback for player actions, state changes, and notifications.
*   **FR-UI-003:** The system shall provide interfaces for managing player character (stats, attributes, traits, equipment).
*   **FR-UI-004:** The system shall provide interfaces for interacting with NPCs (dialogue).
*   **FR-UI-005:** The system shall provide interfaces for managing Copies.
*   **FR-UI-006:** The system shall provide interfaces for managing quests (Quest Log).
*   **FR-UI-007:** The system shall provide interfaces for saving, loading, importing, and exporting game progress.
*   **FR-UI-008:** The system shall provide interfaces for configuring game settings.
