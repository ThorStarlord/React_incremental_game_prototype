import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { StatusEffect } from '../../../../../context/types/combat';

interface StatusEffectsDisplayProps {
  effects: StatusEffect[];
}

/**
 * StatusEffectsDisplay Component
 * 
 * Displays active status effects as chips with tooltips.
 */
const StatusEffectsDisplay: React.FC<StatusEffectsDisplayProps> = ({ effects = [] }) => {
  if (!effects || effects.length === 0) {
    return null;
  }
  
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        Active Effects:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {effects.map(effect => (
          <Tooltip 
            key={effect.id} 
            title={
              <React.Fragment>
                <Typography variant="subtitle2">{effect.name}</Typography>
                <Typography variant="body2">{effect.description}</Typography>
                <Typography variant="caption">
                  {effect.duration} {effect.duration === 1 ? 'turn' : 'turns'} remaining
                </Typography>
              </React.Fragment>
            }
          >
            <Chip
              label={effect.name}
              size="small"
              color={effect.type === 'buff' ? 'success' : 'error'}
              variant="outlined"
              sx={{ m: 0.2 }}
            />
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default StatusEffectsDisplay;
