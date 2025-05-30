import { useState, useCallback } from 'react';
// Import necessary functions from saveUtils, remove GameState import
import { loadSavedGame, createSave } from '../shared/utils/saveUtils';
// Import RootState from the store
import { RootState } from '../app/store';

export function useGameImportExport() {
  const [exportCode, setExportCode] = useState<string>('');
  const [importCode, setImportCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const exportSave = useCallback(async (saveId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Load the actual game state using the saveId
      const gameState = await loadSavedGame(saveId);
      if (!gameState) {
        throw new Error('Save data not found or failed to load');
      }

      // Stringify the loaded game state
      const stateString = JSON.stringify(gameState);

      // Base64 encode the stringified state
      const encodedData = btoa(stateString);
      setExportCode(encodedData);
      return true;
    } catch (error) {
      console.error('Error exporting save:', error);
      setExportCode(''); // Clear export code on error
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importSave = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!importCode.trim()) {
        throw new Error('No import code provided');
      }

      // Decode the import code (base64)
      const decodedString = atob(importCode.trim());
      // Parse the decoded string into a RootState object
      const importedGameState = JSON.parse(decodedString) as RootState; // Use RootState here

      // Basic validation (check for essential parts of the state)
      if (!importedGameState || !importedGameState.player || !importedGameState.meta) {
        throw new Error('Invalid save data format after decoding');
      }

      // Use createSave to add the imported state as a new save slot
      // Use a generic name or derive one if possible
      const saveName = `Imported Save - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const newSaveId = createSave(importedGameState, saveName); // createSave now expects RootState

      if (newSaveId) {
        setImportCode(''); // Clear import code on success
        return true; // Indicate success
      } else {
        throw new Error('Failed to save the imported game state.');
      }

    } catch (error) {
      console.error('Error importing save:', error);
      // Optionally provide more specific feedback based on the error
      return false; // Indicate failure
    } finally {
      setIsLoading(false);
    }
  }, [importCode]); // Dependency: importCode

  return {
    exportCode,
    importCode,
    setImportCode,
    isLoading,
    exportSave,
    importSave
  };
}
