/**
 * @file NPCHeader.tsx
 * @description Header component displaying NPC basic information and relationship status
 */

import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import type { NPC } from '../../state/NPCTypes';
// Import getTierBenefits for comprehensive tier information
import { getTierBenefits, RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants'; 

interface NPCHeaderProps {
  npc: NPC;
}

const NPCHeader: React.FC<NPCHeaderProps> = ({ npc }) => {
  const currentTierInfo = getTierBenefits(npc.relationshipValue);
  const currentTierName = currentTierInfo.name;
  
  let pointsInCurrentTier = 0;
  let totalPointsInTier = 0;
  let progressPercentageInTier = 0;
  let progressLabel = `${currentTierName}`;

  if (currentTierInfo.nextTier) {
    const currentTierMin = currentTierInfo.threshold; // Min value of current tier
    const nextTierMin = currentTierInfo.nextTier.threshold; // Min value of next tier (start of next tier)
    
    pointsInCurrentTier = npc.relationshipValue - currentTierMin;
    totalPointsInTier = nextTierMin - currentTierMin;

    if (totalPointsInTier > 0) {
      progressPercentageInTier = Math.max(0, Math.min(100, (pointsInCurrentTier / totalPointsInTier) * 100));
    } else { // Should only happen if tiers are not defined correctly or at max tier with no next
      progressPercentageInTier = 100;
    }
    progressLabel = `To ${currentTierInfo.nextTier.name}: ${pointsInCurrentTier} / ${totalPointsInTier} Affinity`;
  } else {
    // At the highest tier
    progressPercentageInTier = 100;
    progressLabel = `${currentTierName} (Max)`;
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        {/* Avatar */}
        <Avatar
          sx={{ 
            width: 80, 
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {npc.avatar ? (
            <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} />
          ) : (
            <PersonIcon fontSize="large" />
          )}
        </Avatar>

        {/* Main Info */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {npc.name}
          </Typography>
          
          {npc.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {npc.description}
            </Typography>
          )}

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {npc.location}
            </Typography>
          </Box>

          {/* Status Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={npc.isAvailable ? 'Available' : 'Busy'}
              color={npc.isAvailable ? 'success' : 'default'}
              size="small"
            />
            <Chip
              label={npc.status}
              variant="outlined"
              size="small"
            />
            {npc.faction && (
              <Chip
                label={npc.faction}
                variant="outlined"
                size="small"
                color="primary"
              />
            )}
          </Box>
        </Box>

        {/* Relationship Info */}
        <Box sx={{ minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FavoriteIcon color="action" />
            <Typography variant="subtitle2">
              Relationship
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Chip
              label={currentTierName}
              size="small"
              sx={{ backgroundColor: currentTierInfo.color, color: '#fff' }} 
            />
            {/* Removed the raw "Level X/100" display */}
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentageInTier}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'action.hover', 
              '& .MuiLinearProgress-bar': {
                backgroundColor: currentTierInfo.color, 
              },
              mb: 0.5 // Add some margin below progress bar
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
            {progressLabel}
          </Typography>

          {npc.connectionDepth !== undefined && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Connection Depth: {npc.connectionDepth.toFixed(1)}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default React.memo(NPCHeader);
