import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState } from './useDialogManager';
import { loadSavedGame } from '../../../shared/utils/saveUtils';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { replaceState, RootState } from '../../../app/store';
import { resetPlayerState } from '../../../features/Player/state/PlayerSlice';
import { setHasSeenIntro } from '../../../features/Meta/state/MetaSlice';
import { newGameSeedNPCsThunk, setSelectedNPCId } from '../../../features/NPCs';
import { resetEssence } from '../../../features/Essence/state/EssenceSlice';
import { resetInventory } from '../../../features/Inventory/state/InventorySlice';
import { resetQuestState } from '../../../features/Quest/state/QuestSlice';
import { initializeQuestsThunk } from '../../../features/Quest/state/QuestThunks';
import { removeCopy } from '../../../features/Copy/state/CopySlice';

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
  const dispatch = useAppDispatch();
  const copyIds = useAppSelector(state => Object.keys(state.copy.copies));

  const handleNewGame = useCallback(async () => {
    // A fresh onboarding run must not inherit progression/resources from the
    // previous in-memory game. Relationship evidence is reset by the Willow seed
    // thunk; reset the other systems that can materially alter the vertical slice.
    dispatch(resetPlayerState());
    dispatch(resetEssence());
    dispatch(resetInventory());
    dispatch(resetQuestState());
    dispatch(setSelectedNPCId(null));
    copyIds.forEach(copyId => dispatch(removeCopy({ copyId })));
    dispatch(setHasSeenIntro(false));

    // Rebuild canonical quest definitions after clearing mutated quest progress,
    // then seed the Willow-only relationship onboarding state.
    await dispatch(initializeQuestsThunk());
    await dispatch(newGameSeedNPCsThunk());
    navigate('/game/npcs');
  }, [navigate, dispatch, copyIds]);

  const handleLoadGame = useCallback(async (saveId: string) => {
    console.log('Attempting to load game:', saveId);
    try {
      const loadedState = await loadSavedGame(saveId);
      if (loadedState) {
        dispatch(replaceState(loadedState as RootState));
        closeDialog('loadDialog');
        navigate('/game');
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
      handleLoadGame(mostRecentSave.id);
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
      await loadSavedGames();
    } else {
      console.error('Failed to import save. Invalid code or format.');
    }
  }, [importSave, closeDialog, loadSavedGames]);

  const handleDeleteConfirm = useCallback(async (saveId: string, saveName: string) => {
    const success = await deleteSave(saveId);
    if (success) {
      console.log(`Deleted "${saveName}"`);
    } else {
      console.error('Failed to delete save.');
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
