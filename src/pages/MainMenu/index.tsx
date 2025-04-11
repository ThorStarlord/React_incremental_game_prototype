import React from 'react';
// Remove CSS module import
// import styles from './index.module.css'; 
// Import MUI components
import { Box, Container, CssBaseline } from '@mui/material'; 

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
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)', 
        color: 'white',
        p: 2,
      }}
    >
      <CssBaseline />
      
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7))', 
          zIndex: 1,
        }} 
      />
      
      <Container 
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Main UI Components */}
        <MainMenuTitle 
          title="Incremental RPG" 
          subtitle="Build your character, explore the world" 
          sx={{ mb: 4 }} 
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
        
        <VersionFooter 
          version={APP_VERSION} 
          shortcuts={shortcutInfo} 
          sx={{ mt: 4, width: '100%' }} 
        />
      </Container>
      
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
    </Box>
  );
};

export default MainMenu;
