import React, { useState } from 'react';
import {
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

interface ExportDialogProps {
  isOpen: boolean;
  exportCode: string;
  onClose: () => void;
  onCopyToClipboard: () => void;
}

export function ExportDialog({
  isOpen,
  exportCode,
  onClose,
  onCopyToClipboard
}: ExportDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopyToClipboard();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="export-save-title" fullWidth maxWidth="sm">
      <DialogTitle id="export-save-title" sx={{ pr: 6 }}>Export Save</DialogTitle>
      <IconButton
        onClick={onClose}
        aria-label="Close export dialog"
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography component="label" htmlFor="export-save-code" variant="body2" sx={{ display: 'block', mb: 1 }}>
          Copy this code to back up your save or transfer it to another device:
        </Typography>
        <TextField
          id="export-save-code"
          multiline
          minRows={5}
          maxRows={10}
          fullWidth
          value={exportCode}
          inputProps={{ readOnly: true, style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCopy}>{isCopied ? 'Copied!' : 'Copy'}</Button>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
