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
// FIXED: Removed selectAvailableSkillPoints and corrected selectEquippedTraits to selectEquippedTraits
import {
  selectTotalPlaytime,
  selectIsPlayerAlive,
  selectAvailableAttributePoints,
  selectResonanceLevel,
  selectMaxTraitSlots,
  selectPermanentTraits,
  selectEquippedTraits // Corrected name
} from '../../state/PlayerSelectors';
import { StatDisplay } from '../ui/StatDisplay';
import { PlayerState } from '../../state/PlayerTypes'; // Import PlayerState to get availableSkillPoints

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
  // Use individual selectors instead of direct state access
  const totalPlaytime = useAppSelector(selectTotalPlaytime);
  const isAlive = useAppSelector(selectIsPlayerAlive);
  const attributePoints = useAppSelector(selectAvailableAttributePoints);
  // FIXED: Get availableSkillPoints from the main player state
  const skillPoints = useAppSelector((state: {player: PlayerState}) => state.player.availableSkillPoints);
  const resonanceLevel = useAppSelector(selectResonanceLevel);
  const maxTraitSlots = useAppSelector(selectMaxTraitSlots);
  const permanentTraits = useAppSelector(selectPermanentTraits);
  const equippedTraits = useAppSelector(selectEquippedTraits); // Corrected selector

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

  const formattedPlaytime = formatPlaytime(totalPlaytime);
  const equippedCount = equippedTraits.length;

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
                value={isAlive ? 'Alive' : 'Defeated'}
                color={isAlive ? 'success' : 'error'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Resonance Level"
                value={resonanceLevel}
                color="secondary"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Max Trait Slots"
                value={maxTraitSlots}
                color="info"
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
                value={attributePoints}
                color="warning"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StatDisplay
                label="Skill Points"
                value={skillPoints}
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
                  value={attributePoints}
                  color={attributePoints > 0 ? 'warning' : 'secondary'}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Unspent Skill Points"
                  value={skillPoints}
                  color={skillPoints > 0 ? 'info' : 'secondary'}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Permanent Traits"
                  value={permanentTraits.length}
                  color="success"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StatDisplay
                  label="Active Trait Slots"
                  value={`${equippedCount} / ${maxTraitSlots}`}
                  color="primary"
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