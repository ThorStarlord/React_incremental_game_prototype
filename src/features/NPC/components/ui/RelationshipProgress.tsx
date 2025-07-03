/**
 * @file RelationshipProgress.tsx
 * @description Component for displaying and managing NPC relationship progress
 */

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Favorite,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied
} from '@mui/icons-material';
// FIXED: Changed the import path from NPCTypes.ts to the correct config file.
// Also changed RELATIONSHIP_THRESHOLDS to RELATIONSHIP_TIERS.
import { getRelationshipTier, RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

interface RelationshipProgressProps {
  value: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact';
}

/**
 * RelationshipProgress - Visual representation of NPC relationship status
 */
const RelationshipProgress: React.FC<RelationshipProgressProps> = ({
  value,
  showLabel = true,
  size = 'medium',
  variant = 'default'
}) => {
  const percentage = Math.max(0, (value + 100) / 2);
  const tier = getRelationshipTier(value);
  
  const getRelationshipIcon = () => {
    // FIXED: Using RELATIONSHIP_TIERS.TIER_NAME.min instead of the old constant.
    if (value >= RELATIONSHIP_TIERS.BELOVED.min) return <Favorite color="error" />;
    if (value >= RELATIONSHIP_TIERS.FRIEND.min) return <SentimentVerySatisfied color="success" />;
    if (value >= RELATIONSHIP_TIERS.ACQUAINTANCE.min) return <SentimentSatisfied color="primary" />;
    if (value >= RELATIONSHIP_TIERS.NEUTRAL.min) return <SentimentNeutral color="action" />;
    return <SentimentVeryDissatisfied color="error" />;
  };

  const getRelationshipColor = (): 'success' | 'primary' | 'secondary' | 'error' | 'warning' => {
    // FIXED: Using RELATIONSHIP_TIERS.TIER_NAME.min instead of the old constant.
    if (value >= RELATIONSHIP_TIERS.BELOVED.min) return 'error';
    if (value >= RELATIONSHIP_TIERS.TRUSTED.min) return 'success';
    if (value >= RELATIONSHIP_TIERS.FRIEND.min) return 'primary';
    if (value >= RELATIONSHIP_TIERS.ACQUAINTANCE.min) return 'secondary';
    if (value >= RELATIONSHIP_TIERS.NEUTRAL.min) return 'warning';
    return 'error';
  };

  const barHeight = size === 'small' ? 4 : size === 'medium' ? 6 : 8;

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getRelationshipIcon()}
        <Tooltip title={`${tier.name}: ${value}/100`}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={getRelationshipColor()}
            sx={{ 
              flexGrow: 1, 
              height: barHeight, 
              borderRadius: 2 
            }}
          />
        </Tooltip>
        {showLabel && (
          <Typography variant="caption" color="text.secondary">
            {value}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Relationship
          </Typography>
          <Chip
            icon={getRelationshipIcon()}
            label={tier.name}
            size="small"
            color={getRelationshipColor()}
            variant="outlined"
          />
        </Box>
      )}
      
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={getRelationshipColor()}
        sx={{ height: barHeight, borderRadius: 2 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {value}/100
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {Math.round(percentage)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(RelationshipProgress);