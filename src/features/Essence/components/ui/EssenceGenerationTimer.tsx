import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Chip } from '@mui/material';
import { Speed as SpeedIcon, Timer as TimerIcon } from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import { selectGenerationRate, selectNpcConnections } from '../../state/EssenceSelectors';

/**
 * EssenceGenerationTimer - Passive generation tracking component
 * 
 * Displays the current passive essence generation rate, progress indicators,
 * and information about NPC connections contributing to generation.
 */
export const EssenceGenerationTimer: React.FC = React.memo(() => {
  const generationRate = useAppSelector(selectGenerationRate);
  const npcConnections = useAppSelector(selectNpcConnections);
  const [progress, setProgress] = useState(0);

  // Simulate generation progress (resets every second)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + (100 / 10); // Update 10 times per second
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const formatRate = (rate: number): string => {
    if (rate === 0) return '0';
    if (rate < 0.01) return '<0.01';
    return rate.toFixed(2);
  };

  return (
    <Card
      sx={{
        minWidth: 280,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.dark}15, ${theme.palette.secondary.dark}15)`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SpeedIcon color="primary" />
          <Typography variant="h6" color="primary">
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
            label={`${npcConnections} connections`}
            color={npcConnections > 0 ? 'info' : 'default'}
            variant="outlined"
            size="small"
          />
        </Box>

        {generationRate === 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}
          >
            Establish NPC connections to begin passive generation
          </Typography>
        )}
      </CardContent>
    </Card>
  );
});

EssenceGenerationTimer.displayName = 'EssenceGenerationTimer';
