/**
 * Tests for stateUtils.js
 * 
 * This file contains tests for the state management utility functions.
 */

import {
    getStateFromLocalStorage,
    saveStateToLocalStorage,
    clearStateFromLocalStorage,
    mergeState,
    updateNestedState,
    toggleStateProperty,
    getNestedProperty,
    createStateSnapshot,
    saveStateHistory,
    restoreStateFromHistory
} from './stateUtils';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn(key => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('State Utils', () => {
    beforeEach(() => {
        // Clear localStorage mock before each test
        localStorageMock.clear();
        jest.clearAllMocks();
    });

    // Sample test data
    const mockGameState = {
        player: {
            name: 'Hero',
            level: 1,
            stats: {
                health: 100,
                mana: 50
            },
            inventory: ['sword', 'potion'],
            settings: {
                notifications: true,
                soundEnabled: false
            }
        },
        gameVersion: '1.0.0'
    };

    describe('localStorage functions', () => {
        test('saveStateToLocalStorage should store state in localStorage', () => {
            saveStateToLocalStorage('gameState', mockGameState);
            
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'gameState', 
                JSON.stringify(mockGameState)
            );
        });

        test('getStateFromLocalStorage should retrieve state from localStorage', () => {
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockGameState));
            
            const result = getStateFromLocalStorage('gameState');
            
            expect(localStorageMock.getItem).toHaveBeenCalledWith('gameState');
            expect(result).toEqual(mockGameState);
        });

        test('getStateFromLocalStorage should return null for non-existent keys', () => {
            const result = getStateFromLocalStorage('nonExistentKey');
            
            expect(result).toBeNull();
        });

        test('clearStateFromLocalStorage should remove state from localStorage', () => {
            clearStateFromLocalStorage('gameState');
            
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('gameState');
        });
    });

    describe('state manipulation functions', () => {
        test('mergeState should combine two state objects', () => {
            const additionalState = {
                player: {
                    experience: 0
                },
                world: {
                    currentZone: 'forest'
                }
            };

            const result = mergeState(mockGameState, additionalState);
            
            // The player object should be replaced, not deeply merged
            expect(result.player).toEqual(additionalState.player);
            expect(result.world).toEqual(additionalState.world);
            expect(result.gameVersion).toEqual('1.0.0');
        });

        test('updateNestedState should update a nested property', () => {
            const result = updateNestedState(mockGameState, 'player.stats.health', 120);
            
            expect(result.player.stats.health).toBe(120);
            // Original state should not be modified
            expect(mockGameState.player.stats.health).toBe(100);
        });

        test('updateNestedState should create nested properties if they don\'t exist', () => {
            const result = updateNestedState(mockGameState, 'player.skills.magic', 10);
            
            expect(result.player.skills.magic).toBe(10);
            // Original should not have this property
            expect(mockGameState.player.skills).toBeUndefined();
        });

        test('getNestedProperty should retrieve a nested property', () => {
            const result = getNestedProperty(mockGameState, 'player.stats.mana');
            
            expect(result).toBe(50);
        });

        test('getNestedProperty should return undefined for non-existent paths', () => {
            const result = getNestedProperty(mockGameState, 'player.nonExistent.property');
            
            expect(result).toBeUndefined();
        });

        test('toggleStateProperty should toggle a boolean property', () => {
            const result = toggleStateProperty(mockGameState, 'player.settings.notifications');
            
            expect(result.player.settings.notifications).toBe(false);
            // Original should remain unchanged
            expect(mockGameState.player.settings.notifications).toBe(true);
        });
    });

    describe('state history functions', () => {
        test('createStateSnapshot should create a timestamped snapshot', () => {
            const now = Date.now();
            jest.spyOn(Date, 'now').mockImplementation(() => now);
            
            const snapshot = createStateSnapshot(mockGameState);
            
            expect(snapshot.timestamp).toBe(now);
            expect(snapshot.data).toEqual(mockGameState);
            // Ensure it's a deep copy, not reference
            expect(snapshot.data).not.toBe(mockGameState);
            
            Date.now.mockRestore();
        });

        test('saveStateHistory should maintain a history of states', () => {
            // Mock implementation for multiple calls
            const timestamps = [1000, 2000, 3000];
            let timeIndex = 0;
            jest.spyOn(Date, 'now').mockImplementation(() => timestamps[timeIndex++]);

            // Initial save
            saveStateHistory('game', mockGameState, 3);

            // Update and save again
            const updatedState = updateNestedState(mockGameState, 'player.level', 2);
            saveStateHistory('game', updatedState, 3);

            // Update and save one more time
            const finalState = updateNestedState(updatedState, 'player.stats.health', 150);
            saveStateHistory('game', finalState, 3);

            // Check the history was saved correctly
            expect(localStorageMock.setItem).toHaveBeenCalledTimes(3);
            
            // Mock the retrieval
            const mockHistory = [
                { timestamp: timestamps[0], data: mockGameState },
                { timestamp: timestamps[1], data: updatedState },
                { timestamp: timestamps[2], data: finalState }
            ];
            localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockHistory));

            // Restore the most recent state
            const restored = restoreStateFromHistory('game');
            expect(restored).toEqual(finalState);

            Date.now.mockRestore();
        });
    });
});