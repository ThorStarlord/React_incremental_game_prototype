import { saveGame, loadGame, saveLayout, clearSave } from './storage';

// storage.test.js

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Replace the global localStorage object with our mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage Utility Functions', () => {
  beforeEach(() => {
    // Clear localStorage and mock function calls before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveGame', () => {
    test('should successfully save game state to localStorage', () => {
      const gameState = { player: { level: 5, hp: 100 }, inventory: ['sword', 'potion'] };
      const result = saveGame(gameState);
      
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'incrementalRPG_saveData',
        JSON.stringify(gameState)
      );
    });

    test('should handle errors and return false when saving fails', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage failed');
      });
      
      const gameState = { player: { level: 10 }};
      const result = saveGame(gameState);
      
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadGame', () => {
    test('should load game state from localStorage', () => {
      const gameState = { player: { level: 7, exp: 450 }, settings: { sound: true } };
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(gameState));
      
      const result = loadGame();
      
      expect(result).toEqual(gameState);
      expect(localStorage.getItem).toHaveBeenCalledWith('incrementalRPG_saveData');
    });

    test('should return null when no saved game exists', () => {
      localStorage.getItem.mockReturnValueOnce(null);
      
      const result = loadGame();
      
      expect(result).toBeNull();
    });

    test('should handle parsing errors and return null', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.getItem.mockReturnValueOnce('{ invalid: json }');
      
      const result = loadGame();
      
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveLayout', () => {
    test('should save layout configuration to localStorage', () => {
      const layout = { columns: ['inventory', 'character', 'quests'] };
      const result = saveLayout(layout);
      
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'incremental_rpg_layout',
        JSON.stringify(layout)
      );
    });

    test('should handle errors when saving layout fails', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Layout save failed');
      });
      
      const result = saveLayout({ columns: [] });
      
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearSave', () => {
    test('should remove all save data from localStorage', () => {
      const result = clearSave();
      
      expect(result).toBe(true);
      expect(localStorage.removeItem).toHaveBeenCalledWith('incremental_rpg_save');
      expect(localStorage.removeItem).toHaveBeenCalledWith('incremental_rpg_save_timestamp');
      expect(localStorage.removeItem).toHaveBeenCalledWith('incremental_rpg_save_backup');
    });

    test('should handle errors when clearing save fails', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('Clear save failed');
      });
      
      const result = clearSave();
      
      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  // Test persistence with a complete workflow
  test('should maintain data integrity through save and load operations', () => {
    const gameState = {
      player: { name: "Hero", level: 12, gold: 1500 },
      inventory: ["legendary sword", "healing potion", "mythril armor"],
      quests: [{ id: "q1", completed: true }, { id: "q2", completed: false }]
    };
    
    // Save the game
    saveGame(gameState);
    
    // Load the game and verify data
    const loadedState = loadGame();
    expect(loadedState).toEqual(gameState);
  });
});