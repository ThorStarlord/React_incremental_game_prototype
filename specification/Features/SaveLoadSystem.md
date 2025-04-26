# Save/Load System Specification

This document details the functionality for saving and loading game progress.

## 1. Overview

*   **Purpose:** Allow players to persist their game state and resume playing later. Provide mechanisms for managing multiple save files, backups, and import/export.
*   **Core Actions:** Save Game, Load Game, Delete Save, Autosave, Import Save, Export Save.

## 2. Save Data Structure

*   **Root Object:** The top-level object stored for a save file.
    *   `metadata`: Information about the save (timestamp, playtime, version, player level, save name, etc.). See `SavedGame` interface in `saveUtils.ts`.
    *   `gameState`: The complete Redux state (`RootState`) at the time of saving. This includes all slices (player, traits, essence, meta, settings, etc.).

## 3. Save Mechanisms

*   **Manual Save:**
    *   Triggered by player action (e.g., "Save Game" button in a menu).
    *   Player can optionally name the save file. If not named, a default name is generated (e.g., "PlayerName - Level X - Timestamp").
    *   Creates a new save slot/file.
*   **Autosave:**
    *   Triggered automatically based on a timer defined in settings (`GameplaySettings.autosaveInterval`, `GameplaySettings.autosaveEnabled`).
    *   Typically overwrites a dedicated autosave slot or uses a rotating buffer of autosave slots (TBD - Single slot or multiple?). *Decision:* Start with a single autosave slot for simplicity.
    *   Clearly marked as "Autosave" in the load menu.
*   **Quicksave:** (Optional)
    *   Triggered by a hotkey.
    *   Overwrites a dedicated quicksave slot.
*   **Storage:** Use browser `localStorage` as the primary storage mechanism. Keys should be prefixed (e.g., `game_save_[saveId]`, `game_save_autosave`, `saved_games_list`).

## 4. Load Mechanism

*   **Load Menu:** UI displaying all available save slots (manual, auto, quick).
    *   Shows metadata: Save name, timestamp, playtime, player level, potentially a screenshot.
    *   Options to Load or Delete each save.
*   **Loading Process:**
    1.  Retrieve the selected save data string from `localStorage`.
    2.  Parse the JSON string into the `RootState` object.
    3.  Perform validation/migration if save version differs from game version (basic check initially).
    4.  Dispatch a `replaceState` action to overwrite the entire Redux store with the loaded state.
    5.  Navigate the player to the appropriate game screen (e.g., `/game`).
    6.  Reset relevant session timers (e.g., `meta.sessionStartTime`).

## 5. Save Management

*   **Save Slots:** How many manual save slots are allowed? (TBD - Potentially unlimited within browser limits, or capped at e.g., 10-20).
*   **Deleting Saves:** Player can delete manual saves from the Load Menu. Autosave/Quicksave slots are typically overwritten, not manually deleted.
*   **Save List:** A separate `localStorage` key (`saved_games`) stores an array of `SavedGame` metadata objects to quickly populate the Load Menu without loading full game states.

## 6. Import/Export

*   **Export:**
    *   Player selects a save file to export.
    *   The full `gameState` object is stringified.
    *   The string is encoded (e.g., Base64) to create an export code/string.
    *   Provide options to copy the code to the clipboard or download as a `.json` file.
*   **Import:**
    *   Player provides an export code (paste or file upload).
    *   The code is decoded (Base64) and parsed back into a `RootState` object.
    *   Validate the structure of the parsed object.
    *   Create a *new* manual save slot using the imported state. Assign a name like "Imported - Timestamp".
    *   The imported save does *not* automatically load; the player must load it manually from the Load Menu.

## 7. Versioning & Compatibility

*   Save data includes the `gameVersion` from `MetaState`.
*   On load, compare the save's version with the current game version.
*   **Initial Strategy:** Log a warning if versions differ. Allow loading but acknowledge potential issues.
*   **Future:** Implement migration logic to update older save structures to the current version if possible. If incompatible, prevent loading and inform the player.

## 8. UI/UX Considerations

*   Clear feedback during save/load operations (loading indicators, success/error messages).
*   Easy access to Save/Load menus.
*   Confirmation dialog before deleting saves.
*   Intuitive interface for import/export.
*   Display relevant save metadata clearly in the Load Menu.

## 9. Technical Implementation (`shared/utils/saveUtils.ts`, `features/Meta/state/MetaThunks.ts`)

*   `saveUtils.ts`: Contains core functions (`getSavedGames`, `loadSavedGame`, `deleteSavedGame`, `createSave`).
*   `MetaThunks.ts`: Contains async thunks (`saveGameThunk`, `loadGameThunk`, `importGameThunk`) that orchestrate the save/load process, interact with `saveUtils`, and dispatch Redux actions (including `replaceState`).
