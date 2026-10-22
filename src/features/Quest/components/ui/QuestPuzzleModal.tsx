import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import { QuestObjective } from '../../state/QuestTypes';

interface QuestPuzzleModalProps {
  open: boolean;
  onClose: () => void;
  objective: QuestObjective | null;
  onSolve: (solution: string) => void;
}

/** A fresh puzzle attempt must never inherit input from another objective or reopening. */
const QuestPuzzleModal: React.FC<QuestPuzzleModalProps> = ({ open, onClose, objective, onSolve }) => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  useEffect(() => {
    setInputSequence([]);
  }, [open, objective?.objectiveId]);

  if (!open || !objective || !objective.puzzleData) return null;

  const { puzzleData } = objective;
  const submit = () => {
    if (inputSequence.length > 0) onSolve(inputSequence.join(','));
  };
  const close = () => {
    setInputSequence([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm" aria-labelledby="quest-puzzle-title">
      <DialogTitle id="quest-puzzle-title">{puzzleData.prompt}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Choose the sequence. You can undo or clear an accidental selection before submitting.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
          {puzzleData.options.map((option) => (
            <Button key={option} onClick={() => setInputSequence(current => [...current, option])} variant="outlined" sx={{ m: 0.5 }}>
              {option}
            </Button>
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary" role="status" aria-live="polite">
          Current Sequence: {inputSequence.length ? inputSequence.join(', ') : 'none selected'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap' }}>
        <Button onClick={() => setInputSequence(current => current.slice(0, -1))} disabled={inputSequence.length === 0}>Undo</Button>
        <Button onClick={() => setInputSequence([])} disabled={inputSequence.length === 0}>Clear</Button>
        <Button onClick={submit} variant="contained" color="primary" disabled={inputSequence.length === 0}>Submit</Button>
        <Button onClick={() => onSolve('force')} variant="contained" color="secondary">Force It</Button>
        <Button onClick={close} variant="text">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestPuzzleModal;
