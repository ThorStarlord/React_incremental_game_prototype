import React from 'react';
import { Box, Typography, Avatar, Chip, LinearProgress } from '@mui/material';

/**
 * Interface for relationship tier information
 */
interface RelationshipTier {
  /** Name of the relationship tier */
  name: string;
  /** Color associated with this tier */
  color: string;
  /** Threshold value for this tier */
  threshold: number;
}

/**
 * Interface for NPC data
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Optional title (e.g., "the Wise") */
  title?: string;
  /** Description of the NPC */
  description?: string;
  /** Avatar or portrait image URL */
  portrait?: string;
  /** Type or profession of NPC */
  type?: string;
  /** Location where the NPC can be found */
  location?: string;
  /** Additional NPC properties */
  [key: string]: any;
}

/**
 * Interface for NPCHeader component props
 */
interface NPCHeaderProps {
  /** NPC data object */
  npc: NPC;
  /** Current relationship tier information */
  relationshipTier: RelationshipTier;
  /** Numeric relationship value (0-100) */
  relationship: number;
}

/**
 * Component that displays the NPC's avatar, name, title, relationship status, and other key information
 * at the top of the NPCPanel.
 * 
 * @param props - Component props
 * @param props.npc - NPC data object containing id, name, title, description, etc.
 * @param props.relationshipTier - Current relationship tier info with color, name
 * @param props.relationship - Numerical relationship value (0-100)
 * @returns Rendered NPCHeader component
 */
const NPCHeader: React.FC<NPCHeaderProps> = ({ npc, relationshipTier, relationship }) => {
  /**
   * Calculate the progress to the next relationship tier
   * @param currentValue - Current relationship value
   * @returns The threshold for the next tier
   */
  const getNextTierThreshold = (currentValue: number): number => {
    // Implementation would go here
    // For example:
    const tiers = [0, 25, 50, 75, 100];
    for (const tier of tiers) {
      if (tier > currentValue) return tier;
    }
    return 100; // Max value if already at highest tier
  };

  const nextTierThreshold = getNextTierThreshold(relationship);
  const prevTierThreshold = nextTierThreshold - 25;
  const progress = ((relationship - prevTierThreshold) / (nextTierThreshold - prevTierThreshold)) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar
          src={npc.portrait}
          alt={npc.name}
          sx={{ 
            width: 64, 
            height: 64, 
            mr: 2,
            border: `2px solid ${relationshipTier.color}`
          }}
        />
        
        <Box>
          <Typography variant="h6" component="h2">
            {npc.name}
            {npc.title && (
              <Typography variant="subtitle1" component="span" color="text.secondary">
                {" "}{npc.title}
              </Typography>
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Chip 
              label={relationshipTier.name} 
              size="small" 
              sx={{ 
                mr: 1,
                bgcolor: relationshipTier.color,
                color: 'white',
              }}
            />
            
            {npc.type && (
              <Chip 
                label={npc.type} 
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        {npc.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {npc.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="body2">Relationship:</Typography>
          <Typography variant="body2">{relationship}/100</Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{ 
            height: 6, 
            borderRadius: 1,
            bgcolor: 'background.paper',
            '& .MuiLinearProgress-bar': {
              bgcolor: relationshipTier.color
            }
          }}
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {nextTierThreshold > relationship ? 
            `${nextTierThreshold - relationship} more points to next tier` : 
            'Maximum relationship level reached'}
        </Typography>
      </Box>
    </Box>
  );
};

export default NPCHeader;
