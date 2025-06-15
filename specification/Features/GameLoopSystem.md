# GameLoop System Specification

This document details the design and mechanics of the GameLoop system, which provides the foundational timing and state management for all game progression mechanics.

**Implementation Status**: ✅ **FULLY IMPLEMENTED** - Complete game loop system with fixed timestep architecture, state management, and UI controls.

## 1. Overview

*   **Purpose:** Provides consistent time-based progression for all game systems. Manages game state (running/paused), speed control, and automatic saving functionality.
*   **Core Loop:** Auto-Initialize -> Tick Processing -> State Updates -> Auto-save -> Continue/Pause/Stop.
*   **Auto-Start:** The game loop now starts automatically as soon as the main `GameLayout` component is mounted, ensuring that time-based mechanics like resource generation are always active when the player is in the game view.

## 2. Core Architecture ✅ IMPLEMENTED

*   **Fixed Timestep:** Uses a fixed timestep approach with accumulator pattern to ensure consistent game logic regardless of frame rate.
*   **RequestAnimationFrame:** Leverages browser's `requestAnimationFrame` for smooth 60fps rendering while maintaining independent game logic timing.
*   **Tick Rate:** Configurable tick rate (default 10 TPS - 100ms per tick) for game logic updates.
*   **Performance Optimization:** Memoized callbacks and selectors prevent unnecessary re-renders.

## 3. Game State Management ✅ IMPLEMENTED

*   **Game States:**
    *   `isRunning`: Boolean indicating if the game loop is active. **Defaults to `true` on load.**
    *   `isPaused`: Boolean indicating if the game is temporarily paused.
    *   `currentTick`: Current tick number since game start.
    *   `totalGameTime`: Total elapsed game time in milliseconds.
*   **Speed Control:**
    *   `gameSpeed`: Multiplier ranging from 0.1x to 5.0x.
    *   Real-time speed adjustment during gameplay.
    *   Speed disabled when game is not running.

## 4. Auto-save System ✅ IMPLEMENTED

*   **Configuration:**
    *   `autoSaveInterval`: Time in seconds between auto-saves (default 30).
    *   `lastAutoSave`: Timestamp of last auto-save operation.
*   **Triggers:** Automatic saving based on elapsed game time.
*   **Integration:** Hooks into existing save/load system via Redux thunks.

## 5. Integration Points ✅ IMPLEMENTED

*   **Tick Callbacks:** Other systems can register for tick-based updates via `useGameLoop` hook in `App.tsx`.
*   **Timing Data:** Provides `deltaTime` and timing information for time-based calculations.
*   **State Synchronization:** All time-dependent systems sync with GameLoop state.

## 6. UI Components ✅ IMPLEMENTED

*   **GameControlPanel:** Main interface for game loop control.
    *   **Pause/Resume Button:** Allows the user to pause and resume the game loop. The "Start Game" button is no longer the primary way to initiate the loop.
    *   Game speed slider with real-time feedback.
    *   Current game time display in human-readable format.
    *   Tick counter for debugging and advanced users.

## 7. Performance Considerations ✅ IMPLEMENTED

*   **Memory Management:** Proper cleanup of animation frames and event listeners.
*   **Efficient Updates:** Minimal state updates to prevent unnecessary re-renders.
*   **Browser Optimization:** Uses `requestAnimationFrame` for optimal browser performance.

## 8. Technical Implementation ✅ COMPLETE

*   **Location:** `src/features/GameLoop/`
*   **State Management:** Redux Toolkit slice with typed selectors and actions. The `initialState` for `isRunning` is now `true`.
*   **Custom Hook:** `useGameLoop` is initialized in `App.tsx` to provide a single, centralized game tick for all subsystems.
*   **Initialization:** The `startGame` action is dispatched automatically from a `useEffect` hook in the main `GameLayout.tsx` component.
*   **UI Components:** Material-UI based control panel with responsive design.

## 9. Future Enhancements

*   **Offline Progress:** Calculate progression during offline time.
*   **Speed Presets:** Quick-select common speed multipliers.
*   **Advanced Controls:** Fine-grained control over specific system tick rates.
*   **Performance Monitoring:** Real-time performance metrics and optimization.
