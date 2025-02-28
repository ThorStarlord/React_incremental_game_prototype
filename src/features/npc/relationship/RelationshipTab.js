import React from 'react';
import { Box, Typography, LinearProgress, Divider, Chip, Tooltip } from '@mui/material';
import { getTierBenefits } from '../../../config/relationshipConstants';
import { canLearnTrait } from '../../../config/relationshipConstants';

// Helper function to calculate progress to the next tier
const calculateProgressToNextTier = (relationship, currentTier, nextTier) => {
  if (!nextTier) return 100; // Max progress if no next tier
  return ((relationship - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100;
};

// Helper function to convert hex to rgb for animation
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '0, 0, 0';
};

// Component to show upcoming traits
const UpcomingTraits = ({ npc, nextTier, player }) => {
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

const RelationshipTab = ({ 
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
  const milestones = [];
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
              {nextTier.threshold - relationshipValue} more points needed
            </Typography>
          </Box>
          
          <UpcomingTraits npc={npc} nextTier={nextTier} player={player} />
        </>
      )}
    </Box>
  );
};

export default RelationshipTab;