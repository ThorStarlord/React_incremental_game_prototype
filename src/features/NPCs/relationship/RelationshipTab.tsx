import React from 'react';
import { Box, Typography, LinearProgress, Divider, Chip, Tooltip } from '@mui/material';
import { getTierBenefits } from '../../../config/relationshipConstants';
import { canLearnTrait } from '../../../config/relationshipConstants';
import UpcomingTraits from './UpcomingTraits';
import RelationshipBenefits from './RelationshipBenefits';

/**
 * Interface for relationship tier information
 */
interface RelationshipTier {
  /** Name of the relationship tier */
  name: string;
  /** Color code for visual representation */
  color: string;
  /** Minimum threshold for this tier */
  threshold: number;
  /** Benefits provided at this tier */
  benefits: string[];
  /** Next tier information if applicable */
  nextTier?: RelationshipTier;
}

/**
 * Interface for relationship milestone marker
 */
interface MilestoneMarker {
  /** Position as percentage of progress bar (0-100) */
  position: number;
  /** Relationship value this milestone represents */
  value: number;
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
 * Interface for an NPC with relationship data
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Current relationship value with player */
  relationship: number;
  /** Available trait IDs this NPC offers */
  availableTraits?: string[];
  /** Requirements for each trait, indexed by trait ID */
  traitRequirements?: Record<string, TraitRequirement>;
  /** Name of the NPC */
  name: string;
  /** Type or role of the NPC */
  type?: string;
}

/**
 * Interface for player data
 */
interface Player {
  /** Traits the player has acquired */
  acquiredTraits: string[];
  /** Traits the player has seen */
  seenTraits?: string[];
}

/**
 * Interface for tutorial state
 */
interface Tutorial {
  /** Whether the relationship tutorial has been shown */
  relationshipShown?: boolean;
  /** Other tutorial properties */
  [key: string]: any;
}

/**
 * Interface for trait object
 */
interface Trait {
  /** Unique trait identifier */
  id: string;
  /** Display name of trait */
  name: string;
  /** Description of trait effects */
  description?: string;
  /** Other trait properties */
  [key: string]: any;
}

/**
 * Interface for RelationshipTab component props
 */
interface RelationshipTabProps {
  /** NPC to display relationship with */
  npc: NPC;
  /** Player data */
  player: Player;
  /** Function to handle relationship changes */
  onRelationshipChange: (npcId: string, amount: number) => void;
  /** Available traits the player has */
  playerTraits: string[];
  /** Redux dispatch function */
  dispatch: (action: any) => void;
  /** Tutorial state */
  tutorial: Tutorial;
  /** Trait definitions */
  traits: Record<string, Trait>;
}

/**
 * Helper function to calculate progress to the next tier
 * @param relationship - Current relationship value
 * @param currentTier - Current tier information
 * @param nextTier - Next tier information
 * @returns Percentage progress toward next tier (0-100)
 */
const calculateProgressToNextTier = (
  relationship: number, 
  currentTier: RelationshipTier, 
  nextTier: RelationshipTier | null
): number => {
  if (!nextTier) return 100; // Max progress if no next tier
  return ((relationship - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
};

/**
 * Helper function to convert hex to rgb for animation
 * @param hex - Hex color code
 * @returns RGB values as comma-separated string
 */
const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

/**
 * Component that displays and manages NPC relationship information
 * 
 * @param npc - The NPC to show relationship with
 * @param player - Player data
 * @param onRelationshipChange - Handler for relationship changes
 * @param playerTraits - Traits the player has acquired
 * @param dispatch - Redux dispatch function
 * @param tutorial - Tutorial state information
 * @param traits - Available trait definitions
 * @returns Component for displaying NPC relationship information
 */
const RelationshipTab: React.FC<RelationshipTabProps> = ({ 
  npc, 
  player, 
  onRelationshipChange,
  playerTraits,
  dispatch,
  tutorial,
  traits
}) => {
  const relationshipValue = npc.relationship || 0;
  const tierInfo = getTierBenefits(relationshipValue);
  const nextTier = tierInfo.nextTier;
  const progressToNextTier = calculateProgressToNextTier(relationshipValue, tierInfo, nextTier);
  
  // Calculate milestone markers to show on the progress bar
  const milestones: MilestoneMarker[] = [];
  if (nextTier) {
    const currentThreshold = tierInfo.threshold;
    const nextThreshold = nextTier.threshold;
    const range = nextThreshold - currentThreshold;
    
    // Add milestone markers at 25%, 50%, 75%
    for (let i = 1; i <= 3; i++) {
      const milestone = currentThreshold + (range * (i/4));
      milestones.push({ 
        position: ((i * 25)), 
        value: Math.round(milestone) 
      });
    }
  }

  // Handle first-time tutorial for relationships
  React.useEffect(() => {
    if (!tutorial.relationshipShown) {
      dispatch({
        type: 'SET_TUTORIAL_FLAG',
        payload: { flag: 'relationshipShown', value: true }
      });
      
      dispatch({
        type: 'SHOW_TUTORIAL',
        payload: {
          title: 'Relationship System',
          content: 'Build relationships with NPCs to unlock new traits, quests, and trading benefits.',
          step: 'relationship_intro'
        }
      });
    }
  }, [dispatch, tutorial.relationshipShown]);
  
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: tierInfo.color }}>
        Relationship with {npc.name}: {tierInfo.name}
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={(relationshipValue + 100) / 2} // Convert -100...100 to 0...100
        sx={{ 
          height: 8, 
          my: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          '& .MuiLinearProgress-bar': {
            bgcolor: tierInfo.color
          }
        }} 
      />
      
      <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
        {relationshipValue}/100
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Current Benefits:
      </Typography>
      
      <Box component="ul" sx={{ pl: 2, mt: 0 }}>
        {tierInfo.benefits.map((benefit, index) => (
          <Typography component="li" key={index} variant="body2">
            {benefit}
          </Typography>
        ))}
      </Box>
      
      {nextTier && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <span>Path to {nextTier.name}:</span>
              <span>{Math.round(progressToNextTier)}% Complete</span>
            </Typography>
            
            {/* Enhanced progress bar with markers */}
            <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progressToNextTier} 
                sx={{ 
                  height: 12,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: nextTier.color,
                    transition: 'transform 1s ease-in-out'
                  }
                }} 
              />
              
              {/* Milestone markers */}
              {milestones.map((milestone, i) => (
                <Tooltip key={i} title={`${milestone.value} relationship`}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      left: `${milestone.position}%`,
                      height: 20,
                      width: 2,
                      bgcolor: relationshipValue >= milestone.value ? nextTier.color : 'grey.400',
                      zIndex: 1
                    }}
                  />
                </Tooltip>
              ))}
              
              {/* Current position indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: `${progressToNextTier}%`,
                  transform: 'translateX(-50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: nextTier.color,
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'left 1s ease-in-out'
                }}
              />
            </Box>
            
            {/* Points remaining indicator */}
            <Typography variant="body2" sx={{ textAlign: 'right', mt: 1 }}>
              {nextTier.threshold - relationshipValue} more points needed
            </Typography>
          </Box>
          
          <UpcomingTraits npc={npc} nextTier={nextTier} player={player} />
        </>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <RelationshipBenefits 
        currentRelationship={relationshipValue}
        npcType={npc.type}
      />
    </Box>
  );
};

export default RelationshipTab;
