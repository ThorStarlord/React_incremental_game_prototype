import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from '@mui/material';
import { QuestObjective } from '../../state/QuestTypes';

interface QuestPuzzleModalProps {
  open: boolean;
  onClose: () => void;
  objective: QuestObjective | null;
  onSolve: (solution: string) => void;
}

const QuestPuzzleModal: React.FC<QuestPuzzleModalProps> = ({ open, onClose, objective, onSolve }) => {
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  if (!open || !objective || !objective.puzzleData) {
    return null;
  }

  const { puzzleData } = objective;

  const handleOptionClick = (option: string) => {
    setInputSequence([...inputSequence, option]);
  };

  const handleSubmit = () => {
    onSolve(inputSequence.join(','));
  };

  const handleForce = () => {
    onSolve('force');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{puzzleData.prompt}</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
          {puzzleData.options.map((option) => (
            <Button key={option} onClick={() => handleOptionClick(option)} variant="outlined" sx={{ m: 0.5 }}>
              {option}
            </Button>
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Current Sequence: {inputSequence.join(', ')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        <Button onClick={handleForce} variant="contained" color="secondary">Force It</Button>
        <Button onClick={onClose} variant="text">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestPuzzleModal;
