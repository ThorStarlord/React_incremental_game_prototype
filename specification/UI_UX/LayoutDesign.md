# UI Layout Design Specification

This document outlines the primary layout structure for the game's user interface.

## 1. Core Layout: Vertical Side Tabs

The main game interface utilizes a **vertical side tab navigation** structure, implemented via the `VerticalNavBar` component, positioned on the left side. This organizes core management sections of the game. The main content corresponding to the selected tab is displayed in the `MainContentArea` component. A persistent header is currently omitted, with global elements like Essence potentially placed within the `MainContentArea`'s header or the `VerticalNavBar`.

*   **Layout Wireframe:**

    ```
    +-------+---------------------------+
    | Tabs  |                           |
    |-------|  Main Content Area        |
    | Game  |  (Header: Optional Title,|
    |-------|   Essence Display)        |
    | Traits|  -------------------------|
    |-------|  (Content for active tab)|
    | NPCs  |                           |
    |-------|                           |
    | Sett. |                           |
    |-------|                           |
    | ...   |                           |
    +-------+---------------------------+
    ```

*   **Side Tabs (Implemented in `VerticalNavBar`):**
    *   **Game:** The primary view for interacting with the game world (map, location view, combat). This is the default active tab.
    *   **Character:** Displays player stats, attributes, and potentially equipped items summary.
    *   **Inventory:** Section for managing player inventory. *(Placeholder)*
    *   **Traits:** Dedicated section for viewing acquired traits, managing equipped traits in slots, etc.
    *   **Quests:** Section for viewing active and completed quests. *(Placeholder)*
    *   **Minions/Copies:** Section for managing player-controlled minions or copies. *(Placeholder)*
    *   **World Map:** Displays the game world map. *(Placeholder)*
    *   **Settings:** Access to game settings (Audio, Graphics, Gameplay, UI).

*   **Collapsibility:** The `VerticalNavBar` **can be made collapsible** (controlled by a `collapsed` prop, currently defaulting to `false`) to maximize the space available for the `MainContentArea`.

*   **Tab Content (`MainContentArea`):** (Content appears in the Main Content Area when a tab is active)
    *   **Game Tab Active:** Displays the `GamePage` component.
    *   **Character Tab Active:** Displays the `CharacterPanel` component.
    *   **Traits Tab Active:** Displays the `TraitSystemWrapper` component.
    *   **Settings Tab Active:** Displays the `SettingsPage` component.
    *   *(Placeholders for Inventory, Quests, Minions, World Map)*

## 2. Rationale for Vertical Side Tab Layout

*   **Focused Views:** Each tab activates a dedicated view in the main content area, reducing clutter.
*   **Clear Navigation:** Provides an explicit way for users to switch between major game systems.
*   **Scalability:** Easy to add new major features as additional tabs in the vertical list.
*   **Content Space:** Allows the main content area to potentially utilize more horizontal space compared to a top-tab layout, especially when the side panel is collapsed.

## 3. Responsiveness

*   **Desktop:** Side tabs (`VerticalNavBar`) are displayed vertically. The `MainContentArea` sits alongside it. The side panel can be collapsed/expanded.
*   **Tablet/Mobile:** *(Current implementation primarily uses MUI's responsive features within components. Explicit layout changes like collapsing the sidebar by default or transforming to bottom navigation are not yet implemented but could be added.)*
    *   The side tab panel might be collapsed by default, requiring a tap on a menu icon (e.g., hamburger menu) to reveal it.
    *   Alternatively, on very small screens, the tabs could transform into a bottom navigation bar or remain behind a menu icon.
    *   Content within the main area must adapt to the viewport width.

## 4. Key UI Panels/Components (Placement Examples)

*   **Player Panel (Summary):** Part of `CharacterPanel` (Character Tab)
*   **Essence Display:** Header within `MainContentArea` (or potentially `VerticalNavBar`)
*   **Trait Slots Panel:** Part of `TraitSystemWrapper` (Traits Tab)
*   **Acquired Traits List:** Part of `TraitSystemWrapper` (Traits Tab)
*   **NPC List:** Main Content Area (when NPCs tab is active - *Placeholder*)
*   **NPC Details:** Main Content Area (when NPCs tab is active - *Placeholder*)
*   **Quest Log (Full):** Main Content Area (when Quests tab is active - *Placeholder*)
*   **Inventory:** Main Content Area (when Inventory tab is active - *Placeholder*)
*   **Combat Log:** Part of `GamePage` (Game Tab)
*   **Game Menu (Save/Load/Settings):** Settings accessed via Settings Tab. Save/Load typically accessed via Main Menu or potentially a button within the Settings tab or a dedicated menu.

## 5. Persistent Elements

*   **Side Tab Bar (`VerticalNavBar`):** Persists within the main game view (`GameContainer`), though potentially collapsible.

*(This document focuses on the main game screen layout. Menus like the Main Menu might use different layouts.)*
