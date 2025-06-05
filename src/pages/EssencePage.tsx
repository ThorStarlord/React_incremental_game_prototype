import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import {
  AutoAwesome as EssenceIcon,
  TrendingUp as GenerationIcon,
  Speed as RateIcon,
  TouchApp as ClickIcon
} from '@mui/icons-material';

import { useAppSelector } from '../app/hooks';
import {
  selectEssence,
  selectEssenceStatistics,
  selectGenerationRate,
  selectPerClickValue,
  selectTotalCollected
} from '../features/Essence';
import { selectAllNPCs } from '../features/NPCs/state/NPCSelectors'; // Import NPC selector
import { EssenceConnection } from '../features/Essence/state/EssenceTypes'; // Import EssenceConnection type
import ManualEssenceButton from '../features/Essence/components/ui/ManualEssenceButton'; // Import ManualEssenceButton

const EssencePage: React.FC = () => {
  const essence = useAppSelector(selectEssence);
  const statistics = useAppSelector(selectEssenceStatistics);
  const generationRate = useAppSelector(selectGenerationRate);
  const perClickValue = useAppSelector(selectPerClickValue);
  const totalCollected = useAppSelector(selectTotalCollected);
  const allNPCs = useAppSelector(selectAllNPCs); // Get all NPCs

  // Filter active connections based on whether the NPC exists and has a connection depth > 0
  const activeConnections = Object.values(essence.npcConnections).filter(
    (connection: EssenceConnection) => {
      const npc = allNPCs[connection.npcId];
      return npc !== undefined && connection.connectionDepth > 0;
    }
  );

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatDecimal = (num: number): string => {
    return num.toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Essence Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Essence is the core metaphysical resource that fuels your abilities.
        Passive generation is now influenced by your emotional connections with NPCs.
      </Alert>

      <Grid container spacing={3}>
        {/* Current Essence Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EssenceIcon color="secondary" sx={{ mr: 1, fontSize: '2rem' }} />
                <Typography variant="h6">Current Essence</Typography>
              </Box>

              <Typography variant="h3" color="secondary" gutterBottom>
                {formatNumber(essence.currentEssence)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Your available Essence for spending on traits, abilities, and upgrades.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Generation Rate */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GenerationIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Generation Rate</Typography>
              </Box>

              <Typography variant="h4" color="primary" gutterBottom>
                {formatDecimal(generationRate)}/sec
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Passive Essence generation from your emotional connections with NPCs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RateIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Collected</Typography>
              </Box>

              <Typography variant="h5" color="success.main" gutterBottom>
                {formatNumber(totalCollected)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Lifetime Essence accumulation across all sources.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ClickIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Per Click</Typography>
              </Box>

              <Typography variant="h5" color="warning.main" gutterBottom>
                {formatNumber(perClickValue)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Manual Essence generation for testing and development.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Manual Essence Generation Button */}
        <Grid item xs={12} md={4}>
          <ManualEssenceButton />
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EssenceIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Connections</Typography>
              </Box>

              <Typography variant="h5" color="info.main" gutterBottom>
                {activeConnections.length}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                NPCs currently contributing to your Essence generation.
              </Typography>
              {activeConnections.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {activeConnections.map(connection => {
                    const npc = allNPCs[connection.npcId]; 
                    // Explicit check for npc, though filter should guarantee it exists
                    if (!npc) {
                      // This case should ideally not be reached if filter is correct
                      console.warn(`NPC with ID ${connection.npcId} not found after filtering.`);
                      return null; 
                    }
                    return (
                      <Typography key={connection.npcId} variant="caption" display="block" color="text.secondary">
                        - {npc.name || connection.npcId}: {connection.connectionDepth.toFixed(1)} depth
                      </Typography>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Future Features Preview - Adjusted to reflect current progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planned Features
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Trait Acquisition Cost
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Spend Essence to acquire traits from NPCs. Cost scales with trait power and rarity. (Currently, only trait permanence costs Essence).
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Copy System Integration
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Use Essence for accelerated Copy growth and enhanced capabilities.
                    Create powerful extensions of your will.
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Abilities
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Unlock unique abilities and upgrades through Essence investment.
                    Influence emotions and enhance your social capabilities.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default React.memo(EssencePage);
