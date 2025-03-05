import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider
} from '@mui/material';
import { GameStateContext } from '../../../../context/GameStateContext';
import Panel from './Panel';

/**
 * StatisticsPanel component
 * 
 * Displays detailed game statistics for the player, including collected resources,
 * character progression, and social stats.
 * 
 * @returns {JSX.Element} The rendered StatisticsPanel component
 */
const StatisticsPanel: React.FC = () => {
  const gameState = useContext(GameStateContext);
  const { player, stats } = gameState;
  
  /**
   * Formats large numbers with commas for better readability
   * 
   * @param num - The number to format
   * @returns Formatted number string with commas as thousand separators
   */
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  return (
    <Panel title="Game Statistics">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Player Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Essence Earned:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {formatNumber(player.totalEssenceEarned || 0)}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Current Level:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {player.level || 1}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Acquired Traits:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {player.acquiredTraits?.length || 0}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Equipped Traits:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {player.equippedTraits?.length || 0} / {player.traitSlots || 3}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Learned Skills:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {player.learnedSkills?.length || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Social Stats
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Relationship Growth from Traits:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="medium">
                  {formatNumber(stats?.relationshipGrowthFromTraits || 0)} points
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 1.5, 
                  mt: 1, 
                  bgcolor: 'background.default', 
                  borderRadius: 1,
                  border: '1px dashed',
                  borderColor: player.equippedTraits?.includes('GrowingAffinity') ? 'success.light' : 'divider'
                }}>
                  <Typography 
                    variant="body2" 
                    color={player.equippedTraits?.includes('GrowingAffinity') ? 'success.main' : 'text.secondary'}
                  >
                    {player.equippedTraits?.includes('GrowingAffinity') ? (
                      <>
                        <strong>Growing Affinity active!</strong> Relationships with NPCs are increasing by 1 point every minute.
                      </>
                    ) : (
                      'Equip the Growing Affinity trait to automatically improve NPC relationships over time.'
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Panel>
  );
};

export default StatisticsPanel;
