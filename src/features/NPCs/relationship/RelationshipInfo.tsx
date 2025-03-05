import React from 'react';
import { Box, Typography, Divider, LinearProgress, Tooltip } from '@mui/material';
import { calculateProgressToNextTier } from '../../../utils/relationshipUtils';
import UpcomingTraits from './UpcomingTraits';
import { getTierBenefits } from '../../../config/relationshipConstants';

/**
 * Interface for relationship tier information
 */
interface RelationshipTierInfo {
  /** Name of the relationship tier (e.g., "Friend", "Ally") */
  name: string;
  /** Color associated with this tier */
  color: string;
  /** Minimum threshold for this tier */
  threshold: number;
  /** Benefits granted at this tier */
  benefits: string[];
  /** Points needed to reach next tier (if applicable) */
  pointsNeeded?: number;
}

/**
 * Interface for relationship milestone marker
 */
interface MilestoneMarker {
  /** Position as percentage (0-100) */
  position: number;
  /** Relationship value at this milestone */
  value: number;
}

/**
 * Interface for NPC traits data
 */
interface Trait {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description?: string;
  /** Relationship requirement to unlock */
  relationshipRequirement: number;
  /** Other trait properties */
  [key: string]: any;
}

/**
 * Interface for NPC object
 */
interface NPC {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Available traits */
  traits?: Trait[];
  /** Other NPC properties */
  [key: string]: any;
}

/**
 * Interface for Player object
 */
interface Player {
  /** Unlocked traits */
  traits?: string[];
  /** Other player properties */
  [key: string]: any;
}

/**
 * Interface for RelationshipInfo component props
 */
interface RelationshipInfoProps {
  /** Current relationship value (0-100) */
  relationshipValue: number;
  /** NPC data */
  npc: NPC;
  /** Player data */
  player: Player;
}

/**
 * Component that displays detailed relationship information and progression
 * 
 * @param relationshipValue - Current relationship value with the NPC
 * @param npc - The NPC data
 * @param player - Player data
 * @returns Component displaying relationship details and progression
 */
const RelationshipInfo: React.FC<RelationshipInfoProps> = ({ relationshipValue, npc, player }) => {
  const tierInfo: RelationshipTierInfo = getTierBenefits(relationshipValue);
  const nextTier: RelationshipTierInfo | null = tierInfo.nextTier;
  const progressToNextTier: number = calculateProgressToNextTier(relationshipValue, tierInfo, nextTier);
  
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
  
  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: tierInfo.color }}>
        Relationship: {tierInfo.name}
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
      
      <Divider sx={{ my: 1 }} />
      
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
              {nextTier.pointsNeeded} more points needed
            </Typography>
          </Box>
          
          <UpcomingTraits npc={npc} nextTier={nextTier} player={player} />
        </>
      )}
    </Box>
  );
};

export default RelationshipInfo;
