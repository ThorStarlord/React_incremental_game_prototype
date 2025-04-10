import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState } from './useDialogManager';
import { loadSavedGame } from '../../../shared/utils/saveUtils'; // Import load function
import { useAppDispatch } from '../../../app/hooks'; // Import typed dispatch
import { replaceState, RootState } from '../../../app/store'; // Import action creator and RootState type

interface GameActionsProps {
  mostRecentSave: SavedGame | null;
  exportSave: (saveId: string) => Promise<boolean>;
  importSave: () => Promise<boolean>;
  deleteSave: (saveId: string) => Promise<boolean>;
  loadSavedGames: () => Promise<void>;
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
  openDialog,
  closeDialog,
  clearDeleteTarget
}: GameActionsProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use typed dispatch

  const handleNewGame = useCallback(() => {
    navigate('/game');
  }, [navigate]);

  const handleLoadGame = useCallback(async (saveId: string) => {
    console.log('Attempting to load game:', saveId);
    try {
      const loadedState = await loadSavedGame(saveId); // Load the full state
      if (loadedState) {
        dispatch(replaceState(loadedState as RootState)); // Dispatch the action to replace the entire Redux state
        closeDialog('loadDialog');
        navigate('/game'); // Navigate after successful load and state replacement
        console.log('Game loaded successfully!');
      } else {
        console.error('Failed to load game data.');
      }
    } catch (error) {
      console.error('Error loading game:', error);
      console.error('An error occurred while loading the game.');
    }
  }, [navigate, closeDialog, dispatch]);

  const handleContinue = useCallback(() => {
    if (mostRecentSave) {
      handleLoadGame(mostRecentSave.id); // Call handleLoadGame with the most recent save ID
    } else {
      console.info('No recent save game found to continue.');
    }
  }, [mostRecentSave, handleLoadGame]);

  const handleShowExport = useCallback(async () => {
    if (!mostRecentSave) return;

    const success = await exportSave(mostRecentSave.id);
    if (success) {
      openDialog('exportDialog');
    } else {
      console.error('Failed to export save');
    }
  }, [mostRecentSave, exportSave, openDialog]);

  const handleCopyToClipboard = useCallback((exportCode: string) => {
    navigator.clipboard.writeText(exportCode)
      .then(() => {
        console.log('Export code copied to clipboard');
      })
      .catch(() => {
        console.error('Failed to copy to clipboard');
      });
  }, []);

  const handleImport = useCallback(async () => {
    const success = await importSave();
    if (success) {
      console.log('Game imported successfully as a new save slot.');
      closeDialog('importDialog');
      await loadSavedGames(); // Refresh saved games list - ensure await if loadSavedGames is async
    } else {
      console.error('Failed to import save. Invalid code or format.');
    }
  }, [importSave, closeDialog, loadSavedGames]);

  const handleDeleteConfirm = useCallback(async (saveId: string, saveName: string) => {
    const success = await deleteSave(saveId);
    if (success) {
      console.log(`Deleted "${saveName}"`);
    } else {
      console.error('Failed to delete save');
    }

    closeDialog('deleteDialog');
    clearDeleteTarget();
  }, [deleteSave, closeDialog, clearDeleteTarget]);

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
