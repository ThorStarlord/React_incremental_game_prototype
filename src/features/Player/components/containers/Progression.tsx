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
import { selectPlayerProgression } from '../../state/PlayerSelectors';
import { StatDisplay } from '../ui/StatDisplay';

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
  const progression = useAppSelector(selectPlayerProgression);

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

  const formattedPlaytime = formatPlaytime(progression.totalPlayTime);

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
                value={formattedPlaytime}  // String value is now properly supported
                color="primary"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Status"
                value={progression.isAlive ? 'Alive' : 'Defeated'}  // String value is now properly supported
                color={progression.isAlive ? 'success' : 'error'}
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
                value={progression.attributePoints}  // Number value works as before
                color="warning"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Skill Points"
                value={progression.skillPoints}  // Number value works as before
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
                  value={progression.attributePoints}
                  color={progression.attributePoints > 0 ? 'warning' : 'secondary'} // Changed from 'default' to 'secondary'
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Unspent Skill Points"
                  value={progression.skillPoints}
                  color={progression.skillPoints > 0 ? 'info' : 'secondary'} // Changed from 'default' to 'secondary'
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
