import React, { useCallback } from 'react';
import { Button, Chip, Box, Typography, useTheme } from '@mui/material';
import { TouchApp as TouchAppIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectPerClickValue } from '../../state/EssenceSelectors';
import { generateEssenceManuallyThunk, processResonanceLevelThunk } from '../../state/EssenceThunks';

/**
 * ManualEssenceButton - Simplified manual essence generation component
 * 
 * Provides basic manual essence generation functionality for testing and prototyping.
 * Displays current per-click value and uses addManualEssence action.
 */
export const ManualEssenceButton: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const perClickValue = useAppSelector(selectPerClickValue);
  const theme = useTheme();

  const handleClick = useCallback(async () => {
    // FIXED: Pass the required `perClickValue` as an argument
    await dispatch(generateEssenceManuallyThunk(perClickValue));
    // After the state is updated, dispatch the thunk to check for resonance level up.
    dispatch(processResonanceLevelThunk());
  }, [dispatch, perClickValue]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 2,
        },
      }}
    >
      <Typography variant="h6" color="primary" textAlign="center">
        Manual Generation
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<TouchAppIcon />}
        onClick={handleClick}
        sx={{
          minWidth: 180,
          transition: 'transform 0.1s ease-in-out',
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        Generate Essence
      </Button>

      <Chip
        label={`+${perClickValue.toFixed(1)} per click`}
        color="secondary"
        size="small"
        sx={{
          fontWeight: 'medium',
          fontSize: '0.875rem',
        }}
      />
    </Box>
  );
});

ManualEssenceButton.displayName = 'ManualEssenceButton';

export default ManualEssenceButton;