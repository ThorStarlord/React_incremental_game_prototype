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
  FavoriteBorder,
  SentimentVeryDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied
} from '@mui/icons-material';
import { getRelationshipTier, RELATIONSHIP_THRESHOLDS } from '../../state/NPCTypes';

interface RelationshipProgressProps {
  value: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'compact';
}

/**
 * RelationshipProgress - Visual representation of NPC relationship status
 * 
 * Features:
 * - Progress bar with tier indicators
 * - Current relationship value and tier
 * - Recent relationship changes
 * - Next tier progress indication
 * - Optional detailed breakdown
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
    if (value >= RELATIONSHIP_THRESHOLDS.BELOVED) return <Favorite color="error" />;
    if (value >= RELATIONSHIP_THRESHOLDS.FRIEND) return <SentimentVerySatisfied color="success" />;
    if (value >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return <SentimentSatisfied color="primary" />;
    if (value >= RELATIONSHIP_THRESHOLDS.NEUTRAL) return <SentimentNeutral color="action" />;
    return <SentimentVeryDissatisfied color="error" />;
  };

  const getRelationshipColor = (): 'success' | 'primary' | 'secondary' | 'error' | 'warning' => {
    if (value >= RELATIONSHIP_THRESHOLDS.BELOVED) return 'error';
    if (value >= RELATIONSHIP_THRESHOLDS.TRUSTED) return 'success';
    if (value >= RELATIONSHIP_THRESHOLDS.FRIEND) return 'primary';
    if (value >= RELATIONSHIP_THRESHOLDS.ACQUAINTANCE) return 'secondary';
    if (value >= RELATIONSHIP_THRESHOLDS.NEUTRAL) return 'warning';
    return 'error';
  };

  const barHeight = size === 'small' ? 4 : size === 'medium' ? 6 : 8;

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getRelationshipIcon()}
        <Tooltip title={`${tier}: ${value}/100`}>
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
            label={tier}
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
