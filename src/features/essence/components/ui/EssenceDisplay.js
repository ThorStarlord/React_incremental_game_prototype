import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress, Tooltip, Paper } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { GameStateContext, GameDispatchContext, createEssenceAction } from '../context/GameStateContext';
import { UPDATE_INTERVALS } from '../config/gameConstants';
import useThemeUtils from '../hooks/useThemeUtils';
import EssenceGenerationTimer from './EssenceGenerationTimer';
import useEssenceGeneration from '../hooks/useEssenceGeneration';

const EssenceDisplay = () => {
  const { essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { getProgressColor } = useThemeUtils();
  const { totalRate, npcContributions } = useEssenceGeneration();
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastEssence, setLastEssence] = useState(essence);

  useEffect(() => {
    if (essence !== lastEssence) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      setLastEssence(essence);
      return () => clearTimeout(timer);
    }
  }, [essence, lastEssence]);

  const maxStorableEssence = 1000;
  const essencePercentage = (essence / maxStorableEssence) * 100;

  const handleBasicEssenceGain = () => {
    dispatch(createEssenceAction.gain(5));
  };

  const formatTime = (ms) => `${ms / 1000} seconds`;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: showAnimation ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AutoGraphIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Essence
        </Typography>
      </Box>

      <Tooltip 
        title={
          <Box>
            <Typography variant="body2">{essence}/{maxStorableEssence} Essence</Typography>
            {npcContributions.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Generation Rate: +{totalRate} per {formatTime(UPDATE_INTERVALS.ESSENCE_GENERATION)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sources:
                </Typography>
                {npcContributions.map((contribution, index) => (
                  <Typography key={index} variant="body2">
                    • {contribution.name}: +{contribution.rate}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        }
        placement="top"
        arrow
      >
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={essencePercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(essence, maxStorableEssence),
                transition: 'transform 0.4s ease'
              }
            }}
          />
        </Box>
      </Tooltip>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body1">
            {essence.toLocaleString()} / {maxStorableEssence.toLocaleString()}
          </Typography>
          {totalRate > 0 && (
            <Typography variant="caption" color="success.main">
              +{totalRate}/cycle
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={handleBasicEssenceGain}
          sx={{
            minWidth: 120,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Meditate (+5)
        </Button>
      </Box>

      <EssenceGenerationTimer rate={totalRate} />

      {showAnimation && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: essence > lastEssence ? 'success.main' : 'error.main',
            animation: 'fadeOut 1s forwards',
            '@keyframes fadeOut': {
              '0%': { opacity: 1, transform: 'translate(-50%, -50%)' },
              '100%': { opacity: 0, transform: 'translate(-50%, -100%)' }
            }
          }}
        >
          <Typography variant="h6">
            {essence > lastEssence ? '+' : '-'}
            {Math.abs(essence - lastEssence)}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EssenceDisplay;