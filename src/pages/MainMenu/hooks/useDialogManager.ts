import { useState, useCallback } from 'react';

export interface DialogState {
  loadDialog: boolean;
  exportDialog: boolean;
  importDialog: boolean;
  aboutDialog: boolean;
  deleteDialog: boolean;
}

export interface SaveToDelete {
  id: string;
  name: string;
}

export function useDialogManager() {
  const [dialogState, setDialogState] = useState<DialogState>({
    loadDialog: false,
    exportDialog: false,
    importDialog: false,
    aboutDialog: false,
    deleteDialog: false
  });
  
  const [saveToDelete, setSaveToDelete] = useState<SaveToDelete | null>(null);
  
  const openDialog = useCallback((dialogName: keyof DialogState) => {
    setDialogState(prev => ({ ...prev, [dialogName]: true }));
  }, []);

  const closeDialog = useCallback((dialogName: keyof DialogState) => {
    setDialogState(prev => ({ ...prev, [dialogName]: false }));
  }, []);
  
  const handleDeleteRequest = useCallback((id: string, name: string) => {
    setSaveToDelete({ id, name });
    openDialog('deleteDialog');
  }, [openDialog]);
  
  const clearDeleteTarget = useCallback(() => {
    setSaveToDelete(null);
  }, []);
  
  return {
    dialogState,
    openDialog,
    closeDialog,
    saveToDelete,
    handleDeleteRequest,
    clearDeleteTarget
  };
}
