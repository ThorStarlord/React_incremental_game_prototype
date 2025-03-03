import React from 'react';
import { Box, Typography, Avatar, Tooltip, Chip, LinearProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';

/**
 * @component NPCHeader
 * @description Displays the NPC's avatar, name, title, relationship status, and other key information
 * at the top of the NPCPanel.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.npc - NPC data object containing id, name, title, description, etc.
 * @param {Object} props.relationshipTier - Current relationship tier info with color, name
 * @param {number} props.relationship - Numerical relationship value (0-100)
 * @returns {JSX.Element} Rendered NPCHeader component
 */
const NPCHeader = ({ npc, relationshipTier, relationship }) => {
  // Calculate the progress to the next relationship tier
  const getNextTierThreshold = (currentValue) => {
    const tiers = [0, 25, 50, 75, 100];
    for (const threshold of tiers) {
      if (threshold > currentValue) {
        return threshold;
      }
    }
    return 100; // Max is 100
  };

  const nextTierThreshold = getNextTierThreshold(relationship);
  const prevTierThreshold = nextTierThreshold - 25;
  const progress = ((relationship - prevTierThreshold) / (nextTierThreshold - prevTierThreshold)) * 100;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* NPC Avatar */}
      <Avatar
        src={npc.avatar}
        alt={npc.name}
        sx={{ 
          width: 64, 
          height: 64,
          border: '2px solid',
          borderColor: relationshipTier.color
        }}
      >
        {!npc.avatar && <PersonIcon fontSize="large" />}
      </Avatar>
      
      {/* NPC Info */}
      <Box sx={{ ml: 2, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            {npc.name}
          </Typography>
          
          <Tooltip title={npc.description || "No description available"} arrow>
            <InfoIcon fontSize="small" sx={{ ml: 1, color: 'text.secondary', cursor: 'help' }} />
          </Tooltip>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {npc.title || npc.type || "Mysterious Character"}
        </Typography>
        
        {/* Relationship status */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            size="small"
            label={relationshipTier.name}
            sx={{
              backgroundColor: relationshipTier.color,
              color: '#fff',
              fontWeight: 'bold',
              mr: 1
            }}
          />
          
          <Box sx={{ flexGrow: 1, mr: 1 }}>
            <Tooltip title={`Relationship: ${relationship}/100 - Next tier at ${nextTierThreshold}`} arrow>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.300',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: relationshipTier.color,
                  }
                }}
              />
            </Tooltip>
          </Box>
          
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
            {relationship}/100
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default NPCHeader;
