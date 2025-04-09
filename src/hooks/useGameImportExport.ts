import { useState, useCallback } from 'react';

export function useGameImportExport() {
  const [exportCode, setExportCode] = useState<string>('');
  const [importCode, setImportCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const exportSave = useCallback(async (saveId: string) => {
    setIsLoading(true);
    try {
      const saveData = localStorage.getItem(`savegame_${saveId}`);
      if (!saveData) {
        throw new Error('Save not found');
      }
      
      // Base64 encode the save data to make it easier to copy
      const encodedData = btoa(saveData);
      setExportCode(encodedData);
      return true;
    } catch (error) {
      console.error('Error exporting save:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importSave = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!importCode.trim()) {
        throw new Error('No import code provided');
      }
      
      // Decode the import code
      const decodedData = atob(importCode.trim());
      const saveData = JSON.parse(decodedData);
      
      if (!saveData.id || !saveData.timestamp) {
        throw new Error('Invalid save data format');
      }
      
      // Save to localStorage
      localStorage.setItem(`savegame_${saveData.id}`, decodedData);
      setImportCode('');
      return true;
    } catch (error) {
      console.error('Error importing save:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [importCode]);

  return {
    exportCode,
    importCode,
    setImportCode,
    isLoading,
    exportSave,
    importSave
  };
}
