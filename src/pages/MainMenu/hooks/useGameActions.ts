import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState } from './useDialogManager';

interface GameActionsProps {
  mostRecentSave: SavedGame | null;
  exportSave: (saveId: string) => Promise<boolean>;
  importSave: () => Promise<boolean>;
  deleteSave: (saveId: string) => Promise<boolean>;
  loadSavedGames: () => Promise<void>;
  showNotification: (message: string, type: "success" | "error" | "info" | "warning", timeout?: number) => void;
  openDialog: (dialogName: keyof DialogState) => void;
  closeDialog: (dialogName: keyof DialogState) => void;
  clearDeleteTarget: () => void;
}

export function useGameActions({
  mostRecentSave,
  exportSave,
  importSave,
  deleteSave,
  loadSavedGames,
  showNotification,
  openDialog,
  closeDialog,
  clearDeleteTarget
}: GameActionsProps) {
  const navigate = useNavigate();
  
  const handleNewGame = useCallback(() => {
    navigate('/game');
  }, [navigate]);

  const handleContinue = useCallback(() => {
    if (mostRecentSave) {
      // In a real implementation, we would load the save data here
      console.log('Continuing with save:', mostRecentSave.id);
      navigate('/game');
    }
  }, [navigate, mostRecentSave]);

  const handleLoadGame = useCallback((saveId: string) => {
    // In a real implementation, we would load the specific save here
    console.log('Loading game:', saveId);
    closeDialog('loadDialog');
    navigate('/game');
  }, [navigate, closeDialog]);
  
  const handleShowExport = useCallback(async () => {
    if (!mostRecentSave) return;
    
    const success = await exportSave(mostRecentSave.id);
    if (success) {
      openDialog('exportDialog');
    } else {
      showNotification('Failed to export save', 'error');
    }
  }, [mostRecentSave, exportSave, openDialog, showNotification]);

  const handleCopyToClipboard = useCallback((exportCode: string) => {
    navigator.clipboard.writeText(exportCode)
      .then(() => {
        showNotification('Export code copied to clipboard', 'success');
      })
      .catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
      });
  }, [showNotification]);

  const handleImport = useCallback(async () => {
    const success = await importSave();
    if (success) {
      showNotification('Game imported successfully', 'success');
      closeDialog('importDialog');
      loadSavedGames(); // Refresh saved games list
    } else {
      showNotification('Failed to import save. Invalid code format.', 'error');
    }
  }, [importSave, showNotification, closeDialog, loadSavedGames]);

  const handleDeleteConfirm = useCallback(async (saveId: string, saveName: string) => {
    const success = await deleteSave(saveId);
    if (success) {
      showNotification(`Deleted "${saveName}"`, 'success');
    } else {
      showNotification('Failed to delete save', 'error');
    }
    
    closeDialog('deleteDialog');
    clearDeleteTarget();
  }, [deleteSave, showNotification, closeDialog, clearDeleteTarget]);

  return {
    handleNewGame,
    handleContinue,
    handleLoadGame,
    handleShowExport,
    handleCopyToClipboard,
    handleImport,
    handleDeleteConfirm
  };
}
