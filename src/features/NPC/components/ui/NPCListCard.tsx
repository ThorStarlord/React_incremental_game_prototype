/**
 * @file NPCListCard.tsx
 * @description Dumb UI component for displaying a single NPC in a card format.
 */
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { Person, LocationOn, Favorite, Star } from '@mui/icons-material';
import { NPC } from '../../state/NPCTypes';
import { getRelationshipTier as getCentralRelationshipTier } from '../../../../config/relationshipConstants';

interface NPCListCardProps {
  npc: NPC;
  onSelectNPC: (npcId: string) => void;
  isSelected: boolean;
}

export const NPCListCard: React.FC<NPCListCardProps> = React.memo(({ npc, onSelectNPC, isSelected }) => {
  const currentTier = getCentralRelationshipTier(npc.affinity);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={npc.id}>
      <Card
        sx={{
          height: '100%',
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? 'primary.main' : 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.light',
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
        onClick={() => onSelectNPC(npc.id)}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: npc.isAvailable ? 'success.light' : 'grey.500', mr: 2 }}>
              {npc.avatar ? <img src={npc.avatar} alt={npc.name} style={{ width: '100%', height: '100%' }} /> : <Person />}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>{npc.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" noWrap>{npc.location}</Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {npc.description || 'No description available.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentTier && (
              <Chip
                size="small"
                label={currentTier.name}
                icon={<Favorite fontSize="small" />}
                sx={{ backgroundColor: currentTier.color, color: '#fff' }}
              />
            )}
            <Chip
              icon={<Star fontSize="small" />}
              label={`${npc.connectionDepth}`}
              size="small"
              variant="outlined"
              title={`Connection Depth: ${npc.connectionDepth}`}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
});

NPCListCard.displayName = 'NPCListCard';