import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box
} from '@mui/material';
import { useAppSelector } from '../app/hooks';
import {
  selectEssenceStats,
  selectCurrentEssence,
} from '../features/Essence/state/EssenceSelectors';
import { selectActiveConnectionCount } from '../features/NPCs/state/NPCSelectors';
// Ensure imports point to the correct components from the barrel file
import { EssenceGenerationTimer } from '../features/Essence/components';

/**
 * Comprehensive Essence management page
 */
const EssencePage: React.FC = React.memo(() => {
  const essenceStats = useAppSelector(selectEssenceStats);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const activeConnections = useAppSelector(selectActiveConnectionCount);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Essence Management
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Essence is the resource used to stabilize permanent Trait Resonance. Its generation
        reflects your active relationships and other qualified sources.
      </Typography>

      <Grid container spacing={3}>
        {/* Main Essence Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Essence
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" color="primary">
                  {currentEssence.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Amount
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </Grid>

        {/* Generation Tracking */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generation Tracking
              </Typography>
              <EssenceGenerationTimer />
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Dashboard */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Essence Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Current Amount
                  </Typography>
                  <Typography variant="h6">
                    {essenceStats.currentEssence.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Collected
                  </Typography>
                  <Typography variant="h6">
                    {essenceStats.totalCollected.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Generation Rate
                  </Typography>
                  <Typography variant="h6">
                    {essenceStats.generationRate.toFixed(2)}/sec
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* NPC Connections */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Connections
              </Typography>
              <Typography variant="body2" color="text.secondary">
                NPCs contributing to Essence generation
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mt: 2 }}>
                {activeConnections}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {activeConnections === 1 ? 'NPC' : 'NPCs'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Container>
  );
});

EssencePage.displayName = 'EssencePage';

export default EssencePage;
