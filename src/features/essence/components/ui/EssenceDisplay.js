import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress, Tooltip, Paper, Fade } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { GameStateContext, GameDispatchContext, createEssenceAction } from '../../../../context/GameStateContext';
import { UPDATE_INTERVALS } from '../../../../constants/gameConstants';
import useThemeUtils from '../../../../shared/hooks/useThemeUtils';
import EssenceGenerationTimer from '../containers/EssenceGenerationTimer';
import useEssenceGeneration from '../../hooks/useEssenceGeneration';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * @component EssenceDisplay
 * @description Displays the player's current essence amount, generation rate, and provides 
 * interactive elements for manual essence collection. Includes visual feedback and tooltips
 * for enhanced user experience.
 * @returns {React.ReactElement} A component that displays essence information and controls
 */
const EssenceDisplay = () => {
  const { essence } = useContext(GameStateContext);
  const dispatch = useContext(GameDispatchContext);
  const { getProgressColor } = useThemeUtils();
  const { totalRate, npcContributions } = useEssenceGeneration();
  const [showAnimation, setShowAnimation] = useState(false);
  const [lastEssence, setLastEssence] = useState(essence);
  const [animationValue, setAnimationValue] = useState(0);
  
  // Constants for configuration
  const maxStorableEssence = 1000;
  const meditationGain = 5;

  // Format large numbers with abbreviations and decimal precision
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toLocaleString();
  };

  useEffect(() => {
    if (essence !== lastEssence) {
      setAnimationValue(essence - lastEssence);
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1000);
      setLastEssence(essence);
      return () => clearTimeout(timer);
    }
  }, [essence, lastEssence]);

  const essencePercentage = (essence / maxStorableEssence) * 100;
  
  // Calculate time until storage is full
  const timeToFull = totalRate > 0 
    ? Math.ceil((maxStorableEssence - essence) / totalRate) 
    : Infinity;

  // Format time in the most appropriate unit (seconds, minutes, or hours)
  const formatTimeToFull = (cycles) => {
    if (cycles === Infinity) return "∞";
    
    const seconds = cycles * (UPDATE_INTERVALS.ESSENCE_GENERATION / 1000);
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
    return `${Math.ceil(seconds / 3600)}h`;
  };

  const handleBasicEssenceGain = () => {
    dispatch(createEssenceAction.gain(meditationGain));
  };

  const formatTime = (ms) => `${ms / 1000} seconds`;

  const handleGenerateEssence = (amount) => {
    dispatch(createEssenceAction.gain(amount));
  };

  // Determine if storage is nearly full (>90%)
  const isNearlyFull = essencePercentage > 90;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: showAnimation ? 'scale(1.02)' : 'scale(1)',
        borderLeft: '4px solid', 
        borderColor: 'primary.main',
        background: isNearlyFull ? 'linear-gradient(to right, rgba(255,193,7,0.05), transparent)' : 'inherit',
      }}
      aria-label="Essence status panel"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <AutoGraphIcon sx={{ 
          mr: 1, 
          color: 'primary.main',
          animation: showAnimation ? 'pulse 0.5s ease-in-out' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          }
        }} />
        <Typography variant="h6" component="div">
          Essence
        </Typography>
        <Tooltip 
          title="Primary magical resource used for upgrades and abilities"
          arrow
        >
          <InfoOutlinedIcon sx={{ ml: 1, fontSize: '1rem', color: 'text.secondary', cursor: 'help' }} />
        </Tooltip>
      </Box>

      <Tooltip 
        title={
          <Box>
            <Typography variant="body2">{formatNumber(essence)}/{formatNumber(maxStorableEssence)} Essence</Typography>
            {npcContributions.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                  Generation Rate: +{formatNumber(totalRate)} per {formatTime(UPDATE_INTERVALS.ESSENCE_GENERATION)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sources:
                </Typography>
                {npcContributions.map((contribution, index) => (
                  <Typography key={index} variant="body2">
                    • {contribution.name}: +{formatNumber(contribution.rate)}
                  </Typography>
                ))}
                {totalRate > 0 && timeToFull < Infinity && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Storage full in: {formatTimeToFull(timeToFull)}
                  </Typography>
                )}
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
            value={essencePercentage > 100 ? 100 : essencePercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(essence, maxStorableEssence),
                transition: 'transform 0.4s ease',
                boxShadow: isNearlyFull ? '0 0 8px rgba(255,193,7,0.7)' : 'none',
              }
            }}
            aria-valuetext={`${Math.round(essencePercentage)}% of essence storage capacity`}
          />
        </Box>
      </Tooltip>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: 1
      }}>
        <Box>
          <Typography variant="body1" fontWeight="medium" sx={{ 
            color: isNearlyFull ? 'warning.dark' : 'text.primary',
            transition: 'color 0.3s ease'
          }}>
            <span aria-label="Current essence">{formatNumber(essence)}</span>
            <span aria-hidden="true"> / </span>
            <span aria-label="Maximum essence capacity">{formatNumber(maxStorableEssence)}</span>
          </Typography>
          {totalRate > 0 && (
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              +{formatNumber(totalRate)}/cycle
              {timeToFull < Infinity && (
                <span> • Full in {formatTimeToFull(timeToFull)}</span>
              )}
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
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #00B0D2 90%)',
            }
          }}
          aria-label={`Meditate to gain ${meditationGain} essence`}
        >
          Meditate (+{meditationGain})
        </Button>
      </Box>

      <EssenceGenerationTimer rate={totalRate} onGenerate={handleGenerateEssence} />

      <Fade in={showAnimation}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: animationValue > 0 ? 'success.main' : 'error.main',
            animation: 'fadeOut 1s forwards',
            '@keyframes fadeOut': {
              '0%': { opacity: 1, transform: 'translate(-50%, -50%)' },
              '100%': { opacity: 0, transform: 'translate(-50%, -100%)' }
            },
            fontWeight: 'bold',
            zIndex: 5,
            textShadow: '0 0 5px rgba(0,0,0,0.1)',
          }}
          role="status"
          aria-live="polite"
        >
          <Typography variant="h6">
            {animationValue > 0 ? '+' : ''}
            {formatNumber(Math.abs(animationValue))}
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
};

export default EssenceDisplay;