/**
 * @file RelationshipProgress.tsx
 * @description Component for displaying and managing NPC relationship progress
 */

import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Tooltip,
  Paper,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { useAppSelector } from '../../../../app/hooks';
import { selectNPCById, selectRelationshipChanges } from '../state/NPCSelectors';
import { RELATIONSHIP_TIERS } from '../../../../config/relationshipConstants';

// Styled components
const ProgressContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const RelationshipBar = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 6,
  '& .MuiLinearProgress-bar': {
    borderRadius: 6,
  },
}));

const TierIndicator = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const TierMark = styled(Box)<{ position: number; color: string; active: boolean }>(
  ({ theme, position, color, active }) => ({
    position: 'absolute',
    left: `${position}%`,
    top: -6,
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: active ? color : theme.palette.grey[300],
    border: `2px solid ${theme.palette.background.paper}`,
    transform: 'translateX(-50%)',
    zIndex: 1,
  })
);

interface RelationshipProgressProps {
  npcId: string;
  showDetails?: boolean;
  compact?: boolean;
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
  npcId, 
  showDetails = false, 
  compact = false 
}) => {
  const npc = useAppSelector((state) => selectNPCById(state, npcId));
  const recentChanges = useAppSelector(selectRelationshipChanges)
    .filter(change => change.npcId === npcId)
    .slice(-5); // Last 5 changes

  if (!npc) {
    return (
      <Typography variant="body2" color="text.secondary">
        NPC not found
      </Typography>
    );
  }

  const { relationshipValue } = npc;

  // Get current and next tier
  const getCurrentTier = () => {
    const tiers = Object.entries(RELATIONSHIP_TIERS);
    for (const [tierKey, tierData] of tiers) {
      if (relationshipValue >= tierData.min && relationshipValue <= tierData.max) {
        return { key: tierKey, ...tierData };
      }
    }
    return { key: 'NEUTRAL', ...RELATIONSHIP_TIERS.NEUTRAL };
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const tiers = Object.entries(RELATIONSHIP_TIERS);
    const currentIndex = tiers.findIndex(([key]) => key === currentTier.key);
    
    if (currentIndex < tiers.length - 1) {
      const [nextKey, nextData] = tiers[currentIndex + 1];
      return { key: nextKey, ...nextData };
    }
    return null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  // Calculate progress within current tier
  const tierProgress = nextTier 
    ? ((relationshipValue - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  // Get all tier positions for indicators
  const tierPositions = Object.entries(RELATIONSHIP_TIERS).map(([key, tier]) => ({
    key,
    ...tier,
    position: tier.min,
    active: relationshipValue >= tier.min,
  }));

  // Recent change summary
  const getRecentChangesSummary = () => {
    if (recentChanges.length === 0) return null;
    
    const totalChange = recentChanges.reduce((sum, change) => sum + (change.newValue - change.oldValue), 0);
    const isPositive = totalChange > 0;
    
    return {
      total: Math.abs(totalChange),
      isPositive,
      count: recentChanges.length,
    };
  };

  const changesSummary = getRecentChangesSummary();

  if (compact) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <FavoriteIcon 
          sx={{ 
            color: currentTier.color,
            fontSize: 20 
          }} 
        />
        <RelationshipBar
          variant="determinate"
          value={relationshipValue}
          sx={{
            flex: 1,
            '& .MuiLinearProgress-bar': {
              backgroundColor: currentTier.color,
            },
          }}
        />
        <Typography variant="body2" fontWeight="medium">
          {relationshipValue}/100
        </Typography>
      </Box>
    );
  }

  return (
    <ProgressContainer variant="outlined">
      {/* Current Status */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" fontWeight="medium">
          Relationship Level
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {relationshipValue}/100
        </Typography>
      </Box>

      {/* Progress Bar */}
      <RelationshipBar
        variant="determinate"
        value={relationshipValue}
        sx={{
          '& .MuiLinearProgress-bar': {
            backgroundColor: currentTier.color,
          },
        }}
      />

      {/* Tier Indicators */}
      <TierIndicator>
        {tierPositions.map((tier) => (
          <Tooltip 
            key={tier.key}
            title={`${tier.name} (${tier.min}+)`}
            arrow
          >
            <TierMark
              position={tier.position}
              color={tier.color}
              active={tier.active}
            />
          </Tooltip>
        ))}
      </TierIndicator>

      {showDetails && (
        <Grid container spacing={2}>
          {/* Current Tier Info */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              Current Tier
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {currentTier.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentTier.description}
            </Typography>
          </Grid>

          {/* Next Tier Progress */}
          {nextTier && (
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">
                Progress to {nextTier.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <LinearProgress
                  variant="determinate"
                  value={tierProgress}
                  sx={{ 
                    flex: 1, 
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: nextTier.color,
                    },
                  }}
                />
                <Typography variant="caption">
                  {Math.round(tierProgress)}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {nextTier.min - relationshipValue} points needed
              </Typography>
            </Grid>
          )}

          {/* Recent Changes */}
          {changesSummary && (
            <Grid item xs={12}>
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1}
                sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  backgroundColor: changesSummary.isPositive 
                    ? 'success.light' 
                    : 'error.light',
                  color: changesSummary.isPositive 
                    ? 'success.contrastText' 
                    : 'error.contrastText',
                }}
              >
                {changesSummary.isPositive ? (
                  <TrendingUpIcon fontSize="small" />
                ) : (
                  <TrendingDownIcon fontSize="small" />
                )}
                <Typography variant="caption">
                  {changesSummary.isPositive ? '+' : '-'}{changesSummary.total} 
                  {' '}points from {changesSummary.count} recent interaction{changesSummary.count > 1 ? 's' : ''}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </ProgressContainer>
  );
};

export default RelationshipProgress;
