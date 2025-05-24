import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Button,
  Alert,
  AlertTitle,
  Chip
} from '@mui/material';
import { 
  AutoAwesome as EssenceIcon,
  TouchApp as ClickIcon,
  Speed as GenerationIcon,
  Group as ConnectionIcon
} from '@mui/icons-material';
import { useAppSelector } from '../app/hooks';
import { selectEssence } from '../features/Essence/state/EssenceSelectors';
import { EssenceDisplay } from '../features/Essence';

/**
 * EssencePage component provides a comprehensive interface for Essence management
 * 
 * Features:
 * - Current Essence display with visual representation
 * - Statistics dashboard with generation metrics
 * - Integration points for future Essence features
 * - Clear development status communication
 */
const EssencePage: React.FC = React.memo(() => {
  const essenceState = useAppSelector(selectEssence);

  // Placeholder for manual essence generation (development/testing)
  const handleManualGeneration = () => {
    // TODO: Implement manual essence generation
    console.log('Manual essence generation clicked');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Essence Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Core metaphysical resource for trait acquisition and Copy enhancement
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Essence Display */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EssenceIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Current Essence
                </Typography>
              </Box>
              <EssenceDisplay />
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics Dashboard */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Essence Statistics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Amount
                </Typography>
                <Typography variant="h6">
                  {essenceState.amount.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Collected
                </Typography>
                <Typography variant="h6">
                  {essenceState.totalCollected.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Generation Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GenerationIcon sx={{ fontSize: 20, color: 'success.main' }} />
                  <Typography variant="h6">
                    {essenceState.generationRate.toFixed(2)}/sec
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Per Click Value
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClickIcon sx={{ fontSize: 20, color: 'info.main' }} />
                  <Typography variant="h6">
                    {essenceState.perClick}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Active Connections
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ConnectionIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                  <Typography variant="h6">
                    {essenceState.npcConnections}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Manual Generation (Development/Testing) */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manual Generation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                For development and testing purposes
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<TouchApp />}
                onClick={handleManualGeneration}
                fullWidth
                sx={{ mb: 1 }}
              >
                Generate Essence (+{essenceState.perClick})
              </Button>
              
              <Chip 
                label="Development Feature" 
                size="small" 
                color="secondary"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Future Features Preview */}
        <Grid item xs={12} md={6}>
          <Alert severity="info">
            <AlertTitle>Upcoming Essence Features</AlertTitle>
            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
              • Emotional connections with NPCs for passive generation<br/>
              • Trait acquisition costs and mechanics<br/>
              • Copy system acceleration and enhancement<br/>
              • Advanced Essence generation multipliers<br/>
              • Connection depth tracking and management
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
});

EssencePage.displayName = 'EssencePage';

export { EssencePage };
