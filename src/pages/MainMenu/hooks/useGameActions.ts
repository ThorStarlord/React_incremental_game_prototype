import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState } from './useDialogManager';
import { loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { replaceState } from '../../../app/store';
import { resetPlayerState } from '../../../features/Player/state/PlayerSlice';
import { setHasSeenIntro } from '../../../features/Meta/state/MetaSlice';
import { newGameSeedNPCsThunk, setSelectedNPCId } from '../../../features/NPCs';
import { resetEssence } from '../../../features/Essence/state/EssenceSlice';
import { resetInventory } from '../../../features/Inventory/state/InventorySlice';
import { resetQuestState } from '../../../features/Quest/state/QuestSlice';
import { initializeQuestsThunk } from '../../../features/Quest/state/QuestThunks';
import { removeCopy } from '../../../features/Copy/state/CopySlice';
import { resetTraitsState } from '../../../features/Traits/state/TraitsSlice';
import { initializeRelationshipRuntimeThunk } from '../../../features/Relationships/state/RelationshipThunks';

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
    dispatch(resetTraitsState());
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
      // Persistent representation migration happens before Redux replacement.
      // A future/invalid schema fails here rather than masquerading as a
      // successful load with partially repaired runtime state.
      const loaded = await loadSavedGameWithMigration(saveId);
      if (loaded) {
        dispatch(replaceState(loaded.state));

        if (loaded.migration.appliedMigrations.length > 0) {
          console.info(
            `Save schema migrated v${loaded.migration.sourceVersion} -> v${loaded.migration.targetVersion}:`,
            loaded.migration.appliedMigrations.join(', ')
          );
        }

        // Runtime reconciliation is intentionally separate from serialized save
        // migration. Relationship authoring is current content, and M9's bounded
        // legacy-depth compatibility mapping depends on those live definitions.
        // It must not fabricate persistent historical evidence.
        try {
          const migrationResult = await dispatch(
            initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true })
          ).unwrap();
          if (migrationResult.migratedNpcIds.length > 0) {
            console.info(
              'Migrated legacy relationship profiles:',
              migrationResult.migratedNpcIds.join(', ')
            );
          }
        } catch (migrationError) {
          console.error(
            'Game loaded, but relationship runtime reconciliation could not complete:',
            migrationError
          );
        }

        closeDialog('loadDialog');
        navigate('/game');
        console.log('Game loaded successfully!');
      } else {
        console.error('Failed to load game data.');
      }
    } catch (error) {
      console.error('Error loading or migrating game:', error);
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
      console.log(`Deleted \"${saveName}\"`);
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
