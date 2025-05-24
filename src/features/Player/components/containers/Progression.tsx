import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { RootState } from '../../../../app/store';
import { selectTraitSlots } from '../../../Traits/state/TraitsSlice';
import { selectPlayerStats } from '../../state/PlayerSelectors';

/**
 * Displays player progression information
 * Focuses on trait slots and other non-level based progression
 */
const Progression: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Use typed selectors to access state from slices
  const traitSlots = useAppSelector(state => state.player.traitSlots || 0);
  const equippedTraits = useAppSelector(state =>
    state.traits.slots
      .filter(slot => slot.isUnlocked && slot.traitId)
      .map(slot => slot.traitId as string)
  );
  const playerStats = useAppSelector(selectPlayerStats);

  // Mock progression data - replace with actual selectors when implemented
  const level = 1;
  const currentXP = 150;
  const xpToNextLevel = 1000;
  const xpProgress = (currentXP / xpToNextLevel) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Character Progression
        </Typography>
        
        <Box sx={{ marginBottom: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Level {level}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentXP} / {xpToNextLevel} XP
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={xpProgress}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: theme.palette.grey[300],
            }}
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', marginTop: 0.5 }}>
            {Math.round(xpProgress)}% to next level
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Continue playing to gain experience and level up!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Progression;
