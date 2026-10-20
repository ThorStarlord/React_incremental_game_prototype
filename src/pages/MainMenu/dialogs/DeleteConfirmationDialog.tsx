import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  saveName?: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  saveName,
  isLoading,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} aria-labelledby="delete-save-title" maxWidth="xs" fullWidth>
      <DialogTitle id="delete-save-title">Delete Save</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {saveName ? <strong>"{saveName}"</strong> : 'this save'}?
          This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
