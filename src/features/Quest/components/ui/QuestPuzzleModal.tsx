import React, { useEffect, useState } from 'react';
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import { QuestObjective } from '../../state/QuestTypes';

interface QuestPuzzleModalProps {
  open: boolean;
  onClose: () => void;
  objective: QuestObjective | null;
  onSolve: (solution: string) => Promise<boolean> | boolean | void;
  error?: string | null;
}

/** A fresh puzzle attempt must never inherit input from another objective or reopening. */
const QuestPuzzleModal: React.FC<QuestPuzzleModalProps> = ({ open, onClose, objective, onSolve, error }) => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [confirmForce, setConfirmForce] = useState(false);

  useEffect(() => {
    setInputSequence([]);
    setBusy(false);
    setConfirmForce(false);
  }, [open, objective?.objectiveId]);

  if (!open || !objective || !objective.puzzleData) return null;

  const { puzzleData } = objective;
  const submitSolution = async (solution: string) => {
    if (busy) return;
    setBusy(true);
    try {
      await onSolve(solution);
    } finally {
      setBusy(false);
    }
  };
  const submit = () => {
    if (inputSequence.length > 0) void submitSolution(inputSequence.join(','));
  };
  const forceOutcome = objective.outcomes?.find(outcome => outcome.solution === 'force');
  const forcedConsequences = forceOutcome
    ? [...forceOutcome.rewards.map(reward => `${reward.value} ${reward.type.toLowerCase()}`),
       ...forceOutcome.effects.map(effect => effect.value.replace(/_/g, ' '))]
    : [];

  const close = () => {
    setInputSequence([]);
    setConfirmForce(false);
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
        {error && <Alert severity="error" role="alert" sx={{ mt: 1 }}>{error}</Alert>}
        {confirmForce && forceOutcome && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Force It takes a different path and may have consequences. Check the known effects before choosing.
            {forcedConsequences.length > 0 && (
              <Typography variant="body2">Known effects: {forcedConsequences.join('; ')}.</Typography>
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button color="warning" variant="contained" disabled={busy} onClick={() => void submitSolution('force')}>Confirm Force It</Button>
              <Button disabled={busy} onClick={() => setConfirmForce(false)}>Cancel</Button>
            </Stack>
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap' }}>
        <Button onClick={() => setInputSequence(current => current.slice(0, -1))} disabled={inputSequence.length === 0}>Undo</Button>
        <Button onClick={() => setInputSequence([])} disabled={inputSequence.length === 0}>Clear</Button>
        <Button onClick={submit} variant="contained" color="primary" disabled={busy || inputSequence.length === 0}>Submit</Button>
        {forceOutcome && <Button onClick={() => setConfirmForce(true)} disabled={busy || confirmForce} variant="outlined" color="warning">Force It</Button>}
        <Button onClick={close} disabled={busy} variant="text">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestPuzzleModal;
