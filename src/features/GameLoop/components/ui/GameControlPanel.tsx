import React from 'react';
import { Box, Button, Slider, Typography, Paper } from '@mui/material';
import { PlayArrow, Pause, Stop, Speed } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { startGame, pauseGame, resumeGame, stopGame, setGameSpeed } from '../../state/GameLoopSlice';

export const GameControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const gameLoop = useAppSelector((state) => state.gameLoop);

  const handleStartGame = () => {
    dispatch(startGame());
  };

  const handlePauseResume = () => {
    if (gameLoop.isPaused) {
      dispatch(resumeGame());
    } else {
      dispatch(pauseGame());
    }
  };

  const handleStopGame = () => {
    dispatch(stopGame());
  };

  const handleSpeedChange = (_: Event, value: number | number[]) => {
    dispatch(setGameSpeed(value as number));
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Game Controls
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        {!gameLoop.isRunning ? (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStartGame}
            color="success"
          >
            Start Game
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              startIcon={gameLoop.isPaused ? <PlayArrow /> : <Pause />}
              onClick={handlePauseResume}
              color={gameLoop.isPaused ? "success" : "warning"}
            >
              {gameLoop.isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={handleStopGame}
              color="error"
            >
              Stop
            </Button>
          </>
        )}
      </Box>

      {gameLoop.isRunning && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Game Time: {formatTime(gameLoop.totalGameTime)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tick: {gameLoop.currentTick}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Speed />
        <Typography variant="body2" sx={{ minWidth: 80 }}>
          Speed: {gameLoop.gameSpeed.toFixed(1)}x
        </Typography>
        <Slider
          value={gameLoop.gameSpeed}
          onChange={handleSpeedChange}
          min={0.1}
          max={5.0}
          step={0.1}
          sx={{ flex: 1, maxWidth: 200 }}
          disabled={!gameLoop.isRunning}
        />
      </Box>
    </Paper>
  );
};
