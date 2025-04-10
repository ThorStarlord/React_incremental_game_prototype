import React from 'react';
import styles from './index.module.css';

// Custom hooks
import { useSavedGames } from '../../hooks/useSavedGames';
import { useGameImportExport } from '../../hooks/useGameImportExport';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useDialogManager } from './hooks/useDialogManager';
import { useGameActions } from './hooks/useGameActions';
import { useMenuShortcuts } from './hooks/useMenuShortcuts';

// UI components
import { MainMenuTitle } from './components/MainMenuTitle';
import { MainMenuButtonList } from './components/MainMenuButtonList';
import { VersionFooter } from './components/VersionFooter';
import { DialogsContainer } from './components/DialogsContainer';

const APP_VERSION = '0.1.0';

/**
 * MainMenu Component
 * 
 * Entry point of the application, displaying the main menu with options to:
 * - Start a new game
 * - Continue from the most recent save
 * - Load a saved game
 * - Import/Export saved games
 * - View about information
 */
const MainMenu: React.FC = () => {
  // Game data and state hooks
  const { 
    savedGames, 
    isLoading: isSavedGamesLoading, 
    loadSavedGames, 
    findMostRecentSave, 
    deleteSave 
  } = useSavedGames();

  const { 
    exportCode, 
    importCode, 
    setImportCode, 
    isLoading: isImportExportLoading, 
    exportSave, 
    importSave 
  } = useGameImportExport();

  const { registerShortcut } = useKeyboardShortcuts();
  
  // Dialog management
  const {
    dialogState,
    openDialog,
    closeDialog,
    saveToDelete,
    handleDeleteRequest,
    clearDeleteTarget
  } = useDialogManager();
  
  // Computed values
  const isLoading = isSavedGamesLoading || isImportExportLoading;
  const mostRecentSave = findMostRecentSave();

  // Game actions
  const {
    handleNewGame,
    handleContinue,
    handleLoadGame,
    handleShowExport,
    handleCopyToClipboard,
    handleImport,
    handleDeleteConfirm
  } = useGameActions({
    mostRecentSave,
    exportSave,
    importSave,
    deleteSave,
    loadSavedGames,
    openDialog,
    closeDialog,
    clearDeleteTarget
  });

  // Keyboard shortcuts
  const shortcutInfo = useMenuShortcuts(mostRecentSave, {
    registerShortcut,
    handleNewGame,
    handleContinue,
    handleShowExport,
    openLoadDialog: () => openDialog('loadDialog'),
    openImportDialog: () => openDialog('importDialog'),
    openAboutDialog: () => openDialog('aboutDialog')
  });

  // This file must remain .tsx since it contains JSX like:
  return (
    <div className={styles.mainContainer}>
      <div className={styles.overlayGradient} />
      
      <div className={styles.contentContainer}>
        {/* Main UI Components */}
        <MainMenuTitle 
          title="Incremental RPG" 
          subtitle="Build your character, explore the world" 
        />
        
        <MainMenuButtonList
          mostRecentSave={mostRecentSave}
          isLoading={isLoading}
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onLoadGame={() => openDialog('loadDialog')}
          onImport={() => openDialog('importDialog')}
          onExport={handleShowExport}
          onAbout={() => openDialog('aboutDialog')}
        />
        
        <VersionFooter version={APP_VERSION} shortcuts={shortcutInfo} />
      </div>
      
      {/* Dialog Components */}
      <DialogsContainer 
        dialogState={dialogState}
        savedGames={savedGames}
        isLoading={isLoading}
        saveToDelete={saveToDelete}
        exportCode={exportCode}
        importCode={importCode}
        appVersion={APP_VERSION}
        setImportCode={setImportCode}
        onLoadGame={handleLoadGame}
        onDeleteRequest={handleDeleteRequest}
        onDeleteConfirm={handleDeleteConfirm}
        onCloseDialog={closeDialog}
        onImport={handleImport}
        onCopyToClipboard={handleCopyToClipboard}
        clearDeleteTarget={clearDeleteTarget}
      />
    </div>
  );
};

export default MainMenu;
