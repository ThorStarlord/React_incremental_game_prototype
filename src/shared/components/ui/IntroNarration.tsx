import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setHasSeenIntro, selectHasSeenIntro } from '../../../features/Meta/state/MetaSlice';

export const DEFAULT_INTRO_LINES = [
  'The wreck left you with little: a working body, a quiet reserve of Essence, and no history anyone else can trust.',
  'One presence remains close enough to answer. Elder Willow has seen the damage beneath the visible fractures.',
  'Speak with her first. Ask a question, make a choice, and watch what the choice leaves behind in your relationship and your next options.',
  'Your first task is simple: find the pattern Willow is pointing toward. The way you respond will become part of what the world remembers.'
];

export const IntroNarration: React.FC<{ lines?: string[] }> = ({ lines = DEFAULT_INTRO_LINES }) => {
  const dispatch = useAppDispatch();
  const hasSeen = useAppSelector(selectHasSeenIntro);
  const [index, setIndex] = useState(0);
  if (hasSeen) return null;
  const last = index === lines.length - 1;
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      disableEscapeKeyDown
      aria-describedby="intro-narration-text"
      sx={{
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Typography
          id="intro-narration-text"
          variant="body1"
          sx={{ mb: 3, whiteSpace: 'pre-line' }}
        >
          {lines[index]}
        </Typography>
        <Box textAlign="right">
          <Button
            autoFocus
            variant="contained"
            color={last ? 'secondary' : 'primary'}
            onClick={() => {
              if (!last) setIndex(i => i + 1); else dispatch(setHasSeenIntro(true));
            }}
          >
            {last ? 'Begin' : 'Continue'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default IntroNarration;
