import React, { useState } from 'react';
import { Backdrop, Box, Paper, Typography, Button, Fade } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setHasSeenIntro, selectHasSeenIntro } from '../../../features/Meta/state/MetaSlice';

const defaultLines = [
  "Impact. Systems flicker. Memory fragments.",
  "Alone in the wreckage—only a single presence pulses faintly nearby.",
  "Connection is more than survival. It's momentum.",
  "Reach out. Understand. Let essence flow."
];

export const IntroNarration: React.FC<{ lines?: string[] }> = ({ lines = defaultLines }) => {
  const dispatch = useAppDispatch();
  const hasSeen = useAppSelector(selectHasSeenIntro);
  const [index, setIndex] = useState(0);
  if (hasSeen) return null;
  const last = index === lines.length - 1;
  return (
    <Backdrop open sx={{ zIndex: (t) => t.zIndex.drawer + 10, backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <Fade in>
        <Paper elevation={4} sx={{ maxWidth: 640, p: 4, mx: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
            {lines[index]}
          </Typography>
          <Box textAlign="right">
            <Button
              variant="contained"
              color={last ? 'secondary' : 'primary'}
              onClick={() => {
                if (!last) setIndex(i => i + 1); else dispatch(setHasSeenIntro(true));
              }}
            >
              {last ? 'Begin' : 'Continue'}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Backdrop>
  );
};

export default IntroNarration;