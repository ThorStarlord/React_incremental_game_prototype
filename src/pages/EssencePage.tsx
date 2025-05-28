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

const EssencePage: React.FC = () => {
  const essence = useAppSelector(selectEssence);
  const statistics = useAppSelector(selectEssenceStatistics);
  const generationRate = useAppSelector(selectGenerationRate);
  const perClickValue = useAppSelector(selectPerClickValue);
  const totalCollected = useAppSelector(selectTotalCollected);

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
        Future updates will include emotional connections with NPCs for passive generation.
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
                Passive Essence generation from emotional connections and relationships.
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

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EssenceIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Connections</Typography>
              </Box>
              
              <Typography variant="h5" color="info.main" gutterBottom>
                {statistics?.activeConnections || 0}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                NPCs contributing to your Essence generation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Future Features Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planned Features
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Emotional Connections
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Form deep emotional bonds with NPCs through meaningful interactions. 
                    Stronger connections generate more Essence over time.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Trait Acquisition
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Spend Essence to acquire traits from NPCs and make them permanent. 
                    Cost scales with trait power and rarity.
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
