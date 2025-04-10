import React from 'react';
import { LoadGameDialog } from '../dialogs/LoadGameDialog';
import { DeleteConfirmationDialog } from '../dialogs/DeleteConfirmationDialog';
import { ExportDialog } from '../dialogs/ExportDialog';
import { ImportDialog } from '../dialogs/ImportDialog';
import { AboutDialog } from '../dialogs/AboutDialog';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState, SaveToDelete } from '../hooks/useDialogManager';

interface DialogsContainerProps {
  dialogState: DialogState;
  savedGames: SavedGame[];
  isLoading: boolean;
  saveToDelete: SaveToDelete | null;
  exportCode: string;
  importCode: string;
  appVersion: string;
  setImportCode: (code: string) => void;
  onLoadGame: (saveId: string) => void; // This is handleLoadGame from useGameActions
  onDeleteRequest: (id: string, name: string) => void; // This is handleDeleteRequest from useDialogManager
  onDeleteConfirm: (id: string, name: string) => void; // This is handleDeleteConfirm from useGameActions
  onCloseDialog: (dialogName: keyof DialogState) => void;
  onImport: () => void;
  onCopyToClipboard: (code: string) => void;
  clearDeleteTarget: () => void;
}

export function DialogsContainer({
  dialogState,
  savedGames,
  isLoading,
  saveToDelete,
  exportCode,
  importCode,
  appVersion,
  setImportCode,
  onLoadGame, // Renamed prop for clarity, maps to handleLoadGame
  onDeleteRequest, // Renamed prop for clarity, maps to handleDeleteRequest
  onDeleteConfirm, // This is handleDeleteConfirm from useGameActions
  onCloseDialog,
  onImport,
  onCopyToClipboard,
  clearDeleteTarget
}: DialogsContainerProps) {
  return (
    <>
      <LoadGameDialog
        isOpen={dialogState.loadDialog}
        savedGames={savedGames}
        isLoading={isLoading}
        onLoad={onLoadGame} // Connect onLoad prop to the passed onLoadGame function
        onDelete={(saveId) => { // Connect onDelete prop to the passed onDeleteRequest function
          const save = savedGames.find(game => game.id === saveId);
          if (save) {
            // Call the function passed via props
            onDeleteRequest(save.id, save.name);
          }
        }}
        onClose={() => onCloseDialog('loadDialog')}
      />

      <DeleteConfirmationDialog
        isOpen={dialogState.deleteDialog}
        saveName={saveToDelete?.name}
        isLoading={isLoading}
        onConfirm={() => { // Connects onConfirm to the passed onDeleteConfirm
          if (saveToDelete) {
            onDeleteConfirm(saveToDelete.id, saveToDelete.name);
          }
        }}
        onCancel={() => { // Handles cancellation
          onCloseDialog('deleteDialog');
          clearDeleteTarget(); // Clears the target save ID/name
        }}
      />

      <ExportDialog
        isOpen={dialogState.exportDialog}
        exportCode={exportCode}
        onClose={() => onCloseDialog('exportDialog')}
        onCopyToClipboard={() => onCopyToClipboard(exportCode)}
      />

      <ImportDialog
        isOpen={dialogState.importDialog}
        importCode={importCode}
        setImportCode={setImportCode}
        isLoading={isLoading}
        onImport={onImport}
        onClose={() => onCloseDialog('importDialog')}
      />

      <AboutDialog
        isOpen={dialogState.aboutDialog}
        version={appVersion}
        onClose={() => onCloseDialog('aboutDialog')}
      />
    </>
  );
}
