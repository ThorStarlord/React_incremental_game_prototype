import React, { useEffect, useRef, useState } from 'react';
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
  onCopyToClipboard: () => Promise<void> | void;
}

export function ExportDialog({
  isOpen,
  exportCode,
  onClose,
  onCopyToClipboard
}: ExportDialogProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const copyAttempt = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Closing/reopening the dialog or exporting a new save invalidates the
  // previous attempt; a delayed clipboard result cannot claim new success.
  useEffect(() => {
    copyAttempt.current += 1;
    setCopyState('idle');
    if (resetTimer.current) clearTimeout(resetTimer.current);
    return () => {
      copyAttempt.current += 1;
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [isOpen, exportCode]);

  const handleCopy = async () => {
    if (copyState === 'copying') return;
    const attempt = ++copyAttempt.current;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setCopyState('copying');

    try {
      await onCopyToClipboard();
      if (copyAttempt.current !== attempt) return;
      setCopyState('copied');
      resetTimer.current = setTimeout(() => {
        if (copyAttempt.current === attempt) setCopyState('idle');
      }, 2000);
    } catch {
      if (copyAttempt.current === attempt) setCopyState('failed');
    }
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
        {copyState === 'failed' && (
          <Typography role="alert" color="error" variant="body2" sx={{ mt: 1 }}>
            Could not copy automatically. Select and copy the save code manually.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCopy} disabled={copyState === 'copying'}>
          {copyState === 'copied' ? 'Copied!' : copyState === 'copying' ? 'Copying...' : 'Copy'}
        </Button>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
