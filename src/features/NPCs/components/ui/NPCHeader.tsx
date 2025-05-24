import React from 'react';
import { Box, Typography, Avatar, LinearProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';

import type { NpcState } from '../../state/NpcTypes';

interface NPCHeaderProps {
  npc: NpcState;
}

const NPCHeader: React.FC<NPCHeaderProps> = ({ npc }) => {
  // Calculate relationship progress to next level
  const currentLevel = Math.floor(npc.relationshipValue);
  const nextLevel = currentLevel + 1;
  const progressToNext = npc.relationshipValue - currentLevel;

  const getRelationshipColor = (value: number) => {
    if (value >= 4) return 'success';
    if (value >= 2) return 'warning';
    if (value >= 1) return 'info';
    return 'inherit';
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        {/* NPC Avatar */}
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: 'primary.main',
            fontSize: '1.5rem'
          }}
        >
          {npc.name.charAt(0).toUpperCase()}
        </Avatar>

        {/* NPC Info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" component="h2" noWrap>
            {npc.name}
          </Typography>
          
          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {npc.location}
            </Typography>
          </Box>

          {/* Status */}
          {npc.status && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Status: {npc.status}
            </Typography>
          )}

          {/* Relationship Progress */}
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <FavoriteIcon 
                fontSize="small" 
                color={getRelationshipColor(npc.relationshipValue)}
              />
              <Typography variant="body2">
                Relationship: {npc.relationshipValue.toFixed(1)}
              </Typography>
            </Box>
            
            {/* Progress bar to next level */}
            {currentLevel < 5 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Lv {currentLevel}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progressToNext * 100}
                  sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                  color={getRelationshipColor(npc.relationshipValue)}
                />
                <Typography variant="caption" color="text.secondary">
                  Lv {nextLevel}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(NPCHeader);
