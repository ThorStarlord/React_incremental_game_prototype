/**
 * @file Progression.tsx
 * @description Container component for player progression and experience tracking
 */

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import {
  Schedule as TimeIcon,
  Star as PointsIcon,
  Psychology as SkillIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../../../app/hooks';
import { selectPlayer } from '../../state/PlayerSelectors';
import { StatDisplay } from '../ui/StatDisplay';
import type { PlayerProgressionData } from '../../state/PlayerTypes';

interface ProgressionProps {
  showDetails?: boolean;
  className?: string;
}

/**
 * Player progression and advancement tracking component
 * Displays playtime, attribute points, and skill points
 */
export const Progression: React.FC<ProgressionProps> = React.memo(({
  showDetails = true,
  className,
}) => {
  const playerState = useAppSelector(selectPlayer);

  // Format total playtime for display
  const formatPlaytime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formattedPlaytime = formatPlaytime(playerState.totalPlaytime);

  return (
    <Box className={className}>
      {/* Character Status */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TimeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Character Progress</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Total Playtime"
                value={formattedPlaytime}
                color="primary"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Status"
                value={playerState.isAlive ? 'Alive' : 'Defeated'}
                color={playerState.isAlive ? 'success' : 'error'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Available Points */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <PointsIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">Available Points</Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Attribute Points"
                value={playerState.availableAttributePoints}
                color="warning"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Skill Points"
                value={playerState.availableSkillPoints}
                color="info"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Character Statistics */}
      {showDetails && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SkillIcon color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">Character Statistics</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Session Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Unspent Attribute Points"
                  value={playerState.availableAttributePoints}
                  color={playerState.availableAttributePoints > 0 ? 'warning' : 'secondary'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Unspent Skill Points"
                  value={playerState.availableSkillPoints}
                  color={playerState.availableSkillPoints > 0 ? 'info' : 'secondary'}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Time Played: {formattedPlaytime}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
});

Progression.displayName = 'Progression';

export default Progression;
