import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { hexToRgb } from '../../../utils/relationshipUtils';

/**
 * Interface for relationship tier information
 */
interface RelationshipTier {
  /** Name of this relationship tier */
  name: string;
  /** Color for visually representing this tier */
  color: string;
  /** Minimum threshold to reach this tier */
  threshold: number;
}

/**
 * Interface for NPC trait requirement details
 */
interface TraitRequirement {
  /** Relationship level required for this trait */
  relationship: number;
  /** Other trait properties */
  [key: string]: any;
}

/**
 * Interface for an NPC with traits
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Available trait IDs this NPC offers */
  availableTraits?: string[];
  /** Requirements for each trait, indexed by trait ID */
  traitRequirements?: Record<string, TraitRequirement>;
}

/**
 * Interface for a player's trait data
 */
interface Player {
  /** List of trait IDs the player has acquired */
  acquiredTraits: string[];
}

/**
 * Interface for UpcomingTraits component props
 */
interface UpcomingTraitsProps {
  /** NPC to check for upcoming traits */
  npc: NPC;
  /** The next relationship tier */
  nextTier: RelationshipTier;
  /** Player data for comparing acquired traits */
  player: Player;
}

/**
 * Component that displays the traits that will be available at the next relationship tier
 * 
 * @param npc - The NPC to check for traits
 * @param nextTier - The next relationship tier info
 * @param player - Current player data
 * @returns Component displaying upcoming traits or null if none available
 */
const UpcomingTraits: React.FC<UpcomingTraitsProps> = ({ npc, nextTier, player }) => {
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
