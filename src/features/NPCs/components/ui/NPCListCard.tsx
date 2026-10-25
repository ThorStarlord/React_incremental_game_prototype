/**
 * @file NPCListCard.tsx
 * @description Dumb UI component for displaying a single NPC in a card format.
 */
import React from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { LocationOn, Favorite, Star } from '@mui/icons-material';
import { NPC } from '../../state/NPCTypes';
import { getRelationshipTier as getCentralRelationshipTier } from '../../../../config/relationshipConstants';
import NPCPortrait from './NPCPortrait';

interface NPCListCardProps {
  npc: NPC;
  onSelectNPC: (npcId: string) => void;
  isSelected: boolean;
  isGlowing?: boolean;
  connectionLevel?: number;
  bondLabel?: string;
  /** Known authored world anchor or an explicitly unconfirmed story setting. */
  locationLabel?: string;
}

export const NPCListCard: React.FC<NPCListCardProps> = React.memo(({ npc, onSelectNPC, isSelected, isGlowing, connectionLevel, bondLabel, locationLabel }) => {
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
          boxShadow: isGlowing ? '0 0 0 0 rgba(255,255,255,0.7)' : undefined,
          animation: isGlowing ? 'glowPulse 2s infinite' : undefined,
          '&:hover': {
            borderColor: 'primary.light',
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
          '@keyframes glowPulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(255,255,255,0.5)' },
            '70%': { boxShadow: '0 0 12px 4px rgba(255,255,255,0.2)' },
            '100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0)' },
          },
        }}
      >
        <CardActionArea
          onClick={() => onSelectNPC(npc.id)}
          aria-label={`Open ${npc.name}`}
          aria-current={isSelected ? 'page' : undefined}
          sx={{ height: '100%' }}
        >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ mr: 2 }}><NPCPortrait npc={npc} size={52} /></Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>{npc.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                <LocationOn fontSize="small" />
                <Typography variant="body2" noWrap title={locationLabel ?? npc.location}>{locationLabel ?? npc.location}</Typography>
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {npc.description || 'No description available.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {bondLabel ? (
              <Chip size="small" label={bondLabel} variant="outlined" color="primary" />
            ) : currentTier && (
              <Chip
                size="small"
                label={currentTier.name}
                icon={<Favorite fontSize="small" />}
                sx={{ backgroundColor: currentTier.color, color: '#fff' }}
              />
            )}
            <Chip
              icon={<Star fontSize="small" />}
              label={`${connectionLevel ?? npc.connectionDepth ?? 0}`}
              size="small"
              variant="outlined"
              title={`Connection Level: ${connectionLevel ?? npc.connectionDepth ?? 0}`}
            />
          </Box>
        </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
});

NPCListCard.displayName = 'NPCListCard';