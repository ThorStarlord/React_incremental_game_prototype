import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { hexToRgb } from '../../../utils/relationshipUtils';

const UpcomingTraits = ({ npc, nextTier, player }) => {
  // Get traits available from this NPC that require the next tier
  const upcomingTraits = npc.availableTraits?.filter(traitId => {
    const traitConfig = npc.traitRequirements?.[traitId] || {};
    const requiredRelationship = traitConfig.relationship || 0;
    
    return requiredRelationship >= nextTier?.threshold && 
           !player.acquiredTraits.includes(traitId);
  }) || [];
  
  if (upcomingTraits.length === 0) return null;
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Traits Available at Next Tier:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {upcomingTraits.map(traitId => (
          <Chip
            key={traitId}
            label={traitId}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ 
              borderColor: nextTier.color,
              color: nextTier.color,
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0.4)` },
                '70%': { boxShadow: `0 0 0 6px rgba(${hexToRgb(nextTier.color)}, 0)` },
                '100%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0)` }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UpcomingTraits;import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { hexToRgb } from '../../../utils/relationshipUtils';

const UpcomingTraits = ({ npc, nextTier, player }) => {
  // Get traits available from this NPC that require the next tier
  const upcomingTraits = npc.availableTraits?.filter(traitId => {
    const traitConfig = npc.traitRequirements?.[traitId] || {};
    const requiredRelationship = traitConfig.relationship || 0;
    
    return requiredRelationship >= nextTier?.threshold && 
           !player.acquiredTraits.includes(traitId);
  }) || [];
  
  if (upcomingTraits.length === 0) return null;
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Traits Available at Next Tier:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {upcomingTraits.map(traitId => (
          <Chip
            key={traitId}
            label={traitId}
            variant="outlined"
            color="primary"
            size="small"
            sx={{ 
              borderColor: nextTier.color,
              color: nextTier.color,
              animation: 'pulse 1.5s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0.4)` },
                '70%': { boxShadow: `0 0 0 6px rgba(${hexToRgb(nextTier.color)}, 0)` },
                '100%': { boxShadow: `0 0 0 0 rgba(${hexToRgb(nextTier.color)}, 0)` }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UpcomingTraits;