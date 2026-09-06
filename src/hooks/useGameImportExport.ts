import { useState, useCallback } from 'react';
import {
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  encodeSavePayloadToBase64,
  loadSavedGameWithMigration,
} from '../shared/utils/saveUtils';

export function useGameImportExport() {
  const [exportCode, setExportCode] = useState<string>('');
  const [importCode, setImportCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const exportSave = useCallback(async (saveId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loaded = await loadSavedGameWithMigration(saveId);
      if (!loaded) {
        throw new Error('Save data not found or failed to load');
      }

      // Export the canonical envelope rather than a raw RootState so schema
      // identity survives transport. UTF-8 encoding keeps non-ASCII authored or
      // player text safe across base64 copy/paste.
      const encodedData = encodeSavePayloadToBase64(loaded.envelope);
      setExportCode(encodedData);
      return true;
    } catch (error) {
      console.error('Error exporting save:', error);
      setExportCode('');
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

      const payload = decodeSavePayloadFromBase64(importCode);
      const saveName = `Imported Save - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
      const imported = createSaveFromPayload(payload, saveName);

      if (!imported) {
        throw new Error('Failed to migrate or persist imported save data.');
      }

      if (imported.migration.appliedMigrations.length > 0) {
        console.info(
          `Imported save migrated v${imported.migration.sourceVersion} -> v${imported.migration.targetVersion}:`,
          imported.migration.appliedMigrations.join(', ')
        );
      }

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
