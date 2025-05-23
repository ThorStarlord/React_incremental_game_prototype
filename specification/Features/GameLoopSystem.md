# GameLoop System Specification

This document details the design and mechanics of the GameLoop system, which provides the foundational timing and state management for all game progression mechanics.

## 1. Overview

*   **Purpose:** Provides consistent time-based progression for all game systems. Manages game state (running/paused), speed control, and automatic saving functionality.
*   **Core Loop:** Initialize -> Start -> Tick Processing -> State Updates -> Auto-save -> Continue/Pause/Stop.

## 2. Core Architecture

*   **Fixed Timestep:** Uses a fixed timestep approach with accumulator pattern to ensure consistent game logic regardless of frame rate.
*   **RequestAnimationFrame:** Leverages browser's requestAnimationFrame for smooth 60fps rendering while maintaining independent game logic timing.
*   **Tick Rate:** Configurable tick rate (default 10 TPS - 100ms per tick) for game logic updates.
*   **Performance Optimization:** Memoized callbacks and selectors prevent unnecessary re-renders.

## 3. Game State Management

*   **Game States:**
    *   `isRunning`: Boolean indicating if the game loop is active
    *   `isPaused`: Boolean indicating if the game is temporarily paused
    *   `currentTick`: Current tick number since game start
    *   `totalGameTime`: Total elapsed game time in milliseconds
*   **Speed Control:**
    *   `gameSpeed`: Multiplier ranging from 0.1x to 5.0x
    *   Real-time speed adjustment during gameplay
    *   Speed disabled when game is not running

## 4. Auto-save System

*   **Configuration:**
    *   `autoSaveInterval`: Time in seconds between auto-saves (default 30)
    *   `lastAutoSave`: Timestamp of last auto-save operation
*   **Triggers:** Automatic saving based on elapsed game time
*   **Integration:** Hooks into existing save/load system via Redux thunks

## 5. Integration Points

*   **Tick Callbacks:** Other systems can register for tick-based updates via `useGameLoop` hook
*   **Timing Data:** Provides deltaTime and timing information for time-based calculations
*   **State Synchronization:** All time-dependent systems sync with GameLoop state

## 6. UI Components

*   **GameControlPanel:** Main interface for game loop control
    *   Start/Pause/Stop buttons with Material-UI icons
    *   Game speed slider with real-time feedback
    *   Current game time display in human-readable format
    *   Tick counter for debugging and advanced users

## 7. Performance Considerations

*   **Memory Management:** Proper cleanup of animation frames and event listeners
*   **Efficient Updates:** Minimal state updates to prevent unnecessary re-renders
*   **Browser Optimization:** Uses requestAnimationFrame for optimal browser performance

## 8. Technical Implementation

*   **Location:** `src/features/GameLoop/`
*   **State Management:** Redux Toolkit slice with typed selectors and actions
*   **Custom Hook:** `useGameLoop` provides integration interface for other features
*   **UI Components:** Material-UI based control panel with responsive design

## 9. Future Enhancements

*   **Offline Progress:** Calculate progression during offline time
*   **Speed Presets:** Quick-select common speed multipliers
*   **Advanced Controls:** Fine-grained control over specific system tick rates
*   **Performance Monitoring:** Real-time performance metrics and optimization
