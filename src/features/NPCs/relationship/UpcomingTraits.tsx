import React from 'react';
import { Box, Typography, Chip, Paper, List, ListItem, ListItemText } from '@mui/material';

/**
 * Interface for NPC trait requirements
 */
interface TraitRequirement {
  relationship: number;
  name?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Interface for NPC data
 */
interface NPC {
  id: string;
  name: string;
  availableTraits?: string[];
  traitRequirements?: Record<string, TraitRequirement>;
  [key: string]: any;
}

/**
 * Interface for relationship tier info
 */
interface RelationshipTier {
  name: string;
  color: string;
  threshold: number;
  benefits: string[];
  [key: string]: any;
}

/**
 * Interface for player data
 */
interface Player {
  acquiredTraits: string[];
  [key: string]: any;
}

/**
 * Interface for component props
 */
interface UpcomingTraitsProps {
  npc: NPC;
  nextTier: RelationshipTier | null;
  player: Player;
}

/**
 * Displays traits that will become available at the next relationship tier
 */
const UpcomingTraits: React.FC<UpcomingTraitsProps> = ({ npc, nextTier, player }) => {
  if (!nextTier || !npc.availableTraits || npc.availableTraits.length === 0) {
    return null;
  }

  // Make sure traitRequirements is defined
  const traitRequirements = npc.traitRequirements || {};
  
  // Filter traits that will be available at the next tier
  const upcomingTraits = npc.availableTraits.filter(traitId => {
    // Use proper type for the requirement with default values
    const traitConfig: TraitRequirement = traitRequirements[traitId] || { relationship: 0 };
    const requiredRelationship = traitConfig.relationship;
    
    return requiredRelationship >= nextTier.threshold && 
           !player.acquiredTraits.includes(traitId);
  });

  if (upcomingTraits.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Traits Unlocked at {nextTier.name} Tier:
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2 }}>
        <List dense disablePadding>
          {upcomingTraits.map(traitId => {
            const traitConfig = traitRequirements[traitId] || { relationship: 0 };
            
            return (
              <ListItem key={traitId} divider sx={{ py: 1 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="medium">
                        {traitConfig.name || traitId}
                      </Typography>
                      <Chip 
                        label="New" 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1, height: 20 }} 
                      />
                    </Box>
                  }
                  secondary={traitConfig.description || "A trait that can be learned from this NPC."}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default UpcomingTraits;
