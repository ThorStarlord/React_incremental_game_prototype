import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SimpleLogEntry } from '../../../../../context/types/combat/simpleLogging';

interface BattleLogProps {
  log: SimpleLogEntry[];
}

/**
 * BattleLog Component
 * 
 * Displays a scrollable list of combat events.
 */
const BattleLog: React.FC<BattleLogProps> = ({ log = [] }) => {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log.length]);
  
  // Get text color based on log entry type
  const getTextColor = (type: string) => {
    switch (type) {
      case 'damage':
        return 'error.main';
      case 'heal':
        return 'success.main';
      case 'critical':
        return 'error.dark';
      case 'skill':
        return 'primary.main';
      case 'item':
        return 'info.main';
      case 'victory':
        return 'success.main';
      case 'defeat':
        return 'error.main';
      case 'flee':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };
  
  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 1, 
        mb: 2, 
        height: 120,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ mb: 0.5 }}>
        Combat Log
      </Typography>
      
      <Box 
        ref={logRef}
        sx={{ 
          flex: 1,
          overflow: 'auto',
          maxHeight: '100%',
          fontSize: '0.875rem'
        }}
      >
        {log.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            The battle begins...
          </Typography>
        ) : (
          log.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ 
                mb: 0.5,
                color: getTextColor(entry.type),
                fontWeight: entry.importance === 'high' ? 'bold' : 'normal'
              }}
            >
              {entry.message}
            </Typography>
          ))
        )}
      </Box>
    </Paper>
  );
};

export default BattleLog;
