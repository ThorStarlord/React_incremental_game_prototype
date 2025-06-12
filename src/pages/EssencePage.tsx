import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Box
} from '@mui/material';
import { useAppSelector } from '../app/hooks';
// FIXED: Corrected the import name from selectEssenceStatistics to selectEssenceStats
import {
  selectEssenceStats,
  selectCurrentEssence,
  selectTotalCollected,
  selectGenerationRate,
  selectPerClickValue
} from '../features/Essence/state/EssenceSelectors';
import { ManualEssenceButton } from '../features/Essence/components/ui/ManualEssenceButton';
import { EssenceGenerationTimer } from '../features/Essence/components/ui/EssenceGenerationTimer';

/**
 * Comprehensive Essence management page
 */
const EssencePage: React.FC = React.memo(() => {
  // FIXED: Using the correct selector name
  const essenceStats = useAppSelector(selectEssenceStats);
  const currentEssence = useAppSelector(selectCurrentEssence);
  const totalCollected = useAppSelector(selectTotalCollected);
  const generationRate = useAppSelector(selectGenerationRate);
  const perClickValue = useAppSelector(selectPerClickValue);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Essence Management
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your metaphysical essence - the core resource for trait acquisition,
        emotional connections, and character progression.
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
                  {currentEssence.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Amount
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Manual Generation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                For testing and prototyping purposes
              </Typography>
              <ManualEssenceButton />
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
                  {/* FIXED: Using correct property name `currentEssence` */}
                  <Typography variant="h6">
                    {essenceStats.currentEssence.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Total Collected
                  </Typography>
                  {/* FIXED: Using correct property name `totalCollected` */}
                  <Typography variant="h6">
                    {essenceStats.totalCollected.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Generation Rate
                  </Typography>
                  {/* FIXED: Using correct property name `generationRate` */}
                  <Typography variant="h6">
                    {essenceStats.generationRate.toFixed(2)}/sec
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    Per Click Value
                  </Typography>
                   {/* FIXED: Using correct property name `perClickValue` */}
                  <Typography variant="h6">
                    {essenceStats.perClickValue}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* NPC Connections - Temporarily removing the dynamic part as it doesn't exist on essenceStats */}
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
                N/A
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (Connection tracking to be added)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Future Features */}
        <Grid item xs={12} md={6}>
          <Alert severity="info">
            <Typography variant="h6" gutterBottom>
              Upcoming Features
            </Typography>
            <Typography variant="body2">
              • Emotional connection-based generation<br />
              • NPC relationship depth tracking<br />
              • Trait acquisition cost integration<br />
              • Copy system acceleration<br />
              • Advanced progression mechanics
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
});

EssencePage.displayName = 'EssencePage';

export default EssencePage;