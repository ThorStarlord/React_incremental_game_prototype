# Project Specifications

This folder contains comprehensive documentation for the React Incremental RPG Prototype, organized by functional areas and implementation details.

## Core Systems Implemented ✅

### GameLoop System
- **Location**: `features/GameLoopSystem.md`
- **Status**: ✅ Complete
- **Description**: Foundational timing system providing consistent game progression, speed control, and auto-save functionality

## Folder Structure

The `specification` folder is organized as follows:

*   **/design**: Contains documents related to game design, user experience (UX), user interface (UI) mockups, narrative elements, and overall game feel.
    *   `game_mechanics.md`: Core gameplay loops, progression systems, resource management, etc.
    *   `ui_ux_guidelines.md`: Principles for UI design and user interaction flows.
    *   `narrative_overview.md`: Story concepts, character backstories, world-building notes.
*   **/technical**: Holds technical architecture documents, data model definitions, API specifications (if applicable), and decisions regarding technology choices.
    *   `architecture_overview.md`: High-level system design, component interactions, state management strategy. *(New)*
    *   `data_models.md`: Definitions for key data structures (Player, Traits, Items, NPCs, Copies, etc.). *(New/Updated)*
    *   `state_management.md`: Details on Redux slice design and interactions. *(New/Updated)*
*   **/features**: Contains detailed specifications for individual game features or systems. Each major feature should ideally have its own document or subfolder.
    *   `TraitSystem.md`: Specification for the trait acquisition, equipping, and effects system. *(Updated)*
    *   `EssenceSystem.md`: Specification for the core Essence resource. *(Updated)*
    *   `PlayerSystem.md`: Specification for the player character's stats and attributes. *(Updated)*
    *   `CopySystem.md`: Specification for the player-created Copies. *(New)*
    *   `QuestSystem.md`: Specification for quests and objectives. *(New)*
    *   `SaveLoadSystem.md`: Specification for saving and loading game progress. *(New)*
    *   `npc_interaction.md`: Design for dialogue, relationship building, quests, and trading with NPCs.
    *   `combat_system.md`: Details on turn-based or real-time combat mechanics, stats, skills, and enemy AI.
    *   `GameLoopSystem.md`: Foundational timing system providing consistent game progression, speed control, and auto-save functionality. *(New)*
*   **/UI_UX**: Contains documents specifically related to User Interface and User Experience design. *(New Folder)*
    *   `LayoutDesign.md`: Rationale and description of the main UI layout (e.g., 3-column). *(New)*
    *   `UserFlows.md`: Step-by-step descriptions of key user interactions. *(New/Updated)*
*   **/requirements**: Contains formal requirement documents. *(New Folder)*
    *   `FunctionalRequirements.md`: List of what the system must do. *(New)*
    *   `NonFunctionalRequirements.md`: List of system qualities (performance, maintainability, etc.). *(New)*
*   **/assets**: Lists or descriptions of required art, sound, or other media assets (though the assets themselves might be stored elsewhere).

## Recent Updates

### GameLoop System Implementation
- Added comprehensive timing system with fixed timestep architecture
- Implemented game speed control and pause/resume functionality  
- Created GameControlPanel UI for intuitive game state management
- Integrated auto-save system with configurable intervals
- Updated all relevant specification documents

This structure helps keep related documents together and makes it easier to find specific information about the project's design and implementation.
