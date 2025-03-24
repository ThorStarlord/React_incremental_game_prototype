import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { SimpleLogEntry } from '../../../../context/types/combat/logging';

/**
 * Interface for BattleLog component props
 */
interface BattleLogProps {
  /** Array of log entries to display */
  logEntries: SimpleLogEntry[];
  /** Ref to the log container for scrolling */
  logRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * BattleLog Component
 * 
 * Displays a scrollable log of combat actions and events
 */
export const BattleLog: React.FC<BattleLogProps> = ({ logEntries = [], logRef }) => {
  /**
   * Get CSS class based on log entry type
   */
  const getEntryClass = (type: string): string => {
    switch (type) {
      case 'playerAttack':
      case 'attack':
        return 'player-attack';
      case 'enemyAttack':
      case 'damage':
        return 'enemy-attack';
      case 'critical':
        return 'critical-hit';
      case 'victory':
        return 'victory';
      case 'defeat':
        return 'defeat';
      case 'item':
        return 'item-use';
      case 'skill':
        return 'skill-use';
      default:
        return 'info';
    }
  };

  /**
   * Get text color based on log entry type
   */
  const getEntryColor = (type: string): string => {
    switch (type) {
      case 'playerAttack':
      case 'attack':
        return '#4caf50'; // Green
      case 'enemyAttack':
      case 'damage':
        return '#f44336'; // Red
      case 'critical':
        return '#ff9800'; // Orange
      case 'victory':
        return '#3f51b5'; // Indigo
      case 'defeat':
        return '#9c27b0'; // Purple
      case 'item':
        return '#2196f3'; // Blue
      case 'skill':
        return '#00bcd4'; // Cyan
      default:
        return 'inherit';
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: '100%',
        maxHeight: 400,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" component="h3" gutterBottom>
        Battle Log
      </Typography>
      <Divider sx={{ mb: 1 }} />
      
      <Box
        ref={logRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 1
        }}
      >
        {logEntries.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No combat actions yet.
          </Typography>
        ) : (
          logEntries.map((entry, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: entry.importance === 'high' ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                borderLeft: `3px solid ${getEntryColor(entry.type)}`,
              }}
            >
              <Typography
                variant="body2"
                color={getEntryColor(entry.type)}
                sx={{
                  fontWeight: entry.importance === 'high' ? 700 : 400,
                }}
              >
                {entry.message}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
};
