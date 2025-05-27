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

interface NPCHeaderProps {
  npc: NPC;
}

const NPCHeader: React.FC<NPCHeaderProps> = ({ npc }) => {
  const getRelationshipColor = (value: number): 'success' | 'info' | 'warning' | 'primary' => {
    if (value >= 75) return 'success';
    if (value >= 50) return 'info';
    if (value >= 25) return 'warning';
    return 'primary';
  };

  const getRelationshipLabel = (value: number) => {
    if (value >= 90) return 'Beloved';
    if (value >= 75) return 'Trusted';
    if (value >= 50) return 'Ally';
    if (value >= 25) return 'Friend';
    if (value >= 10) return 'Acquaintance';
    return 'Neutral';
  };

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
              label={getRelationshipLabel(npc.relationshipValue)}
              color={getRelationshipColor(npc.relationshipValue)}
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Level {npc.relationshipValue}/100
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={npc.relationshipValue}
            color={getRelationshipColor(npc.relationshipValue)}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.1)'
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
