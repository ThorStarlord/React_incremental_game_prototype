import { useEffect } from 'react';
import { SavedGame } from '../../../hooks/useSavedGames';
import { DialogState } from './useDialogManager';

interface ShortcutHandlers {
  registerShortcut: (shortcut: any) => () => void;
  handleNewGame: () => void;
  handleContinue: () => void;
  handleShowExport: () => void;
  openLoadDialog: () => void;
  openImportDialog: () => void;
  openAboutDialog: () => void;
}

export function useMenuShortcuts(
  mostRecentSave: SavedGame | null,
  handlers: ShortcutHandlers
) {
  const { 
    registerShortcut, 
    handleNewGame, 
    handleContinue, 
    handleShowExport,
    openLoadDialog,
    openImportDialog,
    openAboutDialog
  } = handlers;

  // Setup keyboard shortcuts
  useEffect(() => {
    const shortcuts = [
      { key: 'n', action: handleNewGame, description: 'New Game' },
      { key: 'c', action: () => mostRecentSave && handleContinue(), description: 'Continue' },
      { key: 'l', action: openLoadDialog, description: 'Load Game' },
      { key: 'i', action: openImportDialog, description: 'Import' },
      { key: 'e', action: () => mostRecentSave && handleShowExport(), description: 'Export' },
      { key: 'a', action: openAboutDialog, description: 'About' }
    ];

    // Register all shortcuts
    const unregisterFunctions = shortcuts.map(shortcut => 
      registerShortcut({
        key: shortcut.key,
        action: shortcut.action,
        description: shortcut.description
      })
    );

    // Cleanup function to unregister all shortcuts
    return () => {
      unregisterFunctions.forEach(unregister => unregister());
    };
  }, [
    registerShortcut,
    mostRecentSave,
    handleNewGame,
    handleContinue,
    handleShowExport,
    openLoadDialog,
    openImportDialog,
    openAboutDialog
  ]);

  // Return the keyboard shortcut info for the footer
  return [
    { key: 'N', description: 'New Game' },
    { key: 'C', description: 'Continue' },
    { key: 'L', description: 'Load Game' },
    { key: 'I', description: 'Import' },
    { key: 'E', description: 'Export' },
    { key: 'A', description: 'About' }
  ];
}
