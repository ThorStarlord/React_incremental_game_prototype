import React from 'react';
import { Box, Typography, Grid, LinearProgress, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  selectPlayerName,
  selectPlayerHealth,
  selectPlayerMaxHealth,
  selectPlayerMana,
  selectPlayerAttribute
} from '../../state/PlayerSelectors';
import { RootState } from '../../../../app/store';

interface PlayerStatsProps {
  compact?: boolean;
  showAttributes?: boolean;
  showStats?: boolean;
}

/**
 * PlayerStats Component
 * 
 * Displays player's statistics including health, mana, and attributes
 * 
 * @param {boolean} compact - Whether to show a compact version
 * @param {boolean} showAttributes - Whether to show player attributes
 * @param {boolean} showStats - Whether to show derived stats
 * @returns {JSX.Element} The rendered component
 */
const PlayerStats: React.FC<PlayerStatsProps> = ({
  compact = false,
  showAttributes = true,
  showStats = true
}) => {
  // Get player data from Redux store - Call all hooks unconditionally at the top level
  const playerName = useSelector(selectPlayerName);
  const currentHealth = useSelector(selectPlayerHealth);
  const maxHealth = useSelector(selectPlayerMaxHealth);
  const mana = useSelector((state: RootState) => selectPlayerMana(state));
  const maxMana = useSelector((state: RootState) => state.player.stats.maxMana || 100);
  
  // Attributes (conditionally fetched based on prop, but hook called always)
  const strength = useSelector((state: RootState) => selectPlayerAttribute(state, 'strength'));
  const dexterity = useSelector((state: RootState) => selectPlayerAttribute(state, 'dexterity'));
  const intelligence = useSelector((state: RootState) => selectPlayerAttribute(state, 'intelligence'));
  const vitality = useSelector((state: RootState) => selectPlayerAttribute(state, 'vitality'));

  // Stats (conditionally fetched based on prop, but hook called always)
  const healthRegen = useSelector((state: RootState) => state.player.stats.healthRegen);
  const manaRegen = useSelector((state: RootState) => state.player.stats.manaRegen);
  const critChance = useSelector((state: RootState) => state.player.stats.critChance);
  const dodgeChance = useSelector((state: RootState) => (state.player.stats as any).dodgeChance); 

  // Calculate health percentage
  const healthPercentage = maxHealth ? Math.floor((currentHealth / maxHealth) * 100) : 0;
  
  // Calculate mana percentage
  const manaPercentage = maxMana ? Math.floor((mana / maxMana) * 100) : 0;
  
  if (compact) {
    // Compact view with minimal information
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {playerName}
        </Typography>
        
        {/* Health bar */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">HP</Typography>
            <Typography variant="caption">{currentHealth}/{maxHealth}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={healthPercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              backgroundColor: 'rgba(255,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'error.main'
              }
            }} 
          />
        </Box>
        
        {/* Mana bar */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">MP</Typography>
            <Typography variant="caption">{mana}/{maxMana}</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={manaPercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              backgroundColor: 'rgba(0,0,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'primary.main'
              }
            }} 
          />
        </Box>
      </Box>
    );
  }
  
  // Full view with detailed information
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {playerName}
      </Typography>
      
      {/* Health bar */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Health</Typography>
          <Typography variant="body2">{currentHealth}/{maxHealth}</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={healthPercentage} 
          sx={{ 
            height: 10, 
            borderRadius: 1,
            backgroundColor: 'rgba(255,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'error.main'
            }
          }} 
        />
      </Box>
      
      {/* Mana bar */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Mana</Typography>
          <Typography variant="body2">{mana}/{maxMana}</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={manaPercentage} 
          sx={{ 
            height: 10, 
            borderRadius: 1,
            backgroundColor: 'rgba(0,0,255,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main'
            }
          }} 
        />
      </Box>
      
      {/* Attributes section */}
      {showAttributes && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>Attributes</Typography>
            
            <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Strength</Typography>
              <Typography variant="body2">{strength?.value || 0}</Typography>
            </Box>
            
            <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Dexterity</Typography>
              <Typography variant="body2">{dexterity?.value || 0}</Typography>
            </Box>
            
            <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Intelligence</Typography>
              <Typography variant="body2">{intelligence?.value || 0}</Typography>
            </Box>
            
            <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Vitality</Typography>
              <Typography variant="body2">{vitality?.value || 0}</Typography>
            </Box>
          </Grid>
          
          {/* Stats section */}
          {showStats && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>Stats</Typography>
              
              <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Health Regen</Typography>
                <Typography variant="body2">
                  {healthRegen || 1}/min
                </Typography>
              </Box>
              
              <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Mana Regen</Typography>
                <Typography variant="body2">
                  {manaRegen || 1}/min
                </Typography>
              </Box>
              
              <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Critical Chance</Typography>
                <Typography variant="body2">
                  {critChance || 5}%
                </Typography>
              </Box>
              
              <Box sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Dodge Chance</Typography>
                <Typography variant="body2">
                  {dodgeChance || 2}%
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Paper>
  );
};

export default PlayerStats;
