# User Flows Specification

This document details common user interaction flows within the game, reflecting the **vertical side-tab layout**.

## Game Control Flow (✅ Implemented)

**Starting the Game:**
1. User clicks Start button in GameControlPanel
2. Game loop begins ticking at configured rate
3. All time-based systems start receiving updates
4. Auto-save timer begins

**Pausing the Game:**
1. User clicks Pause button during gameplay
2. Game loop pauses (retains state)
3. All progression stops
4. Resume button becomes available

**Speed Control:**
1. User adjusts speed slider during gameplay
2. Game speed multiplier updates in real-time
3. All time-based calculations scale accordingly
4. Visual feedback shows current speed

**Auto-save:**
1. Game tracks elapsed time since last save
2. When interval reached, auto-save triggers
3. Game state persists to localStorage
4. User receives subtle confirmation feedback

## 1. Core Gameplay Loop

1.  **User starts the game/loads a save.** -> Main Game view is displayed (`GameContainer` loads with the 'Game' tab content active in `MainContentArea`).
2.  **User observes resources (Essence) accumulating.** -> Essence display updates (e.g., in the header within `MainContentArea`).
3.  **User performs actions in the Game/World view** (e.g., clicks a location, starts combat). -> Game state updates, UI reflects changes within the `GamePage` component shown in `MainContentArea`.
4.  **User decides to manage traits.** -> **User clicks the 'Traits' tab in the `VerticalNavBar`.**
5.  **Trait management UI (`TraitSystemWrapper`) appears in the `MainContentArea`.** -> User views/equips/unequips traits.
6.  **User decides to check NPCs.** -> **User clicks the 'NPCs' tab in the `VerticalNavBar`.**
7.  **NPC list/details appear in the `MainContentArea`.** -> User views NPC information or interacts. *(Placeholder UI)*
8.  **User returns to the game world.** -> **User clicks the 'Game' tab in the `VerticalNavBar`.**
9.  **User saves the game.** -> User clicks Menu/Save button (location TBD, possibly Settings tab or Main Menu) -> Save confirmation shown.
10. **User accesses settings.** -> **User clicks the 'Settings' tab in the `VerticalNavBar`.** -> Settings UI (`SettingsPage`) appears in the `MainContentArea`.

## 2. Trait Management Flow

1.  **User is in the main game view (any tab active).**
2.  **User clicks the 'Traits' tab in the `VerticalNavBar`.** -> Trait management UI (`TraitSystemWrapper`) loads in the `MainContentArea`.
3.  **User views Equipped Traits panel (within `TraitSystemWrapper`).** -> Sees currently active traits and available slots.
4.  **User views Available/Acquired Traits list (within `TraitSystemWrapper`).** -> Sees traits they own but are not equipped.
5.  **User selects an available trait.** -> Trait details are displayed within the panel.
6.  **User clicks 'Equip' button.** -> Trait is moved to an empty slot. UI updates slot count.
7.  **User selects an equipped trait.** -> Trait details are displayed.
8.  **User clicks 'Unequip' button.** -> Trait is removed from the slot and returns to the Available list. UI updates slot count.
9.  **(Optional) User interacts with Permanent Traits.** -> User selects an equipped trait -> Clicks 'Make Permanent' -> Confirms action (cost deducted). -> Trait appears in Permanent section.
10. **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the `VerticalNavBar`.**

## 3. NPC Interaction Flow

1.  **User is in the main game view.**
2.  **User clicks the 'NPCs' tab in the `VerticalNavBar`.** -> NPC list/overview loads in the `MainContentArea`. *(Placeholder UI)*
3.  **User selects an NPC from the list.** -> Detailed view for the selected NPC appears in the `MainContentArea`.
4.  **User views NPC details** (relationship status, quests, services).
5.  **(Option A) User clicks an interaction button (e.g., 'Talk', 'Trade').** -> A dialogue modal appears, or the view transitions to a dedicated interaction screen within the `MainContentArea`.
6.  **(Option B) User learns a trait from the NPC.** -> Notification shown, trait appears in the player's acquired traits list (viewable via the 'Traits' side tab).
7.  **User finishes interaction.** -> Returns to the NPC detail view or list.
8.  **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the `VerticalNavBar`.**

## 4. Settings Adjustment Flow

1.  **User is in the main game view.**
2.  **User clicks the 'Settings' tab in the `VerticalNavBar`.** -> Settings UI (`SettingsPage`) loads in the `MainContentArea`, likely with its own sub-tabs (Audio, Graphics, etc.).
3.  **User selects a settings category (e.g., 'Audio') using the sub-tabs within the Settings page.**
4.  **User adjusts a setting (e.g., moves Master Volume slider).** -> UI reflects the change immediately.
5.  **User clicks 'Save Settings' button within the Settings page.**
6.  **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the `VerticalNavBar`.**

*(These flows are illustrative and may evolve as features are added.)*
