# UI Layout Design Specification

This document outlines the primary layout structure for the game's user interface.

## 1. Core Layout: Vertical Side Tabs

The main game interface utilizes a **vertical side tab navigation** structure on the left (or right) side to organize core management sections of the game. This tab bar appears as a primary navigation element within the main game view/page. A persistent header might still contain global elements like player resources (Essence) and main menu access.

*   **Layout Wireframe:**

    ```
    +-----------------------------------+
    | Header (Optional: Essence, Menu)  |
    +-------+---------------------------+
    | Tabs  |                           |
    |-------|                           |
    | Game  |                           |
    |-------|                           |
    | Traits|  Main Content Area        |
    |-------|  (Displays content for   |
    | NPCs  |   the active tab)         |
    |-------|                           |
    | Sett. |                           |
    |-------|                           |
    | ...   |                           |
    +-------+---------------------------+
    ```

*   **Side Tabs:**
    *   **Game/World:** The primary view for interacting with the game world (map, location view, combat). This is the default active tab, potentially occupying the main content area by default.
    *   **Traits:** Dedicated section for viewing acquired traits, managing equipped traits in slots, etc. Clicking this tab displays the trait management UI in the main content area.
    *   **NPCs:** Section for viewing encountered NPCs, managing relationships, etc. Clicking this tab displays the NPC management UI in the main content area.
    *   **Settings:** Access to game settings (Audio, Graphics, Gameplay, UI). Clicking this tab displays the settings UI in the main content area.
    *   *(Other potential tabs: Inventory, Quests, Crafting, etc.)*

*   **Collapsibility:** The vertical side tab panel **should be collapsible** to maximize the space available for the main content area, especially on smaller screens or when the user wants to focus on the game world.

*   **Tab Content Examples:** (Content appears in the Main Content Area when a tab is active)
    *   **Traits Tab Active:**
        *   List of all acquired traits (filterable/sortable).
        *   Trait slots display (showing equipped and permanent traits).
        *   Mechanism to drag/assign available traits to empty slots.
        *   Detailed view of a selected trait (description, effects, requirements).
    *   **NPCs Tab Active:**
        *   List of known NPCs (filterable/sortable).
        *   Detailed view of a selected NPC (portrait, description, relationship status, location).
        *   Information related to the NPC (e.g., quests offered, services provided).

## 2. Rationale for Vertical Side Tab Layout

*   **Focused Views:** Each tab activates a dedicated view in the main content area, reducing clutter.
*   **Clear Navigation:** Provides an explicit way for users to switch between major game systems.
*   **Scalability:** Easy to add new major features as additional tabs in the vertical list.
*   **Content Space:** Allows the main content area to potentially utilize more horizontal space compared to a top-tab layout, especially when the side panel is collapsed.

## 3. Responsiveness

*   **Desktop:** Side tabs are displayed vertically. The main content area sits alongside it. The side panel can be collapsed/expanded.
*   **Tablet/Mobile:**
    *   The side tab panel might be collapsed by default, requiring a tap on a menu icon (e.g., hamburger menu) to reveal it.
    *   Alternatively, on very small screens, the tabs could transform into a bottom navigation bar or remain behind a menu icon.
    *   Content within the main area must adapt to the viewport width.

## 4. Key UI Panels/Components (Placement Examples)

*   **Player Panel (Summary):** Persistent Header or Top of Collapsible Side Panel
*   **Essence Display:** Persistent Header
*   **Trait Slots Panel:** Main Content Area (when Traits tab is active)
*   **Acquired Traits List:** Main Content Area (when Traits tab is active)
*   **NPC List:** Main Content Area (when NPCs tab is active)
*   **NPC Details:** Main Content Area (when NPCs tab is active)
*   **Quest Log (Full):** Main Content Area (when Quests tab is active) or Modal
*   **Inventory:** Main Content Area (when Inventory tab is active) or Modal
*   **Combat Log:** Game/World View (potentially as a collapsible overlay/panel within the main content area)
*   **Game Menu (Save/Load/Settings):** Accessed via button (Header) -> Settings Tab displays in Main Content Area

## 5. Persistent Elements

*   **Header (Optional):** Recommended for displaying global information like Essence, Player Name/Level summary, and access to the main menu/settings.
*   **Side Tab Bar:** Persists within the main game view, though potentially collapsible.

*(This document focuses on the main game screen layout. Menus like the Main Menu might use different layouts.)*
