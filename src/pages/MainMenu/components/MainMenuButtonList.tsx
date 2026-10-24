import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { type SavedGame } from '../../../hooks/useSavedGames';
// Update import path for formatting functions
import { formatPlaytime, formatSaveDate, formatSaveName } from '../../../shared/utils/formatUtils';

interface MainMenuButtonListProps {
  mostRecentSave: SavedGame | null;
  isLoading: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: () => void;
  onImport: () => void;
  onExport: () => void;
  onAbout: () => void;
}

const buttonSx = { py: 1.25, textTransform: 'none', fontSize: '1rem' } as const;

export function MainMenuButtonList({
  mostRecentSave,
  isLoading,
  onNewGame,
  onContinue,
  onLoadGame,
  onImport,
  onExport,
  onAbout
}: MainMenuButtonListProps) {
  return (
    <Stack spacing={1.5} sx={{ width: 280, mx: 'auto' }}>
      <Button variant="contained" color="primary" onClick={onNewGame} disabled={isLoading} sx={buttonSx}>
        New Game
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={onContinue}
        disabled={isLoading || !mostRecentSave}
        sx={{ ...buttonSx, flexDirection: 'column' }}
      >
        {mostRecentSave ? (
          <>
            Continue
            <Typography component="span" variant="caption" sx={{ display: 'block', opacity: 0.85, lineHeight: 1.4 }}>
              {formatSaveName(mostRecentSave.name)} • {formatPlaytime(mostRecentSave.playtime)}
              <br />
              {formatSaveDate(mostRecentSave.timestamp)}
            </Typography>
          </>
        ) : (
          'Continue (No Saves)'
        )}
      </Button>

      <Button variant="contained" color="secondary" onClick={onLoadGame} disabled={isLoading} sx={buttonSx}>
        Load Game
      </Button>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="outlined" color="inherit" onClick={onImport} disabled={isLoading} sx={{ ...buttonSx, flex: 1 }}>
          Import
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onExport}
          disabled={isLoading || !mostRecentSave}
          sx={{ ...buttonSx, flex: 1 }}
        >
          Export
        </Button>
      </Box>

      <Button variant="text" color="inherit" onClick={onAbout} disabled={isLoading} sx={buttonSx}>
        About
      </Button>
    </Stack>
  );
}
