# User Flows Specification

This document details common user interaction flows within the game.

## 1. Core Gameplay Loop

1.  **User starts the game/loads a save.** -> Main Game view is displayed (Game/World tab content active).
2.  **User observes resources (Essence) accumulating.** -> Essence display updates in the header/sidebar.
3.  **User performs actions in the Game/World view** (e.g., clicks a location, starts combat). -> Game state updates, UI reflects changes.
4.  **User decides to manage traits.** -> **User clicks the 'Traits' tab in the vertical side panel.**
5.  **Trait management UI appears in the main content area.** -> User views/equips/unequips traits.
6.  **User decides to check NPCs.** -> **User clicks the 'NPCs' tab in the vertical side panel.**
7.  **NPC list/details appear in the main content area.** -> User views NPC information or interacts.
8.  **User returns to the game world.** -> **User clicks the 'Game' tab in the vertical side panel (or closes/collapses the management view if applicable).**
9.  **User saves the game.** -> User clicks Menu/Save button -> Save confirmation shown.
10. **User accesses settings.** -> User clicks Menu/Settings button -> **User clicks the 'Settings' tab in the vertical side panel.** -> Settings UI appears in the main content area.

## 2. Trait Management Flow

1.  **User is in the main game view.**
2.  **User clicks the 'Traits' tab in the vertical side panel.** -> Trait management UI loads in the main content area.
3.  **User views Equipped Traits panel.** -> Sees currently active traits and available slots.
4.  **User views Available/Acquired Traits list.** -> Sees traits they own but are not equipped.
5.  **User selects an available trait.** -> Trait details are displayed.
6.  **User clicks 'Equip' button (or drags trait to an empty slot).** -> Trait is moved to an empty slot in the Equipped Traits panel. UI updates slot count.
7.  **User selects an equipped trait.** -> Trait details are displayed.
8.  **User clicks 'Unequip' button.** -> Trait is removed from the slot and returns to the Available list. UI updates slot count.
9.  **(Optional) User interacts with Permanent Traits.** -> User selects an equipped trait -> Clicks 'Make Permanent' -> Confirms action (cost deducted). -> Trait appears in Permanent section and remains equipped.
10. **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the vertical side panel.**

## 3. NPC Interaction Flow

1.  **User is in the main game view.**
2.  **User clicks the 'NPCs' tab in the vertical side panel.** -> NPC list/overview loads in the main content area.
3.  **User selects an NPC from the list.** -> Detailed view for the selected NPC appears in the main content area (or a section of it).
4.  **User views NPC details** (relationship status, quests, services).
5.  **(Option A) User clicks an interaction button (e.g., 'Talk', 'Trade').** -> A dialogue modal appears, or the view transitions to a dedicated interaction screen within the main content area.
6.  **(Option B) User learns a trait from the NPC.** -> Notification shown, trait appears in the player's acquired traits list (viewable via the 'Traits' side tab).
7.  **User finishes interaction.** -> Returns to the NPC detail view or list.
8.  **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the vertical side panel.**

## 4. Settings Adjustment Flow

1.  **User is in the main game view.**
2.  **User clicks the Menu button (in Header).** -> Menu options appear.
3.  **User clicks 'Settings'.** -> **User clicks the 'Settings' tab in the vertical side panel.** -> Settings UI loads in the main content area, likely with its own sub-tabs (Audio, Graphics, etc.).
4.  **User selects a settings category (e.g., 'Audio').**
5.  **User adjusts a setting (e.g., moves Master Volume slider).** -> UI reflects the change immediately.
6.  **User clicks 'Save Settings' (if applicable) or changes are saved automatically.**
7.  **User navigates away.** -> **User clicks another tab (e.g., 'Game') in the vertical side panel.**

*(These flows are illustrative and may evolve as features are added.)*
