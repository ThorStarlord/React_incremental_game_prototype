import React from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImportDialogProps {
  isOpen: boolean;
  importCode: string;
  setImportCode: (code: string) => void;
  isLoading: boolean;
  errorMessage?: string;
  onImport: () => void;
  onClose: () => void;
}

export function ImportDialog({
  isOpen,
  importCode,
  setImportCode,
  isLoading,
  errorMessage,
  onImport,
  onClose
}: ImportDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="import-save-title" fullWidth maxWidth="sm">
      <DialogTitle id="import-save-title" sx={{ pr: 6 }}>Import Save</DialogTitle>
      <IconButton
        onClick={onClose}
        aria-label="Close import dialog"
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography component="label" htmlFor="import-save-code" variant="body2" sx={{ display: 'block', mb: 1 }}>
          Paste your save code below to import:
        </Typography>
        <TextField
          id="import-save-code"
          multiline
          minRows={5}
          fullWidth
          value={importCode}
          onChange={(e) => setImportCode(e.target.value)}
          placeholder="Paste your import code here..."
          inputProps={{
            'aria-describedby': errorMessage ? 'import-save-error' : undefined,
            style: { fontFamily: 'monospace', fontSize: '0.85rem' },
          }}
        />

        {errorMessage && (
          <Alert id="import-save-error" role="alert" severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onImport}
          disabled={isLoading || !importCode.trim()}
        >
          {isLoading ? 'Importing...' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
