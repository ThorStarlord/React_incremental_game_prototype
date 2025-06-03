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
import { getRelationshipTier } from '../../../../config/relationshipConstants'; // Import centralized function

interface NPCHeaderProps {
  npc: NPC;
}

const NPCHeader: React.FC<NPCHeaderProps> = ({ npc }) => {
  // Local getRelationshipColor and getRelationshipLabel are removed.
  // We will use the tier information from getRelationshipTier.
  const currentRelationshipTier = getRelationshipTier(npc.relationshipValue);

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
              label={currentRelationshipTier.name}
              size="small"
              sx={{ backgroundColor: currentRelationshipTier.color, color: '#fff' }} // Use custom color
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Level {npc.relationshipValue}/100
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.max(0, (npc.relationshipValue + 100) / 200 * 100)} // Normalize value for progress bar if needed
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'action.hover', // Neutral track color
              '& .MuiLinearProgress-bar': {
                backgroundColor: currentRelationshipTier.color, // Custom bar color
              },
            }}
          />

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
