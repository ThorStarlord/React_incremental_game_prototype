import React from 'react';
import { Box, Typography, LinearProgress, Divider, Chip, Tooltip } from '@mui/material';
import { getTierBenefits, canLearnTrait, getRelationshipTier } from '../../../config/relationshipConstants';
import UpcomingTraits from './UpcomingTraits';
import RelationshipBenefits from './RelationshipBenefits';

// Type definitions
interface RelationshipTier {
  name: string;
  color: string;
  threshold: number;
  benefits: string[];
  nextTier?: RelationshipTier;
}

interface MilestoneMarker {
  position: number;
  value: number;
}

interface TraitRequirement {
  relationship: number;
  [key: string]: any;
}

interface NPC {
  id: string;
  relationship: number;
  availableTraits?: string[];
  traitRequirements?: Record<string, TraitRequirement>;
  name: string;
  type?: string;
}

interface Player {
  acquiredTraits: string[];
  seenTraits?: string[];
}

interface Tutorial {
  relationshipShown?: boolean;
  [key: string]: any;
}

interface Trait {
  id: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface RelationshipTabProps {
  npc: NPC;
  player: Player;
  onRelationshipChange: (npcId: string, amount: number) => void;
  playerTraits: string[];
  dispatch: (action: any) => void;
  tutorial: Tutorial;
  traits: Record<string, Trait>;
}

// Adapter for type compatibility in progress calculation
interface ProgressCalculationProps {
  threshold: number;
  min?: number;
  name: string;
  color: string;
  benefits: string[]; // Add required benefits property
  nextTier?: RelationshipTier; // Match the RelationshipTier interface
}

// Helper components
const RelationshipHeader: React.FC<{
  tierInfo: any, // Use more flexible type to accept both RelationshipTier and RelationshipTierInfo
  relationshipValue: number,
  npcName: string
}> = ({ tierInfo, relationshipValue, npcName }) => (
  <>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: tierInfo.color }}>
      Relationship with {npcName}: {tierInfo.name}
    </Typography>
    
    <LinearProgress 
      variant="determinate" 
      value={(relationshipValue + 100) / 2}
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
  </>
);

const BenefitsList: React.FC<{ benefits: string[] }> = ({ benefits }) => (
  <Box component="ul" sx={{ pl: 2, mt: 0 }}>
    {benefits.map((benefit, index) => (
      <Typography component="li" key={index} variant="body2">
        {benefit}
      </Typography>
    ))}
  </Box>
);

const NextTierProgress: React.FC<{
  nextTier: any, // Use more flexible type
  progressToNextTier: number,
  milestones: MilestoneMarker[],
  relationshipValue: number,
  currentThreshold: number
}> = ({ nextTier, progressToNextTier, milestones, relationshipValue, currentThreshold }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" sx={{ 
      fontWeight: 'bold', 
      mb: 1, 
      display: 'flex', 
      justifyContent: 'space-between' 
    }}>
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
);

// Helper functions
const calculateProgressToNextTier = (
  relationship: number, 
  currentTier: RelationshipTier, 
  nextTier: RelationshipTier | null
): number => {
  if (!nextTier) return 100;
  return ((relationship - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
};

const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

const calculateProgress = (
  relationshipValue: number, 
  currentTier: any, 
  nextTier: any
): number => {
  const current: ProgressCalculationProps = {
    threshold: currentTier.threshold || currentTier.min || 0,
    name: currentTier.name,
    color: currentTier.color,
    benefits: currentTier.benefits || [] // Add required benefits property
  };
  
  const next = nextTier ? {
    threshold: nextTier.threshold || nextTier.min || 100,
    name: nextTier.name,
    color: nextTier.color,
    benefits: nextTier.benefits || [] // Add required benefits property
  } : null;
  
  return calculateProgressToNextTier(relationshipValue, current, next);
};

/**
 * Main component that displays and manages NPC relationship information
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
  const progressToNextTier = calculateProgress(relationshipValue, tierInfo, nextTier);
  
  // Calculate milestone markers for the progress bar
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

  // Show tutorial on first view
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
      <RelationshipHeader 
        tierInfo={tierInfo}
        relationshipValue={relationshipValue}
        npcName={npc.name}
      />
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        Current Benefits:
      </Typography>
      
      <BenefitsList benefits={tierInfo.benefits} />
      
      {nextTier && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <NextTierProgress 
            nextTier={nextTier}
            progressToNextTier={progressToNextTier}
            milestones={milestones}
            relationshipValue={relationshipValue}
            currentThreshold={tierInfo.threshold}
          />
          
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
