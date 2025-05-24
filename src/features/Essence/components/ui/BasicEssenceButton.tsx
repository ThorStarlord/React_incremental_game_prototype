import React, { useCallback } from 'react';
import { Button, Chip, Box, Typography, useTheme } from '@mui/material';
import { TouchApp as TouchAppIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { addManualEssence } from '../../state/EssenceSlice';
import { selectPerClick } from '../../state/EssenceSelectors';

/**
 * BasicEssenceButton - Manual essence generation component
 * 
 * Provides a button for manually generating essence, primarily used for
 * testing and prototyping the essence system. Displays the per-click
 * value and provides visual feedback on interaction.
 */
export const BasicEssenceButton: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const perClick = useAppSelector(selectPerClick);
  const theme = useTheme();

  const handleClick = useCallback(() => {
    dispatch(addManualEssence());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 2,
      }}
    >
      <Typography variant="h6" color="primary">
        Manual Generation
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<TouchAppIcon />}
        onClick={handleClick}
        sx={{
          minWidth: 200,
          py: 1.5,
          fontSize: '1.1rem',
          transition: theme.transitions.create(['transform', 'box-shadow']),
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme.shadows[8],
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        Generate Essence
      </Button>

      <Chip
        label={`+${perClick.toFixed(1)} per click`}
        color="secondary"
        size="small"
        sx={{
          fontWeight: 'medium',
        }}
      />
    </Box>
  );
});

BasicEssenceButton.displayName = 'BasicEssenceButton';
