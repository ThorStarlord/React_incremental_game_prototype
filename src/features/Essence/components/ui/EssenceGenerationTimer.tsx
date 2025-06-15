import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Chip } from '@mui/material';
import { Speed as SpeedIcon, Timer as TimerIcon } from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
// Corrected: Import the selector for the generation rate
import { selectGenerationRate } from '../../state/EssenceSelectors';
// Corrected: Import the new selector for connection count
import { selectActiveConnectionCount } from '../../../NPCs/state/NPCSelectors';

/**
 * EssenceGenerationTimer - Passive generation tracking component
 * 
 * Displays the current passive essence generation rate, progress indicators,
 * and information about NPC connections contributing to generation.
 */
export const EssenceGenerationTimer: React.FC = React.memo(() => {
  const generationRate = useAppSelector(selectGenerationRate);
  const npcConnections = useAppSelector(selectActiveConnectionCount);
  const [progress, setProgress] = useState(0);

  // Simulate generation progress (resets every second)
  useEffect(() => {
    // Don't run the progress bar if there's no generation
    if (generationRate <= 0) {
        setProgress(0);
        return;
    };
    
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10)); // Update 10 times per second
    }, 100);

    return () => clearInterval(interval);
  }, [generationRate]); // Rerun effect if generation rate changes

  const formatRate = (rate: number): string => {
    if (rate === 0) return '0.00';
    if (rate < 0.01) return '<0.01';
    return rate.toFixed(2);
  };

  return (
    <Card
      sx={{
        minWidth: 280,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
      }}
      variant="outlined"
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SpeedIcon color="primary" />
          <Typography variant="h6" color="text.primary">
            Passive Generation
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Generation Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: (theme) => theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: (theme) =>
                  `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<TimerIcon />}
            label={`${formatRate(generationRate)}/sec`}
            color={generationRate > 0 ? 'success' : 'default'}
            variant="outlined"
            size="small"
          />
          
          <Chip
            label={`${npcConnections} ${npcConnections === 1 ? 'connection' : 'connections'}`}
            color={npcConnections > 0 ? 'info' : 'default'}
            variant="outlined"
            size="small"
          />
        </Box>

        {generationRate <= ESSENCE_GENERATION.BASE_RATE_PER_SECOND && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}
          >
            Establish stronger NPC connections to increase passive generation.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

EssenceGenerationTimer.displayName = 'EssenceGenerationTimer';

// Need to add this constant for the check above
const ESSENCE_GENERATION = {
    BASE_RATE_PER_SECOND: 0.1,
};