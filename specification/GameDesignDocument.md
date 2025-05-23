# Game Design Document

## Core Systems Overview

### 1. GameLoop System (✅ Implemented)
The foundational timing system that drives all game progression:

**Key Features:**
- Fixed timestep game loop ensuring consistent progression
- Variable speed control (0.1x to 5.0x) for different play styles
- Automatic save functionality preventing progress loss
- Pause/resume for flexible session management

**Integration:** All time-based systems (Essence generation, trait cooldowns, Copy growth) synchronize with the GameLoop for consistent timing.

**UI Components:** GameControlPanel provides intuitive controls for game state management.

<!-- ... existing sections ... -->

## 5. User Interface (UI) and User Experience (UX)

### 5.1. UI Overview

The game will feature a clean and intuitive user interface designed for clarity and ease of use. Key information like player resources (Essence) and core stats will be persistently visible.

The main game interface utilizes a **vertical side-tab layout** (implemented via `VerticalNavBar` and `MainContentArea`) to organize major systems. A navigation bar on the left contains tabs for different game sections. Clicking a tab displays its corresponding content in the main area to the right. Primary tabs include:

*   **Game:** The main viewport for exploration, combat, and direct interaction.
*   **Character:** Displays player stats, attributes, etc.
*   **Traits:** Managing acquired and equipped character traits.
*   **NPCs:** Viewing information about non-player characters and managing relationships. *(Placeholder)*
*   **Settings:** Accessing game configuration options.
*   *(Potentially others like Inventory, Quests, Minions/Copies, World Map)*

This layout allows for focused management of different game aspects. The sidebar can be made collapsible to maximize the main content view. A persistent header is currently omitted, but global resources might be displayed within the main content area's header or the sidebar itself. The UI will be designed with responsiveness in mind.

### 5.2. Key UI Elements

*   **Essence Display:** Clearly shows current/max essence and potentially generation rate (e.g., in `MainContentArea` header).
*   **Trait Management:** Interface (`TraitSystemWrapper`) within the main content area when the "Traits" tab is active.
*   **NPC Codex/List:** Interface within the main content area when the "NPCs" tab is active. *(Placeholder)*
*   **Action Buttons/Bars:** Contextual buttons for interaction, skills, or items (likely within the "Game" tab's content - `GamePage`).
*   **Notifications:** Non-intrusive pop-ups for important events (trait acquired, level up, quest updates).
*   **Tooltips:** Providing detailed information on hover for stats, traits, items, etc.

## Implementation Status

### Completed Systems ✅
- **GameLoop System**: Core timing, state management, and UI controls
- **Save/Load Infrastructure**: Persistent state with localStorage and import/export
- **Performance Optimization**: Efficient rendering and memory management
- **User Controls**: Game speed adjustment and pause/resume functionality

### Next Priority Systems 🔄
1. **Essence Generation System**: Passive resource accumulation using GameLoop ticks
2. **Basic Trait System**: Foundation character progression with time-based mechanics
3. **Player State Management**: Core character data integrated with GameLoop

<!-- ... existing sections ... -->
